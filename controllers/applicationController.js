const mongoose = require("mongoose");

const Application = require("../models/Application");
const Scheme = require("../models/Scheme");

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.2";

const normalizeDocumentName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const cleanUploadedDocuments = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }

  const seen = new Set();

  return documents
    .map((document) => {
      if (typeof document === "string") {
        return { name: document.trim(), fileName: "" };
      }

      return {
        name: String(document?.name || "").trim(),
        fileName: String(document?.fileName || "").trim(),
      };
    })
    .filter((document) => {
      const normalized = normalizeDocumentName(document.name);
      if (!normalized || seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getSchemeById = async (schemeId) => {
  if (!mongoose.Types.ObjectId.isValid(schemeId)) {
    return null;
  }

  return Scheme.findOne({ _id: schemeId, active: true }).lean();
};

const getMissingDocuments = (requiredDocuments, uploadedDocuments) => {
  const uploadedNames = new Set(
    uploadedDocuments
      .filter((document) => document.fileName)
      .map((document) => normalizeDocumentName(document.name))
  );
  return (requiredDocuments || []).filter((document) => !uploadedNames.has(normalizeDocumentName(document)));
};

const getUserId = (body) => String(body.userId || "guest-user").trim() || "guest-user";
const getPreferredLanguage = (body) => String(body.preferredLanguage || body.language || "hi").trim() || "hi";
const getOfficialApiAvailable = (scheme) => Boolean(scheme.officialApiAvailable);
const getOfficialApplyUrl = (scheme) => scheme.applyLink || scheme.officialApplyUrl || "";

const extractOutputText = (responseBody) => {
  if (responseBody.output_text) {
    return responseBody.output_text;
  }

  return (responseBody.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text)
    .join("\n")
    .trim();
};

const parseJsonText = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
};

const guessDocumentFromFileName = (fileName, requiredDocuments) => {
  const normalizedFileName = normalizeDocumentName(fileName).replace(/[_-]/g, " ");

  const matchedDocument = (requiredDocuments || []).find((document) => {
    const words = normalizeDocumentName(document)
      .split(" ")
      .filter((word) => word.length > 2);

    return words.some((word) => normalizedFileName.includes(word));
  });

  return matchedDocument || "Please check manually";
};

const buildFallbackAiAssistance = ({ scheme, uploadedDocuments, missingDocuments, language, question }) => {
  const requiredDocuments = scheme.documentsRequired || [];
  const allReady = !missingDocuments.length;
  const fallbackCopy = {
    en: {
      answer: "Please check final details on the official government portal.",
      draftMissing: "Draft is not ready yet",
      draftReady: "Draft is ready",
      eligibilityPrefix: "This scheme may help you. Basic eligibility:",
      missingPrefix: "Missing documents:",
      note: "Please check this document before final confirmation.",
      stepCheck: "Answer each document question.",
      stepMissing: "Collect the missing documents shown on the screen.",
      stepReady: "All listed documents are marked as available.",
      stepPortal: "Use Final Confirm & Continue to open the official government portal.",
      translation: "AI will guide you step by step in your selected language.",
    },
    hi: {
      answer: "अंतिम जानकारी के लिए आधिकारिक सरकारी पोर्टल देखें।",
      draftMissing: "ड्राफ्ट अभी तैयार नहीं है",
      draftReady: "ड्राफ्ट तैयार है",
      eligibilityPrefix: "यह योजना आपकी मदद कर सकती है। मूल पात्रता:",
      missingPrefix: "छूटे हुए दस्तावेज:",
      note: "अंतिम पुष्टि से पहले इस दस्तावेज की जांच करें।",
      stepCheck: "हर दस्तावेज के सवाल का जवाब दें।",
      stepMissing: "स्क्रीन पर दिखे छूटे हुए दस्तावेज इकट्ठा करें।",
      stepReady: "सभी जरूरी दस्तावेज उपलब्ध बताए गए हैं।",
      stepPortal: "Final Confirm & Continue दबाकर आधिकारिक सरकारी पोर्टल खोलें।",
      translation: "AI आपकी चुनी हुई भाषा में कदम-कदम पर मदद करेगा।",
    },
    kn: {
      answer: "ಅಂತಿಮ ಮಾಹಿತಿಗಾಗಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ನೋಡಿ.",
      draftMissing: "ಕರಡು ಇನ್ನೂ ಸಿದ್ಧವಾಗಿಲ್ಲ",
      draftReady: "ಕರಡು ಸಿದ್ಧವಾಗಿದೆ",
      eligibilityPrefix: "ಈ ಯೋಜನೆ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಮೂಲ ಅರ್ಹತೆ:",
      missingPrefix: "ಕಾಣೆಯಾದ ದಾಖಲೆಗಳು:",
      note: "ಅಂತಿಮ ದೃಢೀಕರಣಕ್ಕೂ ಮೊದಲು ಈ ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
      stepCheck: "ಪ್ರತಿ ದಾಖಲೆ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ.",
      stepMissing: "ಸ್ಕ್ರೀನ್‌ನಲ್ಲಿ ಕಾಣುವ ಕಾಣೆಯಾದ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.",
      stepReady: "ಎಲ್ಲಾ ಅಗತ್ಯ ದಾಖಲೆಗಳು ಲಭ್ಯ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.",
      stepPortal: "Final Confirm & Continue ಒತ್ತಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ.",
      translation: "AI ನಿಮ್ಮ ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ ಹಂತ ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
    },
  };
  const localText = fallbackCopy[language] || fallbackCopy.hi;
  const documentGuesses = uploadedDocuments.map((document) => ({
    fileName: document.fileName || document.name,
    likelyDocument: guessDocumentFromFileName(document.fileName || document.name, requiredDocuments),
    confidence: document.fileName ? "medium" : "low",
    note: localText.note,
  }));

  return {
    aiEnabled: false,
    provider: "guided assistant",
    eligibilityExplanation: `${localText.eligibilityPrefix} ${scheme.eligibility}`,
    simpleSteps: [
      localText.stepCheck,
      allReady ? localText.stepReady : localText.stepMissing,
      localText.stepPortal,
    ],
    documentGuesses,
    draftSummary: allReady
      ? `${localText.draftReady}: ${scheme.name}.`
      : `${localText.draftMissing}: ${scheme.name}. ${localText.missingPrefix} ${missingDocuments.join(", ")}.`,
    translatedInstructions: {
      language: language || "en",
      text: localText.translation,
    },
    answer: question ? localText.answer : "",
    safetyNotice:
      "Your application draft is prepared. Final submission will happen only through the official government portal or official API integration.",
  };
};

const callOpenAiAssistance = async ({ scheme, uploadedDocuments, missingDocuments, language, question }) => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      eligibilityExplanation: { type: "string" },
      simpleSteps: {
        type: "array",
        items: { type: "string" },
      },
      documentGuesses: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            fileName: { type: "string" },
            likelyDocument: { type: "string" },
            confidence: { type: "string" },
            note: { type: "string" },
          },
          required: ["fileName", "likelyDocument", "confidence", "note"],
        },
      },
      draftSummary: { type: "string" },
      translatedInstructions: {
        type: "object",
        additionalProperties: false,
        properties: {
          language: { type: "string" },
          text: { type: "string" },
        },
        required: ["language", "text"],
      },
      answer: { type: "string" },
      safetyNotice: { type: "string" },
    },
    required: [
      "eligibilityExplanation",
      "simpleSteps",
      "documentGuesses",
      "draftSummary",
      "translatedInstructions",
      "answer",
      "safetyNotice",
    ],
  };

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_OPENAI_MODEL,
      input: [
        {
          role: "developer",
          content:
            "You help Indian citizens prepare government scheme application drafts. Use the requested language. Use very simple language for rural users. Never claim that the app submits to government portals. Keep answers short and practical. Return only valid JSON.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Explain eligibility, guess document types from file names, create draft summary, translate simple instructions, and answer the user's question if present.",
            scheme: {
              name: scheme.name,
              benefits: scheme.benefits,
              eligibility: scheme.eligibility,
              requiredDocuments: scheme.documentsRequired || [],
            },
            uploadedDocuments,
            missingDocuments,
            language: language || "en",
            question: question || "",
            requiredSafetyNotice:
              "Your application draft is prepared. Final submission will happen only through the official government portal or official API integration.",
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "yojana_application_assistance",
          strict: true,
          schema,
        },
      },
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || "OpenAI request failed");
  }

  const parsed = parseJsonText(extractOutputText(body));

  if (!parsed) {
    throw new Error("OpenAI returned an unreadable response");
  }

  return {
    aiEnabled: true,
    provider: "OpenAI Responses API",
    ...parsed,
  };
};

