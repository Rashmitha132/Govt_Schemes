const schemeId = window.location.pathname.split("/").filter(Boolean).pop();

const els = {
  availableDocuments: document.getElementById("availableDocuments"),
  availableTitle: document.getElementById("availableTitle"),
  assistantMessage: document.getElementById("assistantMessage"),
  backButton: document.getElementById("backButton"),
  continueButton: document.getElementById("continueButton"),
  documentQuestion: document.getElementById("documentQuestion"),
  documentUpload: document.getElementById("documentUpload"),
  draftSummary: document.getElementById("draftSummary"),
  finalPanel: document.getElementById("finalPanel"),
  finalTitle: document.getElementById("finalTitle"),
  flowTitle: document.getElementById("flowTitle"),
  missingDocuments: document.getElementById("missingDocuments"),
  missingTitle: document.getElementById("missingTitle"),
  noButton: document.getElementById("noButton"),
  noText: document.getElementById("noText"),
  progressBar: document.getElementById("progressBar"),
  questionLabel: document.getElementById("questionLabel"),
  repeatButton: document.getElementById("repeatButton"),
  safetyLine: document.getElementById("safetyLine"),
  saveDraftButton: document.getElementById("saveDraftButton"),
  schemeName: document.getElementById("schemeName"),
  skipUploadButton: document.getElementById("skipUploadButton"),
  statusBadge: document.getElementById("statusBadge"),
  stepText: document.getElementById("stepText"),
  toast: document.getElementById("toast"),
  uploadLabel: document.getElementById("uploadLabel"),
  uploadPanel: document.getElementById("uploadPanel"),
  voiceAnswerButton: document.getElementById("voiceAnswerButton"),
  yesButton: document.getElementById("yesButton"),
  yesText: document.getElementById("yesText"),
};

const speechLangCodes = { en: "en-IN", hi: "hi-IN", kn: "kn-IN" };

