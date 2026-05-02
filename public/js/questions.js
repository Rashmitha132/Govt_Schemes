const params = new URLSearchParams(window.location.search);
const category = (params.get("category") || localStorage.getItem("selectedCategory") || "farmer").toLowerCase();
const language = localStorage.getItem("appLanguage") || "hi";

const i18n = {
  en: {
    featureVoice: "Voice assistance",
    featurePassword: "No password needed",
    featureQuestions: "Easy scheme matching",
    featureDocuments: "Know what to keep ready",
    answerPrompt: "Answer a few simple questions",
    findTitle: "Find schemes for you",
    step: "Step",
    of: "of",
    back: "Back",
    next: "Next",
    showSchemes: "Show schemes",
    finding: "Finding schemes...",
    choose: "Tap one option",
    required: "Please select one option",
    recommended: "Recommended schemes",
    noSchemes: "No matching schemes found",
    noSchemesHelp: "Add schemes to MongoDB with matching rules to show recommendations here.",
    why: "Why recommended",
    benefits: "Benefits",
    eligibility: "Eligibility",
    documents: "Documents required",
    apply: "Apply now"
  },
  hi: {
    featureVoice: "आवाज से सहायता",
    featurePassword: "पासवर्ड की जरूरत नहीं",
    featureQuestions: "आसान सवाल",
    featureDocuments: "दस्तावेज पहले से जानें",
    answerPrompt: "कुछ आसान सवालों के जवाब दें",
    findTitle: "आपके लिए योजनाएं खोजें",
    step: "चरण",
    of: "में से",
    back: "पीछे",
    next: "आगे",
    showSchemes: "योजनाएं दिखाएं",
    finding: "योजनाएं खोज रहे हैं...",
    choose: "एक विकल्प चुनें",
    required: "कृपया एक विकल्प चुनें",
    recommended: "सुझाई गई योजनाएं",
    noSchemes: "कोई मिलती-जुलती योजना नहीं मिली",
    noSchemesHelp: "सुझाव दिखाने के लिए MongoDB में matching rules वाली schemes जोड़ें।",
    why: "क्यों सुझाया गया",
    benefits: "लाभ",
    eligibility: "पात्रता",
    documents: "जरूरी दस्तावेज",
    apply: "आवेदन करें"
  },
  kn: {
    featureVoice: "ಧ್ವನಿ ಸಹಾಯ",
    featurePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ",
    featureQuestions: "ಸರಳ ಪ್ರಶ್ನೆಗಳು",
    featureDocuments: "ಬೇಕಾದ ದಾಖಲೆಗಳನ್ನು ತಿಳಿಯಿರಿ",
    answerPrompt: "ಕೆಲವು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ",
    findTitle: "ನಿಮಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    step: "ಹಂತ",
    of: "ರಲ್ಲಿ",
    back: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    showSchemes: "ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ",
    finding: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    choose: "ಒಂದು ಆಯ್ಕೆಯನ್ನು ಒತ್ತಿ",
    required: "ದಯವಿಟ್ಟು ಒಂದು ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ",
    recommended: "ಶಿಫಾರಸು ಮಾಡಿದ ಯೋಜನೆಗಳು",
    noSchemes: "ಹೊಂದುವ ಯೋಜನೆಗಳು ಸಿಗಲಿಲ್ಲ",
    noSchemesHelp: "ಶಿಫಾರಸುಗಳನ್ನು ತೋರಿಸಲು MongoDB ನಲ್ಲಿ matching rules ಇರುವ schemes ಸೇರಿಸಿ.",
    why: "ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    benefits: "ಲಾಭಗಳು",
    eligibility: "ಅರ್ಹತೆ",
    documents: "ಬೇಕಾದ ದಾಖಲೆಗಳು",
    apply: "ಅರ್ಜಿ ಹಾಕಿ"
  }
};

const text = i18n[language] || i18n.hi;

const categories = {
  woman: { en: "Women", hi: "महिला", kn: "ಮಹಿಳೆ" },
  women: { en: "Women", hi: "महिला", kn: "ಮಹಿಳೆ" },
  student: { en: "Student", hi: "विद्यार्थी", kn: "ವಿದ್ಯಾರ್ಥಿ" },
  farmer: { en: "Farmer", hi: "किसान", kn: "ರೈತ" },
  senior: { en: "Senior Citizen", hi: "बुजुर्ग", kn: "ಹಿರಿಯರು" },
  "senior-citizen": { en: "Senior Citizen", hi: "बुजुर्ग", kn: "ಹಿರಿಯರು" },
  family: { en: "Family", hi: "परिवार", kn: "ಕುಟುಂಬ" },
  business: { en: "Business", hi: "व्यवसाय", kn: "ವ್ಯಾಪಾರ" }
};

