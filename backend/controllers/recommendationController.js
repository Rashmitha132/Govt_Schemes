const mongoose = require("mongoose");

const Scheme = require("../models/Scheme");
const UserResponse = require("../models/UserResponse");

const categoryAliases = {
  women: "woman",
  "senior-citizen": "senior",
  elderly: "senior",
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const normalizeCategory = (category) => {
  const normalized = normalizeText(category);
  return categoryAliases[normalized] || normalized;
};

const getCategoryVariants = (category) => {
  const normalized = normalizeCategory(category);
  const variants = new Set([normalized]);

  Object.entries(categoryAliases).forEach(([alias, canonical]) => {
    if (canonical === normalized) {
      variants.add(alias);
    }
  });

  return Array.from(variants);
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const compareRule = (answer, rule) => {
  if (rule === undefined || rule === null || rule === "") {
    return true;
  }

  if (Array.isArray(rule)) {
    return rule.map(normalizeText).includes(normalizeText(answer));
  }

  if (typeof rule === "object") {
    const numericAnswer = toNumber(answer);

    if (rule.min !== undefined && (numericAnswer === null || numericAnswer < Number(rule.min))) {
      return false;
    }

    if (rule.max !== undefined && (numericAnswer === null || numericAnswer > Number(rule.max))) {
      return false;
    }

    if (rule.equals !== undefined && normalizeText(answer) !== normalizeText(rule.equals)) {
      return false;
    }

    if (rule.includes !== undefined && !normalizeText(answer).includes(normalizeText(rule.includes))) {
      return false;
    }

    return true;
  }

  return normalizeText(answer) === normalizeText(rule);
};

const scoreScheme = (scheme, answers) => {
  const rules = scheme.rules || {};
  const ruleEntries = Object.entries(rules);

  if (!ruleEntries.length) {
    return {
      matched: true,
      score: 1,
      totalRules: 1,
      matchPercentage: 100,
      reasons: ["General match for your selected category"],
    };
  }

  const reasons = [];
  let score = 0;

  ruleEntries.forEach(([field, rule]) => {
    if (compareRule(answers[field], rule)) {
      score += 1;
      reasons.push(`${field} matched`);
    }
  });

  const requiredScore = Math.max(1, Math.ceil(ruleEntries.length * 0.5));

  return {
    matched: score >= requiredScore,
    score,
    totalRules: ruleEntries.length,
    matchPercentage: Math.round((score / ruleEntries.length) * 100),
    reasons,
  };
};

const inferSchemeLevel = (scheme) => {
  const explicitLevel = normalizeText(scheme.schemeLevel || scheme.level || scheme.type);
  if (["state", "central", "national"].includes(explicitLevel)) {
    return explicitLevel === "national" ? "central" : explicitLevel;
  }

  const text = normalizeText(`${scheme.name} ${scheme.applyLink}`);
  const centralHints = ["pradhan mantri", "pm ", "national", "central", ".gov.in", "nic.in"];
  return centralHints.some((hint) => text.includes(hint)) ? "central" : "state";
};

const getSchemeState = (scheme) => String(scheme.state || scheme.rules?.state || "").trim();

const getBenefitAmount = (scheme) => {
  if (Number.isFinite(Number(scheme.benefitAmount)) && Number(scheme.benefitAmount) > 0) {
    return Number(scheme.benefitAmount);
  }

  const benefitText = String(scheme.benefits || "");
  const amountMatches = Array.from(benefitText.matchAll(/(?:rs\.?|₹|inr)?\s*([0-9][0-9,]*(?:\.\d+)?)\s*(lakh|crore|thousand)?/gi));
  if (!amountMatches.length) return 0;

  const values = amountMatches.map((match) => {
    const base = Number(match[1].replace(/,/g, ""));
    const unit = normalizeText(match[2]);
    if (unit === "crore") return base * 10000000;
    if (unit === "lakh") return base * 100000;
    if (unit === "thousand") return base * 1000;
    return base;
  });

  return Math.max(...values);
};

const getApplyUrgency = (scheme) => {
  if (!scheme.deadline) {
    return { label: "Open", score: 10, deadline: "" };
  }

  const deadline = new Date(scheme.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { label: "Deadline passed", score: 0, deadline: deadline.toISOString() };
  if (daysLeft <= 7) return { label: "Urgent", score: 100, deadline: deadline.toISOString() };
  if (daysLeft <= 30) return { label: "Apply soon", score: 70, deadline: deadline.toISOString() };
  return { label: "Open", score: 35, deadline: deadline.toISOString() };
};

const getDocumentReadiness = (scheme, userDocuments = []) => {
  const requiredDocuments = scheme.documentsRequired || [];
  if (!requiredDocuments.length) {
    return { readyCount: 0, missingDocuments: [], score: 100 };
  }

  const availableNames = new Set(
    userDocuments.map((document) => normalizeText(typeof document === "string" ? document : document?.name))
  );
  const missingDocuments = requiredDocuments.filter((document) => !availableNames.has(normalizeText(document)));
  const readyCount = requiredDocuments.length - missingDocuments.length;

  return {
    readyCount,
    missingDocuments,
    score: Math.round((readyCount / requiredDocuments.length) * 100),
  };
};

const getPriorityLabel = (priorityScore, matchPercentage) => {
  if (priorityScore >= 85 || matchPercentage >= 90) return "Best Match";
  if (priorityScore >= 70) return "Apply First";
  if (matchPercentage >= 50 || priorityScore >= 45) return "Good Match";
  return "Maybe Eligible";
};

const buildRecommendedScheme = ({ scheme, match, category, answers, userDocuments = [], fallback = false }) => {
  const schemeLevel = inferSchemeLevel(scheme);
  const userState = normalizeText(answers.state);
  const schemeState = getSchemeState(scheme);
  const isStateScheme = schemeLevel === "state";
  const stateMatch = !isStateScheme || !schemeState || normalizeText(schemeState) === userState;
  const categoryMatch = getCategoryVariants(category).includes(normalizeCategory(scheme.category));
  const documentReadiness = getDocumentReadiness(scheme, userDocuments);
  const urgency = getApplyUrgency(scheme);
  const benefitAmount = getBenefitAmount(scheme);
  const benefitScore = benefitAmount ? Math.min(100, Math.round(Math.log10(benefitAmount + 1) * 16)) : 20;
  const matchPercentage = fallback ? Math.max(25, match.matchPercentage || 25) : match.matchPercentage || 0;
  const priorityScore = Math.round(
    (matchPercentage * 0.42) +
    (documentReadiness.score * 0.18) +
    (benefitScore * 0.12) +
    (urgency.score * 0.1) +
    ((categoryMatch ? 100 : 0) * 0.1) +
    ((stateMatch ? 100 : 0) * 0.08)
  );
  const priorityLabel = getPriorityLabel(priorityScore, matchPercentage);
  const whyEligible = fallback
    ? "This scheme is from your selected category. Please check final eligibility on the official website."
    : match.reasons.length
      ? `Matched: ${match.reasons.join(", ")}`
      : "This scheme matches your selected category";

  return {
    id: scheme._id,
    name: scheme.name,
    whyRecommended: whyEligible,
    whyEligible,
    benefits: scheme.benefits,
    benefit: scheme.benefits,
    benefitAmount,
    eligibility: scheme.eligibility,
    documentsRequired: scheme.documentsRequired,
    missingDocuments: documentReadiness.missingDocuments,
    documentReadinessScore: documentReadiness.score,
    documentReadyCount: documentReadiness.readyCount,
    applyLink: scheme.applyLink,
    matchScore: match.score,
    matchPercentage,
    priorityScore,
    priorityLabel,
    schemeLevel,
    state: schemeState,
    stateMatch,
    categoryMatch,
    applyUrgency: urgency.label,
    deadline: urgency.deadline,
  };
};

const recommendSchemes = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Scheme recommendations need MongoDB scheme data.",
      });
    }

    const category = normalizeCategory(req.body.category);
    const answers = req.body.answers || {};
    const userDocuments = req.body.availableDocuments || req.body.uploadedDocuments || [];

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const schemes = await Scheme.find({
      active: true,
      category: { $in: getCategoryVariants(category) },
    }).lean();

    const scoredSchemes = schemes
      .map((scheme) => {
        const match = scoreScheme(scheme, answers);
        return {
          ...scheme,
          matchScore: match.score,
          matchPercentage: match.matchPercentage,
          matchReasons: match.reasons,
          whyRecommended: match.reasons.length
            ? match.reasons.join(", ")
            : "This scheme matches your selected category",
          matched: match.matched,
        };
      })
      .sort((first, second) => second.matchScore - first.matchScore);

    let recommendedSchemes = scoredSchemes
      .filter((scheme) => scheme.matched)
      .map((scheme) =>
        buildRecommendedScheme({
          scheme,
          match: {
            score: scheme.matchScore,
            reasons: scheme.matchReasons,
            matchPercentage: scheme.matchPercentage,
          },
          category,
          answers,
          userDocuments,
        })
      )
      .filter((scheme) => scheme.schemeLevel !== "state" || scheme.stateMatch)
      .sort((first, second) => second.priorityScore - first.priorityScore);

    if (!recommendedSchemes.length && scoredSchemes.length) {
      recommendedSchemes = scoredSchemes
        .slice(0, 5)
        .map((scheme) =>
          buildRecommendedScheme({
            scheme,
            match: {
              score: scheme.matchScore,
              reasons: scheme.matchReasons || [],
              matchPercentage: scheme.matchPercentage,
            },
            category,
            answers,
            userDocuments,
            fallback: true,
          })
        )
        .filter((scheme) => scheme.schemeLevel !== "state" || scheme.stateMatch)
        .sort((first, second) => second.priorityScore - first.priorityScore);
    }

    const centralSchemes = recommendedSchemes.filter((scheme) => scheme.schemeLevel === "central");
    const stateSchemes = recommendedSchemes.filter((scheme) => scheme.schemeLevel === "state");
    const topRecommendation = recommendedSchemes[0] || null;

    await UserResponse.create({
      phone: req.body.phone || "",
      category,
      answers,
      recommendedSchemes: recommendedSchemes.map((scheme) => ({
        schemeId: String(scheme.id),
        name: scheme.name,
        matchScore: scheme.matchScore || 0,
      })),
    });

    return res.json({
      success: true,
      schemes: recommendedSchemes,
      sections: {
        central: centralSchemes,
        state: stateSchemes,
      },
      aiSummary: topRecommendation
        ? `AI recommends applying for this scheme first: ${topRecommendation.name}`
        : "",
      voiceSummary: "These are your best matching schemes. Apply for the first one first.",
      message: recommendedSchemes.length
        ? "Recommended schemes found"
        : "No schemes matched your answers yet",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not recommend schemes" });
  }
};

module.exports = {
  recommendSchemes,
};