const copy = {
  en: {
    available: "Available documents",
    back: "Back",
    confirmed: "Confirmed",
    continue: "Confirm & Apply",
    draftReady: "Your application is ready. Please confirm to continue.",
    finalTitle: "Application draft",
    flowTitle: "AI Assisted Apply",
    hasDocument: "Do you have this document?",
    hearAgain: "Hear again",
    incomplete: "Incomplete",
    loading: "Please wait. AI is preparing your application helper.",
    missing: "Missing documents",
    no: "No, I do not have it",
    noDocs: "None",
    portalGuidance: "Final submission will happen on the official government portal. I will guide you.",
    questionLabel: "Document question",
    redirected: "Redirected",
    safety: "AI will prepare your application and guide you. Final submission happens only on the official government portal or official API.",
    schemeIntro: "I will explain this scheme and help prepare your application draft.",
    speak: "Speak Yes/No",
    statusDraftReady: "Draft Ready",
    step: "Document",
    submitted: "Submitted",
    upload: "Upload or capture photo",
    uploadLater: "I will upload later",
    voiceNo: "I marked No.",
    voiceNotSupported: "Voice answer is not supported here. Please tap Yes or No.",
    voiceYes: "I marked Yes.",
    yes: "Yes, I have it",
  },
  hi: {
    available: "उपलब्ध दस्तावेज",
    back: "पीछे",
    confirmed: "पुष्टि हो गई",
    continue: "पुष्टि करें और आवेदन करें",
    draftReady: "Your application is ready. Please confirm to continue.",
    finalTitle: "आवेदन ड्राफ्ट",
    flowTitle: "AI सहायता आवेदन",
    hasDocument: "क्या आपके पास यह दस्तावेज है?",
    hearAgain: "फिर से सुनें",
    incomplete: "अधूरा",
    loading: "कृपया रुकें। AI आपका आवेदन सहायक तैयार कर रहा है।",
    missing: "छूटे हुए दस्तावेज",
    no: "नहीं, मेरे पास नहीं है",
    noDocs: "कोई नहीं",
    portalGuidance: "Final submission will happen on the official government portal. I will guide you.",
    questionLabel: "दस्तावेज प्रश्न",
    redirected: "पोर्टल पर भेजा गया",
    safety: "AI आपका आवेदन तैयार करेगा और मार्गदर्शन देगा। अंतिम जमा केवल आधिकारिक सरकारी पोर्टल या आधिकारिक API पर होगा।",
    schemeIntro: "मैं इस योजना को सरल शब्दों में समझाऊंगा और आवेदन ड्राफ्ट तैयार करने में मदद करूंगा।",
    speak: "बोलकर Yes/No बताएं",
    statusDraftReady: "ड्राफ्ट तैयार",
    step: "दस्तावेज",
    submitted: "जमा हो गया",
    upload: "फोटो लें या फाइल अपलोड करें",
    uploadLater: "मैं बाद में अपलोड करूंगा",
    voiceNo: "मैंने नहीं चुना है।",
    voiceNotSupported: "यहां आवाज से जवाब उपलब्ध नहीं है। कृपया Yes या No दबाएं।",
    voiceYes: "मैंने हां चुना है।",
    yes: "हां, मेरे पास है",
  },
  kn: {
    available: "ಲಭ್ಯ ದಾಖಲೆಗಳು",
    back: "ಹಿಂದೆ",
    confirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    continue: "ದೃಢೀಕರಿಸಿ ಅರ್ಜಿ ಮಾಡಿ",
    draftReady: "Your application is ready. Please confirm to continue.",
    finalTitle: "ಅರ್ಜಿ ಕರಡು",
    flowTitle: "AI ಸಹಾಯಿತ ಅರ್ಜಿ",
    hasDocument: "ಈ ದಾಖಲೆ ನಿಮ್ಮ ಬಳಿ ಇದೆಯೇ?",
    hearAgain: "ಮತ್ತೆ ಕೇಳಿ",
    incomplete: "ಅಪೂರ್ಣ",
    loading: "ದಯವಿಟ್ಟು ಕಾಯಿರಿ. AI ನಿಮ್ಮ ಅರ್ಜಿ ಸಹಾಯಕರನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ.",
    missing: "ಕಾಣೆಯಾದ ದಾಖಲೆಗಳು",
    no: "ಇಲ್ಲ, ನನ್ನ ಬಳಿ ಇಲ್ಲ",
    noDocs: "ಯಾವುದೂ ಇಲ್ಲ",
    portalGuidance: "Final submission will happen on the official government portal. I will guide you.",
    questionLabel: "ದಾಖಲೆ ಪ್ರಶ್ನೆ",
    redirected: "ಪೋರ್ಟಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",
    safety: "AI ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ಅಂತಿಮ ಸಲ್ಲಿಕೆ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಅಥವಾ ಅಧಿಕೃತ API ಯಲ್ಲೇ ನಡೆಯುತ್ತದೆ.",
    schemeIntro: "ನಾನು ಈ ಯೋಜನೆಯನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಿ ಅರ್ಜಿ ಕರಡು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    speak: "ಮಾತಿನಲ್ಲಿ Yes/No ಹೇಳಿ",
    statusDraftReady: "ಕರಡು ಸಿದ್ಧ",
    step: "ದಾಖಲೆ",
    submitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    upload: "ಫೋಟೋ ತೆಗೆದು ಅಥವಾ ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    uploadLater: "ನಾನು ನಂತರ ಅಪ್ಲೋಡ್ ಮಾಡುತ್ತೇನೆ",
    voiceNo: "ನಾನು ಇಲ್ಲ ಎಂದು ಗುರುತಿಸಿದ್ದೇನೆ.",
    voiceNotSupported: "ಇಲ್ಲಿ ಧ್ವನಿ ಉತ್ತರ ಬೆಂಬಲವಿಲ್ಲ. ದಯವಿಟ್ಟು Yes ಅಥವಾ No ಒತ್ತಿ.",
    voiceYes: "ನಾನು ಹೌದು ಎಂದು ಗುರುತಿಸಿದ್ದೇನೆ.",
    yes: "ಹೌದು, ನನ್ನ ಬಳಿ ಇದೆ",
  },
};

const yesWords = ["yes", "yeah", "yep", "ha", "haan", "हां", "हाँ", "ಹೌದು"];
const noWords = ["no", "nope", "nahi", "nahin", "नहीं", "नही", "ಇಲ್ಲ"];

let scheme = null;
let documents = [];
let currentIndex = 0;
let toastTimer;
let lastSpokenText = "";

function getPreferredLanguage() {
  const storedUser = ["loggedInUser", "currentUser", "user"]
    .map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) || "null");
      } catch (error) {
        return null;
      }
    })
    .find(Boolean);

  const selected =
    storedUser?.preferredLanguage ||
    storedUser?.language ||
    localStorage.getItem("preferredLanguage") ||
    localStorage.getItem("appLanguage") ||
    "hi";

  return copy[selected] ? selected : "hi";
}

const language = getPreferredLanguage();
const text = copy[language] || copy.hi;