const commonOptions = {
  age: [
    ["18-25", "🧑", "18-25", "18-25", "18-25"],
    ["26-40", "👩", "26-40", "26-40", "26-40"],
    ["41-60", "👨", "41-60", "41-60", "41-60"],
    ["60+", "👴", "60+", "60+", "60+"]
  ],
  seniorAge: [
    ["60-69", "👴", "60-69", "60-69", "60-69"],
    ["70-79", "🧓", "70-79", "70-79", "70-79"],
    ["80+", "🙏", "80+", "80+", "80+"]
  ],
  income: [
    ["Below 1 lakh", "🟢", "Below 1 lakh", "1 लाख से कम", "1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ"],
    ["1-3 lakh", "🟡", "1-3 lakh", "1-3 लाख", "1-3 ಲಕ್ಷ"],
    ["3-6 lakh", "🟠", "3-6 lakh", "3-6 लाख", "3-6 ಲಕ್ಷ"],
    ["Above 6 lakh", "🔵", "Above 6 lakh", "6 लाख से अधिक", "6 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು"]
  ],
  state: [
    ["Karnataka", "📍", "Karnataka", "कर्नाटक", "ಕರ್ನಾಟಕ"],
    ["Maharashtra", "📍", "Maharashtra", "महाराष्ट्र", "ಮಹಾರಾಷ್ಟ್ರ"],
    ["Tamil Nadu", "📍", "Tamil Nadu", "तमिलनाडु", "ತಮಿಳುನಾಡು"],
    ["Telangana", "📍", "Telangana", "तेलंगाना", "ತೆಲಂಗಾಣ"],
    ["Andhra Pradesh", "📍", "Andhra Pradesh", "आंध्र प्रदेश", "ಆಂಧ್ರ ಪ್ರದೇಶ"],
    ["Other", "🗺️", "Other", "अन्य", "ಇತರೆ"]
  ],
  education: [
    ["No formal education", "✍️", "No formal education", "पढ़ाई नहीं", "ಔಪಚಾರಿಕ ಶಿಕ್ಷಣ ಇಲ್ಲ"],
    ["School", "🏫", "School", "स्कूल", "ಶಾಲೆ"],
    ["PUC/12th", "📘", "PUC/12th", "12वीं", "PUC/12ನೇ"],
    ["Graduate", "🎓", "Graduate", "स्नातक", "ಪದವಿ"]
  ]
};

function option(value, icon, en, hi, kn) {
  return { value, icon, label: { en, hi, kn } };
}

function options(items) {
  return items.map(([value, icon, en, hi, kn]) => option(value, icon, en, hi, kn));
}