const getApplyRequirements = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Application requirements need MongoDB scheme data.",
      });
    }

    const scheme = await getSchemeById(req.params.schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    return res.json({
      success: true,
      scheme: {
        id: scheme._id,
        name: scheme.name,
        description: scheme.benefits,
        eligibility: scheme.eligibility,
        requiredDocuments: scheme.documentsRequired || [],
        applyLink: getOfficialApplyUrl(scheme),
        officialApplyUrl: getOfficialApplyUrl(scheme),
        officialApiAvailable: getOfficialApiAvailable(scheme),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load application requirements" });
  }
};

const saveApplication = async ({
  userId,
  scheme,
  uploadedDocuments,
  missingDocuments,
  status,
  preferredLanguage,
  isUserConfirmed = false,
}) =>
  Application.findOneAndUpdate(
    { userId, schemeId: scheme._id },
    {
      $set: {
        schemeName: scheme.name,
        preferredLanguage,
        uploadedDocuments,
        missingDocuments,
        applicationStatus: status,
        isUserConfirmed,
        officialApiAvailable: getOfficialApiAvailable(scheme),
        officialApplyUrl: getOfficialApplyUrl(scheme),
      },
      $setOnInsert: {
        schemeId: scheme._id,
        userId,
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true }
  ).lean();

const uploadDocuments = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Document draft storage needs MongoDB.",
      });
    }

    const scheme = await getSchemeById(req.body.schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    const uploadedDocuments = cleanUploadedDocuments(req.body.uploadedDocuments);
    const missingDocuments = getMissingDocuments(scheme.documentsRequired, uploadedDocuments);
    const application = await saveApplication({
      userId: getUserId(req.body),
      scheme,
      uploadedDocuments,
      missingDocuments,
      preferredLanguage: getPreferredLanguage(req.body),
      status: missingDocuments.length ? "Incomplete" : "Draft",
    });

    return res.json({
      success: true,
      message: "Documents saved for draft checking",
      application,
      missingDocuments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not save uploaded documents" });
  }
};

const prepareDraft = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Application draft preparation needs MongoDB.",
      });
    }

    const scheme = await getSchemeById(req.body.schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    const uploadedDocuments = cleanUploadedDocuments(req.body.uploadedDocuments);
    const missingDocuments = getMissingDocuments(scheme.documentsRequired, uploadedDocuments);
    const allDocumentsReady = missingDocuments.length === 0;
    const applicationStatus = allDocumentsReady ? "Draft" : "Incomplete";

    const application = await saveApplication({
      userId: getUserId(req.body),
      scheme,
      uploadedDocuments,
      missingDocuments,
      preferredLanguage: getPreferredLanguage(req.body),
      status: applicationStatus,
    });

    return res.json({
      success: true,
      message: allDocumentsReady
        ? "Draft saved successfully"
        : "Some documents are still missing. Please keep them ready before final submission.",
      application,
      missingDocuments,
      applicationStatus,
      isDraftReady: allDocumentsReady,
      officialApiAvailable: getOfficialApiAvailable(scheme),
      officialApplyUrl: getOfficialApplyUrl(scheme),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not prepare application draft" });
  }
};

const confirmApply = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Confirm apply needs MongoDB.",
      });
    }

    const scheme = await getSchemeById(req.body.schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    const userId = getUserId(req.body);
    const uploadedDocuments = cleanUploadedDocuments(req.body.uploadedDocuments);
    const missingDocuments = getMissingDocuments(scheme.documentsRequired, uploadedDocuments);

    if (missingDocuments.length) {
      const application = await saveApplication({
        userId,
        scheme,
        uploadedDocuments,
        missingDocuments,
        preferredLanguage: getPreferredLanguage(req.body),
        status: "Incomplete",
        isUserConfirmed: false,
      });

      return res.status(400).json({
        success: false,
        message: "Please upload all required documents before confirming.",
        application,
        missingDocuments,
      });
    }

    const officialApiAvailable = getOfficialApiAvailable(scheme);
    const applicationStatus = officialApiAvailable ? "Submitted" : "Redirected";
    const application = await saveApplication({
      userId,
      scheme,
      uploadedDocuments,
      missingDocuments,
      preferredLanguage: getPreferredLanguage(req.body),
      status: applicationStatus,
      isUserConfirmed: true,
    });

    return res.json({
      success: true,
      message: officialApiAvailable
        ? "Your application was submitted through the official API integration."
        : "Final submission will happen on the official government portal. I will guide you.",
      application,
      applicationStatus,
      isUserConfirmed: true,
      officialApiAvailable,
      officialApplyUrl: getOfficialApplyUrl(scheme),
      shouldRedirect: !officialApiAvailable,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not confirm application" });
  }
};

const getAiAssistance = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. AI assistance needs MongoDB scheme data.",
      });
    }

    const scheme = await getSchemeById(req.body.schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    const uploadedDocuments = cleanUploadedDocuments(req.body.uploadedDocuments);
    const missingDocuments = Array.isArray(req.body.missingDocuments)
      ? req.body.missingDocuments.map((document) => String(document || "").trim()).filter(Boolean)
      : getMissingDocuments(scheme.documentsRequired, uploadedDocuments);
    const context = {
      scheme,
      uploadedDocuments,
      missingDocuments,
      language: req.body.language || "en",
      question: req.body.question || "",
    };

    let assistance;

    try {
      assistance = await callOpenAiAssistance(context);
    } catch (error) {
      assistance = {
        ...buildFallbackAiAssistance(context),
        aiError: error.message,
      };
    }

    if (!assistance) {
      assistance = buildFallbackAiAssistance(context);
    }

    await Application.findOneAndUpdate(
      { userId: getUserId(req.body), schemeId: scheme._id },
      {
        $set: {
          schemeName: scheme.name,
          preferredLanguage: getPreferredLanguage(req.body),
          uploadedDocuments,
          missingDocuments,
          draftSummary: assistance.draftSummary || "",
          aiInsights: assistance,
          officialApiAvailable: getOfficialApiAvailable(scheme),
          officialApplyUrl: getOfficialApplyUrl(scheme),
        },
        $setOnInsert: {
          userId: getUserId(req.body),
          schemeId: scheme._id,
          applicationStatus: missingDocuments.length ? "Incomplete" : "Ready",
        },
      },
      { upsert: true, runValidators: true }
    );

    return res.json({
      success: true,
      assistance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not create AI assistance" });
  }
};

module.exports = {
  confirmApply,
  getAiAssistance,
  getApplyRequirements,
  prepareDraft,
  uploadDocuments,
};