function getUserId() {
  const existing = localStorage.getItem("yojanMitraUserId");
  if (existing) return existing;

  const generated = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem("yojanMitraUserId", generated);
  return generated;
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

function speak(message) {
  lastSpokenText = message;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = speechLangCodes[language] || "hi-IN";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function setAssistantMessage(message, shouldSpeak = true) {
  els.assistantMessage.textContent = message;
  if (shouldSpeak) speak(message);
}

function getUploadedDocuments() {
  return documents
    .filter((document) => document.hasDocument && document.fileName)
    .map((document) => ({ name: document.name, fileName: document.fileName }));
}

function getMissingDocuments() {
  return documents.filter((document) => document.hasDocument === false || (document.hasDocument && !document.fileName));
}

function renderPills() {
  const available = documents.filter((document) => document.hasDocument && document.fileName);
  const missing = getMissingDocuments();

  els.availableDocuments.innerHTML = available.length
    ? available.map((document) => `<span class="pill yes">${document.name}</span>`).join("")
    : `<span class="pill">${text.noDocs}</span>`;
  els.missingDocuments.innerHTML = missing.length
    ? missing.map((document) => `<span class="pill no">${document.name}</span>`).join("")
    : `<span class="pill">${text.noDocs}</span>`;
}

function renderQuestion() {
  const total = documents.length;
  const current = documents[currentIndex];
  const completed = documents.filter((document) => document.hasDocument !== null).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  els.progressBar.style.width = `${progress}%`;
  els.stepText.textContent = `${text.step} ${Math.min(currentIndex + 1, total)} / ${total}`;
  els.questionLabel.textContent = text.questionLabel;
  els.yesText.textContent = text.yes;
  els.noText.textContent = text.no;
  els.uploadLabel.textContent = text.upload;
  els.skipUploadButton.textContent = text.uploadLater;
  els.uploadPanel.hidden = true;
  els.documentUpload.value = "";

  if (!current) {
    finishDraft();
    return;
  }

  els.documentQuestion.textContent = current.name;
  setAssistantMessage(`${text.hasDocument} ${current.name}`);
  renderPills();
}

async function getAiAssistance(question = "") {
  const result = await requestJson("/api/applications/ai-assist", {
    method: "POST",
    body: JSON.stringify({
      userId: getUserId(),
      schemeId,
      uploadedDocuments: getUploadedDocuments(),
      preferredLanguage: language,
      language,
      question,
    }),
  });

  return result.assistance;
}

async function uploadDocuments() {
  await requestJson("/api/applications/upload-documents", {
    method: "POST",
    body: JSON.stringify({
      userId: getUserId(),
      schemeId,
      uploadedDocuments: getUploadedDocuments(),
      preferredLanguage: language,
    }),
  });
}

async function prepareDraft() {
  return requestJson("/api/applications/prepare-draft", {
    method: "POST",
    body: JSON.stringify({
      userId: getUserId(),
      schemeId,
      uploadedDocuments: getUploadedDocuments(),
      preferredLanguage: language,
    }),
  });
}

function moveNext() {
  currentIndex += 1;
  renderQuestion();
}

function answerCurrent(hasDocument) {
  const current = documents[currentIndex];
  if (!current) return;

  current.hasDocument = hasDocument;
  current.fileName = hasDocument ? current.fileName : "";
  renderPills();

  if (hasDocument) {
    els.uploadPanel.hidden = false;
    setAssistantMessage(`${text.upload}: ${current.name}`);
    return;
  }

  setAssistantMessage(text.voiceNo);
  setTimeout(moveNext, 550);
}

async function finishDraft() {
  els.finalPanel.hidden = false;
  els.progressBar.style.width = "100%";
  els.stepText.textContent = text.finalTitle;
  els.statusBadge.textContent = text.incomplete;
  els.documentQuestion.textContent = text.finalTitle;
  els.questionLabel.textContent = text.finalTitle;
  els.yesButton.disabled = true;
  els.noButton.disabled = true;
  els.voiceAnswerButton.disabled = true;
  els.saveDraftButton.disabled = false;
  els.continueButton.disabled = true;
  renderPills();

  if (getMissingDocuments().length) {
    const missingNames = getMissingDocuments().map((document) => document.name).join(", ");
    els.draftSummary.textContent = missingNames;
    setAssistantMessage(`${text.incomplete}. ${missingNames}`);
    return;
  }

  els.draftSummary.textContent = text.draftReady;
  setAssistantMessage(text.draftReady);
}

function startVoiceAnswer() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast(text.voiceNotSupported);
    setAssistantMessage(text.voiceNotSupported);
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = speechLangCodes[language] || "hi-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const spoken = String(event.results[0][0].transcript || "").toLowerCase();
    if (yesWords.some((word) => spoken.includes(word))) {
      showToast(text.voiceYes);
      answerCurrent(true);
      return;
    }
    if (noWords.some((word) => spoken.includes(word))) {
      showToast(text.voiceNo);
      answerCurrent(false);
      return;
    }
    showToast(text.voiceNotSupported);
  };
  recognition.onerror = () => showToast(text.voiceNotSupported);
  recognition.start();
}