const questionSets = {
  woman: [
    { key: "age", icon: "🎂", label: { en: "Age", hi: "उम्र", kn: "ವಯಸ್ಸು" }, options: options(commonOptions.age) },
    { key: "maritalStatus", icon: "💍", label: { en: "Marital status", hi: "वैवाहिक स्थिति", kn: "ವೈವಾಹಿಕ ಸ್ಥಿತಿ" }, options: options([
      ["Single", "🙋", "Single", "अविवाहित", "ಅವಿವಾಹಿತ"],
      ["Married", "👪", "Married", "विवाहित", "ವಿವಾಹಿತ"],
      ["Widowed", "🙏", "Widowed", "विधवा", "ವಿಧವೆ"],
      ["Divorced", "🧾", "Divorced", "तलाकशुदा", "ವಿಚ್ಛೇದಿತ"]
    ]) },
    { key: "income", icon: "💰", label: { en: "Income", hi: "आय", kn: "ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "occupation", icon: "🧰", label: { en: "Occupation", hi: "काम", kn: "ಕೆಲಸ" }, options: options([
      ["Homemaker", "🏠", "Homemaker", "गृहिणी", "ಗೃಹಿಣಿ"],
      ["Farmer", "🌾", "Farmer", "किसान", "ರೈತ"],
      ["Worker", "🧱", "Worker", "मजदूर", "ಕಾರ್ಮಿಕ"],
      ["Small business", "🏪", "Small business", "छोटा व्यापार", "ಸಣ್ಣ ವ್ಯಾಪಾರ"],
      ["Student", "🎓", "Student", "विद्यार्थी", "ವಿದ್ಯಾರ್ಥಿ"]
    ]) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "educationLevel", icon: "🎓", label: { en: "Education level", hi: "शिक्षा", kn: "ಶಿಕ್ಷಣ" }, options: options(commonOptions.education) }
  ],
  student: [
    { key: "age", icon: "🎂", label: { en: "Age", hi: "उम्र", kn: "ವಯಸ್ಸು" }, options: options(commonOptions.age) },
    { key: "educationLevel", icon: "🎓", label: { en: "Education level", hi: "शिक्षा", kn: "ಶಿಕ್ಷಣ" }, options: options(commonOptions.education) },
    { key: "annualFamilyIncome", icon: "💰", label: { en: "Annual family income", hi: "परिवार की सालाना आय", kn: "ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "casteCategory", icon: "🪪", label: { en: "Caste/category", hi: "जाति/वर्ग", kn: "ಜಾತಿ/ವರ್ಗ" }, options: options([
      ["General", "👤", "General", "सामान्य", "ಸಾಮಾನ್ಯ"],
      ["OBC", "👥", "OBC", "ओबीसी", "OBC"],
      ["SC", "👥", "SC", "एससी", "SC"],
      ["ST", "👥", "ST", "एसटी", "ST"],
      ["Minority", "🤝", "Minority", "अल्पसंख्यक", "ಅಲ್ಪಸಂಖ್ಯಾತ"]
    ]) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "gender", icon: "👤", label: { en: "Gender", hi: "लिंग", kn: "ಲಿಂಗ" }, options: options([
      ["Female", "👩", "Female", "महिला", "ಮಹಿಳೆ"],
      ["Male", "👨", "Male", "पुरुष", "ಪುರುಷ"],
      ["Other", "🧑", "Other", "अन्य", "ಇತರೆ"]
    ]) }
  ],
  farmer: [
    { key: "age", icon: "🎂", label: { en: "Age", hi: "उम्र", kn: "ವಯಸ್ಸು" }, options: options(commonOptions.age) },
    { key: "landSize", icon: "🌾", label: { en: "Land size", hi: "जमीन का आकार", kn: "ಜಮೀನಿನ ಗಾತ್ರ" }, options: options([
      ["No land", "🚫", "No land", "जमीन नहीं", "ಜಮೀನು ಇಲ್ಲ"],
      ["Below 1 acre", "🌱", "Below 1 acre", "1 एकड़ से कम", "1 ಏಕರೆಗಿಂತ ಕಡಿಮೆ"],
      ["1-5 acres", "🌾", "1-5 acres", "1-5 एकड़", "1-5 ಏಕರೆ"],
      ["Above 5 acres", "🚜", "Above 5 acres", "5 एकड़ से अधिक", "5 ಏಕರೆಗಿಂತ ಹೆಚ್ಚು"]
    ]) },
    { key: "annualIncome", icon: "💰", label: { en: "Annual income", hi: "सालाना आय", kn: "ವಾರ್ಷಿಕ ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "cropType", icon: "🌱", label: { en: "Crop type", hi: "फसल", kn: "ಬೆಳೆ" }, options: options([
      ["Rice", "🌾", "Rice", "धान", "ಅಕ್ಕಿ"],
      ["Wheat", "🌾", "Wheat", "गेहूं", "ಗೋಧಿ"],
      ["Cotton", "☁️", "Cotton", "कपास", "ಹತ್ತಿ"],
      ["Vegetables", "🥬", "Vegetables", "सब्जियां", "ತರಕಾರಿ"],
      ["Other", "🌱", "Other", "अन्य", "ಇತರೆ"]
    ]) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "irrigationAvailable", icon: "💧", label: { en: "Irrigation available", hi: "सिंचाई उपलब्ध है?", kn: "ನೀರಾವರಿ ಇದೆಯೇ?" }, options: options([
      ["Yes", "✅", "Yes", "हाँ", "ಹೌದು"],
      ["No", "❌", "No", "नहीं", "ಇಲ್ಲ"]
    ]) }
  ],
  senior: [
    { key: "age", icon: "🎂", label: { en: "Age", hi: "उम्र", kn: "ವಯಸ್ಸು" }, options: options(commonOptions.seniorAge) },
    { key: "pensionStatus", icon: "🏦", label: { en: "Pension status", hi: "पेंशन स्थिति", kn: "ಪಿಂಚಣಿ ಸ್ಥಿತಿ" }, options: options([
      ["Receiving pension", "✅", "Receiving pension", "पेंशन मिल रही है", "ಪಿಂಚಣಿ ಸಿಗುತ್ತಿದೆ"],
      ["Not receiving pension", "❌", "Not receiving pension", "पेंशन नहीं मिल रही", "ಪಿಂಚಣಿ ಸಿಗುತ್ತಿಲ್ಲ"]
    ]) },
    { key: "income", icon: "💰", label: { en: "Income", hi: "आय", kn: "ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "healthCondition", icon: "🩺", label: { en: "Health condition", hi: "स्वास्थ्य", kn: "ಆರೋಗ್ಯ" }, options: options([
      ["Healthy", "🙂", "Healthy", "स्वस्थ", "ಆರೋಗ್ಯವಾಗಿದ್ದಾರೆ"],
      ["Chronic illness", "💊", "Chronic illness", "लंबी बीमारी", "ದೀರ್ಘಕಾಲದ ಅನಾರೋಗ್ಯ"],
      ["Disability", "♿", "Disability", "दिव्यांग", "ವಿಕಲಚೇತನ"],
      ["Needs support", "🤝", "Needs support", "सहायता चाहिए", "ಸಹಾಯ ಬೇಕು"]
    ]) }
  ],
  business: [
    { key: "age", icon: "🎂", label: { en: "Age", hi: "उम्र", kn: "ವಯಸ್ಸು" }, options: options(commonOptions.age) },
    { key: "businessType", icon: "🏪", label: { en: "Business type", hi: "व्यवसाय प्रकार", kn: "ವ್ಯಾಪಾರ ಪ್ರಕಾರ" }, options: options([
      ["Shop", "🏪", "Shop", "दुकान", "ಅಂಗಡಿ"],
      ["Tailoring", "🧵", "Tailoring", "सिलाई", "ಹೊಲಿಗೆ"],
      ["Food business", "🍲", "Food business", "खाद्य व्यवसाय", "ಆಹಾರ ವ್ಯಾಪಾರ"],
      ["Service", "🧰", "Service", "सेवा", "ಸೇವೆ"],
      ["Other", "📦", "Other", "अन्य", "ಇತರೆ"]
    ]) },
    { key: "annualIncome", icon: "💰", label: { en: "Annual income", hi: "सालाना आय", kn: "ವಾರ್ಷಿಕ ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "loanRequired", icon: "📄", label: { en: "Loan required?", hi: "लोन चाहिए?", kn: "ಸಾಲ ಬೇಕೇ?" }, options: options([
      ["Yes", "✅", "Yes", "हाँ", "ಹೌದು"],
      ["No", "❌", "No", "नहीं", "ಇಲ್ಲ"]
    ]) }
  ],
  family: [
    { key: "income", icon: "💰", label: { en: "Family income", hi: "परिवार की आय", kn: "ಕುಟುಂಬದ ಆದಾಯ" }, options: options(commonOptions.income) },
    { key: "state", icon: "📍", label: { en: "State", hi: "राज्य", kn: "ರಾಜ್ಯ" }, options: options(commonOptions.state) },
    { key: "familySize", icon: "👪", label: { en: "Family size", hi: "परिवार के सदस्य", kn: "ಕುಟುಂಬದ ಗಾತ್ರ" }, options: options([
      ["1-2", "👥", "1-2", "1-2", "1-2"],
      ["3-4", "👪", "3-4", "3-4", "3-4"],
      ["5+", "👨‍👩‍👧‍👦", "5+", "5 से अधिक", "5ಕ್ಕಿಂತ ಹೆಚ್ಚು"]
    ]) },
    { key: "houseType", icon: "🏠", label: { en: "House type", hi: "घर का प्रकार", kn: "ಮನೆಯ ಪ್ರಕಾರ" }, options: options([
      ["Own house", "🏡", "Own house", "अपना घर", "ಸ್ವಂತ ಮನೆ"],
      ["Rented house", "🏘️", "Rented house", "किराये का घर", "ಬಾಡಿಗೆ ಮನೆ"],
      ["No house", "🤝", "No house", "घर नहीं", "ಮನೆ ಇಲ್ಲ"]
    ]) }
  ]
};

questionSets.women = questionSets.woman;
questionSets["senior-citizen"] = questionSets.senior;

const questions = questionSets[category] || questionSets.farmer;
const answers = {};
let step = 0;
let loading = false;
let toastTimer;
let lastSpokenStep = -1;
let latestRecommendationMeta = {};

const categoryLabel = document.getElementById("categoryLabel");
const stepLabel = document.getElementById("stepLabel");
const questionCard = document.getElementById("questionCard");
const resultList = document.getElementById("resultList");
const toast = document.getElementById("toast");
const title = document.querySelector("header h2");
const voiceTitle = document.querySelector(".voice-banner strong");
const voiceBanner = document.querySelector(".voice-banner");
const featureVoiceNative = document.getElementById("featureVoiceNative");
const featurePasswordNative = document.getElementById("featurePasswordNative");
const featureQuestionsNative = document.getElementById("featureQuestionsNative");
const featureDocumentsNative = document.getElementById("featureDocumentsNative");

const speechLangCodes = {
  as: "as-IN",
  bn: "bn-IN",
  brx: "brx-IN",
  doi: "doi-IN",
  en: "en-IN",
  gu: "gu-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ks: "ks-IN",
  kok: "kok-IN",
  mai: "mai-IN",
  ml: "ml-IN",
  mni: "mni-IN",
  mr: "mr-IN",
  ne: "ne-IN",
  or: "or-IN",
  pa: "pa-IN",
  sa: "sa-IN",
  sat: "sat-IN",
  sd: "sd-IN",
  ta: "ta-IN",
  te: "te-IN",
  ur: "ur-IN"
};