async function loadScheme() {
  document.documentElement.lang = language;
  els.backButton.textContent = text.back;
  els.flowTitle.textContent = text.flowTitle;
  els.availableTitle.textContent = text.available;
  els.missingTitle.textContent = text.missing;
  els.repeatButton.textContent = text.hearAgain;
  els.voiceAnswerButton.textContent = text.speak;
  els.saveDraftButton.textContent = "Save as Draft";
  els.continueButton.textContent = text.continue;
  els.finalTitle.textContent = text.finalTitle;
  els.safetyLine.textContent = text.safety;
  els.statusBadge.textContent = text.incomplete;
  setAssistantMessage(text.loading, false);

  try {
    const result = await requestJson(`/api/schemes/${encodeURIComponent(schemeId)}/apply-requirements`);
    scheme = result.scheme;
    documents = (scheme.requiredDocuments || []).map((name) => ({ name, hasDocument: null, fileName: "" }));
    els.schemeName.textContent = scheme.name;

    const assistance = await getAiAssistance("");
    setAssistantMessage(`${text.schemeIntro} ${scheme.name}. ${assistance.eligibilityExplanation || scheme.description}. ${text.safety}`);
    setTimeout(renderQuestion, 1200);
  } catch (error) {
    els.schemeName.textContent = "Scheme not found";
    setAssistantMessage(error.message || "Could not load this scheme");
    els.yesButton.disabled = true;
    els.noButton.disabled = true;
    els.voiceAnswerButton.disabled = true;
  }
}

els.backButton.addEventListener("click", () => window.history.back());
els.repeatButton.addEventListener("click", () => speak(lastSpokenText || els.assistantMessage.textContent));
els.voiceAnswerButton.addEventListener("click", startVoiceAnswer);
els.yesButton.addEventListener("click", () => answerCurrent(true));
els.noButton.addEventListener("click", () => answerCurrent(false));
els.skipUploadButton.addEventListener("click", moveNext);
els.documentUpload.addEventListener("change", () => {
  const current = documents[currentIndex];
  if (!current) return;
  current.fileName = els.documentUpload.files[0]?.name || "";
  setAssistantMessage(text.voiceYes);
  setTimeout(moveNext, 550);
});

els.saveDraftButton.addEventListener("click", async () => {
  els.saveDraftButton.disabled = true;
  els.continueButton.disabled = true;

  try {
    await uploadDocuments();
    const prepared = await prepareDraft();
    const assistance = await getAiAssistance("");

    renderPills();
    els.draftSummary.textContent = assistance.draftSummary || prepared.message || "Draft saved successfully";

    if (prepared.applicationStatus === "Draft") {
      els.statusBadge.textContent = text.statusDraftReady;
      els.continueButton.disabled = false;
      setAssistantMessage("Draft saved successfully");
      showToast("Draft saved successfully");
      return;
    }

    els.statusBadge.textContent = text.incomplete;
    setAssistantMessage(`${prepared.message} ${prepared.missingDocuments.join(", ")}`);
    showToast(prepared.message);
  } catch (error) {
    showToast(error.message || "Could not save draft");
  } finally {
    els.saveDraftButton.disabled = false;
  }
});

els.continueButton.addEventListener("click", async () => {
  els.continueButton.disabled = true;
  els.statusBadge.textContent = text.confirmed;

  try {
    const result = await requestJson("/api/applications/confirm-apply", {
      method: "POST",
      body: JSON.stringify({
        userId: getUserId(),
        schemeId,
        uploadedDocuments: getUploadedDocuments(),
        preferredLanguage: language,
      }),
    });

    els.statusBadge.textContent = result.applicationStatus === "Submitted" ? text.submitted : text.redirected;
    setAssistantMessage(result.officialApiAvailable ? result.message : text.portalGuidance);

    if (result.shouldRedirect && result.officialApplyUrl) {
      setTimeout(() => {
        window.location.href = result.officialApplyUrl;
      }, 1500);
    }
  } catch (error) {
    els.continueButton.disabled = false;
    showToast(error.message || "Could not continue");
  }
});

loadScheme();