function localized(value) {
  if (typeof value === "string") return value;
  return value[language] || value.hi || value.en;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function getSpeechLang() {
  return speechLangCodes[language] || "hi-IN";
}

function speak(textToSpeak) {
  if (!("speechSynthesis" in window)) {
    showToast("Voice not supported on this browser");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = getSpeechLang();
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function getQuestionSpeech(question) {
  const optionNames = question.options.map((item) => localized(item.label)).join(", ");
  return `${localized(question.label)}. ${text.choose}. ${optionNames}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getResultsIntro() {
  const intros = {
    as: "আপোনাৰ প্ৰফাইল অনুসৰি, আপুনি এই আঁচনিসমূহৰ বাবে যোগ্য",
    bn: "আপনার প্রোফাইল অনুযায়ী, আপনি এই প্রকল্পগুলির জন্য যোগ্য",
    brx: "नोंथांनि प्रोफाइल मते, नोंथां बे योजनाफोरनि थाखाय योग्य",
    doi: "तुंदे प्रोफाइल दे मुताबिक, तुस इन योजनाएं लेई पात्र ओ",
    en: "According to your profile, these are the schemes you are eligible for",
    gu: "તમારી પ્રોફાઇલ મુજબ, તમે આ યોજનાઓ માટે પાત્ર છો",
    hi: "आपकी जानकारी के अनुसार, आप इन योजनाओं के लिए पात्र हैं",
    kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರ, ನೀವು ಈ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ",
    ks: "تُہندِ پروفائل مُطابِق، تُہۍ چھِو اِن منصوبن خٲطر اہل",
    kok: "तुमच्या प्रोफायली प्रमाणें, तुमी ह्या येवजण्यां खातीर पात्र आसात",
    mai: "अहाँक प्रोफाइलक अनुसार, अहाँ ई योजनासभक लेल पात्र छी",
    ml: "നിങ്ങളുടെ പ്രൊഫൈൽ പ്രകാരം, നിങ്ങൾ ഈ പദ്ധതികൾക്ക് അർഹരാണ്",
    mni: "নহাক্কী প্রোফাইলগী মতুংইন্না, নহাক অসিগী স্কীমশিংদা যোগ্যনি",
    mr: "तुमच्या प्रोफाइलनुसार, तुम्ही या योजनांसाठी पात्र आहात",
    ne: "तपाईंको प्रोफाइल अनुसार, तपाईं यी योजनाहरूका लागि योग्य हुनुहुन्छ",
    or: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଅନୁସାରେ, ଆପଣ ଏହି ଯୋଜନାଗୁଡ଼ିକ ପାଇଁ ଯୋଗ୍ୟ",
    pa: "ਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ ਮੁਤਾਬਕ, ਤੁਸੀਂ ਇਨ੍ਹਾਂ ਯੋਜਨਾਵਾਂ ਲਈ ਯੋਗ ਹੋ",
    sa: "भवतः विवरणानुसारम्, भवान् एतासां योजनानां कृते पात्रः अस्ति",
    sat: "ᱟᱢᱟᱜ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ ᱞᱮᱠᱟᱛᱮ, ᱟᱢ ᱱᱚᱣᱟ ᱥᱠᱤᱢ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱜᱽᱭᱚ",
    sd: "توهان جي پروفائل موجب، توهان انهن اسڪيمن لاءِ اهل آهيو",
    ta: "உங்கள் சுயவிவரத்தின் படி, நீங்கள் இந்த திட்டங்களுக்கு தகுதியானவர்",
    te: "మీ ప్రొఫైల్ ప్రకారం, మీరు ఈ పథకాలకు అర్హులు",
    ur: "آپ کی پروفائل کے مطابق، آپ ان اسکیموں کے اہل ہیں"
  };

  return intros[language] || intros.hi;
}

function renderQuestion() {
  const question = questions[step];
  categoryLabel.textContent = `${categories[category]?.en || "Category"} / ${localized(categories[category] || { en: "Category", hi: "वर्ग", kn: "ವರ್ಗ" })}`;
  title.textContent = text.findTitle;
  voiceTitle.textContent = text.answerPrompt;
  stepLabel.textContent = `${text.step} ${step + 1} ${text.of} ${questions.length}`;
  resultList.innerHTML = "";

  questionCard.innerHTML = `
    <div class="question-icon">${question.icon}</div>
    <h3>${localized(question.label)}</h3>
    <p class="tap-hint">${text.choose}</p>
    <div class="option-list">
      ${question.options.map((item) => `
        <button class="option-button ${answers[question.key] === item.value ? "active" : ""}" type="button" data-value="${item.value}">
          <span class="option-icon">${item.icon}</span>
          <span>${localized(item.label)}</span>
        </button>
      `).join("")}
    </div>
    <div class="actions">
      <button type="button" id="questionBack" ${step === 0 || loading ? "disabled" : ""}>${text.back}</button>
      <button type="button" id="questionNext">${loading ? text.finding : step === questions.length - 1 ? text.showSchemes : text.next}</button>
    </div>
  `;

  questionCard.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      answers[question.key] = button.dataset.value;
      renderQuestion();
    });
  });

  document.getElementById("questionBack").addEventListener("click", () => {
    step = Math.max(0, step - 1);
    renderQuestion();
  });

  document.getElementById("questionNext").addEventListener("click", () => {
    if (!answers[question.key]) {
      showToast(text.required);
      return;
    }

    if (step === questions.length - 1) {
      submitAnswers();
      return;
    }

    step += 1;
    renderQuestion();
  });

  if (lastSpokenStep !== step) {
    lastSpokenStep = step;
    setTimeout(() => speak(getQuestionSpeech(question)), 250);
  }
}

async function submitAnswers() {
  loading = true;
  renderQuestion();

  try {
    const response = await fetch("/api/recommend-schemes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, answers })
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not find schemes");
    }

    latestRecommendationMeta = {
      sections: result.sections || {},
      aiSummary: result.aiSummary || "",
      voiceSummary: result.voiceSummary || ""
    };
    loading = false;
    renderPrioritizedSchemes(result.schemes || []);
  } catch (error) {
    loading = false;
    renderQuestion();
    showToast(error.message || "Could not find schemes");
  }
}

function renderSchemes(schemes) {
  questionCard.innerHTML = "";

  if (!schemes.length) {
    resultList.innerHTML = `<article class="scheme-card"><h3>${text.noSchemes}</h3><p>${text.noSchemesHelp}</p></article>`;
    speak(text.noSchemes);
    return;
  }

  const schemeNames = schemes.map((scheme) => scheme.name).filter(Boolean);
  const intro = getResultsIntro();

  resultList.innerHTML = `
    <section class="eligible-summary" aria-live="polite">
      <div class="result-icon">✅</div>
      <h2>${escapeHtml(intro)}</h2>
      <div class="scheme-detail-list">
        ${schemes.map((scheme) => `
          <article class="scheme-card">
            <h3>${escapeHtml(scheme.name)}</h3>
            <p><strong>${escapeHtml(text.why)}:</strong> ${escapeHtml(scheme.whyRecommended)}</p>
            <p><strong>${escapeHtml(text.benefits)}:</strong> ${escapeHtml(scheme.benefits)}</p>
            <p><strong>${escapeHtml(text.eligibility)}:</strong> ${escapeHtml(scheme.eligibility)}</p>
            <p><strong>${escapeHtml(text.documents)}:</strong> ${escapeHtml((scheme.documentsRequired || []).join(", "))}</p>
            <a href="/apply-assistant/${encodeURIComponent(String(scheme.id || ""))}">${escapeHtml(text.apply)}</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;

  speak(`${intro}. ${schemeNames.join(". ")}`);
}

document.getElementById("backButton").textContent = `← ${text.back}`;
function renderPrioritizedSchemes(schemes) {
  questionCard.innerHTML = "";

  if (!schemes.length) {
    resultList.innerHTML = `<article class="scheme-card"><h3>${text.noSchemes}</h3><p>${text.noSchemesHelp}</p></article>`;
    speak(text.noSchemes);
    return;
  }

  const intro = getResultsIntro();
  const schemeNames = schemes.map((scheme) => scheme.name).filter(Boolean);
  const centralSchemes = latestRecommendationMeta.sections?.central || schemes.filter((scheme) => scheme.schemeLevel === "central");
  const stateSchemes = latestRecommendationMeta.sections?.state || schemes.filter((scheme) => scheme.schemeLevel === "state");
  const renderSchemeCard = (scheme, index) => `
    <article class="scheme-card priority-card">
      <div class="scheme-card-head">
        <span class="priority-badge">${escapeHtml(index === 0 ? "Best Match" : scheme.priorityLabel || "Good Match")}</span>
        <span class="score-badge">${escapeHtml(String(scheme.matchPercentage || 0))}%</span>
      </div>
      <h3>${escapeHtml(scheme.name)}</h3>
      <p><strong>${escapeHtml(text.why)}:</strong> ${escapeHtml(scheme.whyEligible || scheme.whyRecommended)}</p>
      <div class="quick-facts">
        <span>Benefit: ${escapeHtml(scheme.benefit || scheme.benefits || "Check portal")}</span>
        <span>Docs ready: ${escapeHtml(String(scheme.documentReadinessScore ?? 0))}%</span>
        <span>Urgency: ${escapeHtml(scheme.applyUrgency || "Open")}</span>
      </div>
      <p><strong>${escapeHtml(text.documents)}:</strong> ${escapeHtml((scheme.documentsRequired || []).join(", "))}</p>
      <p><strong>Missing:</strong> ${escapeHtml((scheme.missingDocuments || []).join(", ") || "None")}</p>
      ${scheme.deadline ? `<p><strong>Deadline:</strong> ${escapeHtml(new Date(scheme.deadline).toLocaleDateString())}</p>` : ""}
      <a class="apply-cta" href="/apply-assistant/${encodeURIComponent(String(scheme.id || ""))}">${escapeHtml(text.apply)}</a>
    </article>
  `;

  resultList.innerHTML = `
    <section class="eligible-summary" aria-live="polite">
      <div class="result-icon">âœ…</div>
      <h2>${escapeHtml(intro)}</h2>
      ${latestRecommendationMeta.aiSummary ? `<p class="ai-summary">${escapeHtml(latestRecommendationMeta.aiSummary)}</p>` : ""}
      ${centralSchemes.length ? `
        <h3 class="scheme-section-title">Central Government Schemes</h3>
        <div class="scheme-detail-list">${centralSchemes.map(renderSchemeCard).join("")}</div>
      ` : ""}
      ${stateSchemes.length ? `
        <h3 class="scheme-section-title">State Government Schemes</h3>
        <div class="scheme-detail-list">${stateSchemes.map((scheme, index) => renderSchemeCard(scheme, centralSchemes.length + index)).join("")}</div>
      ` : ""}
    </section>
  `;

  speak(`${latestRecommendationMeta.voiceSummary || "These are your best matching schemes. Apply for the first one first."} ${schemeNames.join(". ")}`);
}

featureVoiceNative.textContent = text.featureVoice;
featurePasswordNative.textContent = text.featurePassword;
featureQuestionsNative.textContent = text.featureQuestions;
featureDocumentsNative.textContent = text.featureDocuments;
document.getElementById("backButton").addEventListener("click", () => window.history.back());
voiceBanner.addEventListener("click", () => speak(getQuestionSpeech(questions[step])));
renderQuestion();
