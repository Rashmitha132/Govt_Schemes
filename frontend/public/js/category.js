// File: public/category.js
const categoriesGrid = document.getElementById("categoriesGrid");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const logoutButton = document.getElementById("logoutButton");
const voiceButton = document.getElementById("voiceButton");
const toast = document.getElementById("toast");
const headingNativeText = document.getElementById("headingNativeText");
const subheadingNativeText = document.getElementById("subheadingNativeText");
const voiceNativeText = document.getElementById("voiceNativeText");
const nextNativeText = document.getElementById("nextNativeText");
const featureVoiceNative = document.getElementById("featureVoiceNative");
const featurePasswordNative = document.getElementById("featurePasswordNative");
const featureExploreNative = document.getElementById("featureExploreNative");
const featureMissedNative = document.getElementById("featureMissedNative");
const featureVoiceTitle = document.getElementById("featureVoiceTitle");
const featurePasswordTitle = document.getElementById("featurePasswordTitle");
const featureExploreTitle = document.getElementById("featureExploreTitle");
const featureMissedTitle = document.getElementById("featureMissedTitle");

const language = localStorage.getItem("appLanguage") || "en";
let selectedCategory = localStorage.getItem("selectedCategory") || "";
let categories = [];
let toastTimer;

const fallbackCategories = [
  {
    id: "farmer",
    name: "Farmer",
    localName: "किसान",
    localNameKn: "ರೈತ",
    icon: "👨‍🌾",
    schemeCount: 12,
    color: "#1a7a4a"
  },
  {
    id: "woman",
    name: "Woman",
    localName: "महिला",
    localNameKn: "ಮಹಿಳೆ",
    icon: "👩",
    schemeCount: 9,
    color: "#e64b3c"
  },
  {
    id: "senior",
    name: "Senior",
    localName: "बुजुर्ग",
    localNameKn: "ಹಿರಿಯರು",
    icon: "👴",
    schemeCount: 7,
    color: "#f2a51a"
  },
  {
    id: "family",
    name: "Family",
    localName: "परिवार",
    localNameKn: "ಕುಟುಂಬ",
    icon: "🏠",
    schemeCount: 11,
    color: "#2484b8"
  }
];

const copy = {
  hi: {
    heading: "आप कौन हैं?",
    subheading: "संबंधित योजनाएं देखने के लिए अपनी श्रेणी चुनें",
    prompt: "आप कौन हैं? अपनी श्रेणी चुनें",
    next: "आगे बढ़ें",
    schemes: "योजनाएं",
    featureVoiceTitle: "आवाज मार्गदर्शन",
    featurePasswordTitle: "पासवर्ड की जरूरत नहीं",
    featureExploreTitle: "लॉगिन के बिना देखें",
    featureMissedTitle: "मिस्ड कॉल लॉगिन",
    featureVoice: "आवाज से सहायता",
    featurePassword: "पासवर्ड की जरूरत नहीं",
    featureExplore: "लॉगिन के बिना जानकारी देखें",
    featureMissed: "मिस्ड कॉल से लॉगिन"
  },
  kn: {
    heading: "ನೀವು ಯಾರು?",
    subheading: "ಸಂಬಂಧಿತ ಯೋಜನೆಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    prompt: "ನೀವು ಯಾರು? ನಿಮ್ಮ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    next: "ಮುಂದೆ ಹೋಗಿ",
    schemes: "ಯೋಜನೆಗಳು",
    featureVoiceTitle: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    featurePasswordTitle: "ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ",
    featureExploreTitle: "ಲಾಗಿನ್ ಇಲ್ಲದೆ ನೋಡಿ",
    featureMissedTitle: "ಮಿಸ್ಡ್ ಕಾಲ್ ಲಾಗಿನ್",
    featureVoice: "ಧ್ವನಿ ಸಹಾಯ",
    featurePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ",
    featureExplore: "ಲಾಗಿನ್ ಇಲ್ಲದೆ ಮಾಹಿತಿ ನೋಡಿ",
    featureMissed: "ಮಿಸ್ಡ್ ಕಾಲ್ ಮೂಲಕ ಲಾಗಿನ್"
  },
  en: {
    heading: "Who are you?",
    subheading: "Select your category to see relevant schemes",
    prompt: "Who are you? Tap your category",
    next: "Next",
    schemes: "schemes",
    featureVoiceTitle: "Voice guided",
    featurePasswordTitle: "No password needed",
    featureExploreTitle: "Explore without login",
    featureMissedTitle: "Missed call login",
    featureVoice: "Voice assistance",
    featurePassword: "No password needed",
    featureExplore: "View without login information",
    featureMissed: "Login by missed call"
  },
  te: {
    heading: "మీరు ఎవరు?",
    subheading: "సంబంధిత పథకాలను చూడటానికి మీ వర్గాన్ని ఎంచుకోండి",
    prompt: "మీరు ఎవరు? మీ వర్గాన్ని ఎంచుకోండి",
    next: "తదుపరి",
    schemes: "పథకాలు",
    featureVoiceTitle: "వాయిస్ మార్గదర్శనం",
    featurePasswordTitle: "పాస్‌వర్డ్ అవసరం లేదు",
    featureExploreTitle: "లాగిన్ లేకుండా చూడండి",
    featureMissedTitle: "మిస్డ్ కాల్ లాగిన్",
    featureVoice: "వాయిస్ సహాయం",
    featurePassword: "పాస్‌వర్డ్ అవసరం లేదు",
    featureExplore: "లాగిన్ లేకుండా సమాచారం చూడండి",
    featureMissed: "మిస్డ్ కాల్ ద్వారా లాగిన్"
  }
};

const activeCopy = copy[language] || copy.en;
const categoryTranslations = {
  farmer: {
    en: "Farmer",
    as: "কৃষক",
    bn: "কৃষক",
    brx: "आबादगिरि",
    doi: "किसान",
    gu: "ખેડૂત",
    hi: "किसान",
    kn: "ರೈತ",
    ks: "کسان",
    kok: "शेतकार",
    mai: "किसान",
    ml: "കർഷകൻ",
    mni: "ꯂꯧꯎ-ꯁꯤꯡꯎ",
    mr: "शेतकरी",
    ne: "किसान",
    or: "ଚାଷୀ",
    pa: "ਕਿਸਾਨ",
    sa: "कृषकः",
    sat: "ᱪᱟᱥᱟᱹ",
    sd: "هاري",
    ta: "விவசாயி",
    te: "రైతు",
    ur: "کسان"
  },
  woman: {
    en: "Woman",
    as: "মহিলা",
    bn: "মহিলা",
    brx: "महिला",
    doi: "महिला",
    gu: "મહિલા",
    hi: "महिला",
    kn: "ಮಹಿಳೆ",
    ks: "خاتون",
    kok: "बायल",
    mai: "महिला",
    ml: "സ്ത്രീ",
    mni: "ꯅꯨꯄꯤ",
    mr: "महिला",
    ne: "महिला",
    or: "ମହିଳା",
    pa: "ਮਹਿਲਾ",
    sa: "महिला",
    sat: "ᱢᱟᱹᱭᱡᱤᱭᱩ",
    sd: "عورت",
    ta: "பெண்",
    te: "మహిళ",
    ur: "خاتون"
  },
  senior: {
    en: "Senior",
    as: "জ্যেষ্ঠ নাগৰিক",
    bn: "প্রবীণ",
    brx: "बुजुर्ग",
    doi: "बुजुर्ग",
    gu: "વરિષ્ઠ નાગરિક",
    hi: "बुजुर्ग",
    kn: "ಹಿರಿಯರು",
    ks: "بزرگ",
    kok: "ज्येष्ठ नागरिक",
    mai: "बुजुर्ग",
    ml: "മുതിർന്നവർ",
    mni: "ꯑꯍꯜ",
    mr: "ज्येष्ठ नागरिक",
    ne: "ज्येष्ठ नागरिक",
    or: "ବରିଷ୍ଠ ନାଗରିକ",
    pa: "ਬਜ਼ੁਰਗ",
    sa: "वरिष्ठः",
    sat: "ᱢᱟᱨᱟᱝ",
    sd: "بزرگ",
    ta: "மூத்தவர்",
    te: "వృద్ధులు",
    ur: "بزرگ"
  },
  family: {
    en: "Family",
    as: "পৰিয়াল",
    bn: "পরিবার",
    brx: "परिवार",
    doi: "परिवार",
    gu: "પરિવાર",
    hi: "परिवार",
    kn: "ಕುಟುಂಬ",
    ks: "خاندان",
    kok: "कुटुंब",
    mai: "परिवार",
    ml: "കുടുംബം",
    mni: "ꯏꯃꯨꯡ",
    mr: "कुटुंब",
    ne: "परिवार",
    or: "ପରିବାର",
    pa: "ਪਰਿਵਾਰ",
    sa: "परिवारः",
    sat: "ᱚᱲᱟᱜ",
    sd: "خاندان",
    ta: "குடும்பம்",
    te: "కుటుంబం",
    ur: "خاندان"
  },
  business: {
    en: "Business",
    as: "ব্যৱসায়",
    bn: "ব্যবসা",
    brx: "व्यापार",
    doi: "कारोबार",
    gu: "વ્યવસાય",
    hi: "व्यवसाय",
    kn: "ವ್ಯಾಪಾರ",
    ks: "کاروبار",
    kok: "वेवसाय",
    mai: "व्यवसाय",
    ml: "വ്യാപാരം",
    mni: "ꯂꯜꯂꯣꯟ",
    mr: "व्यवसाय",
    ne: "व्यवसाय",
    or: "ବ୍ୟବସାୟ",
    pa: "ਕਾਰੋਬਾਰ",
    sa: "व्यवसायः",
    sat: "ᱵᱮᱯᱟᱨ",
    sd: "ڪاروبار",
    ta: "வணிகம்",
    te: "వ్యాపారం",
    ur: "کاروبار"
  },
  student: {
    en: "Student",
    as: "ছাত্ৰ",
    bn: "ছাত্র",
    brx: "विद्यार्थी",
    doi: "विद्यार्थी",
    gu: "વિદ્યાર્થી",
    hi: "विद्यार्थी",
    kn: "ವಿದ್ಯಾರ್ಥಿ",
    ks: "طالب علم",
    kok: "विद्यार्थी",
    mai: "विद्यार्थी",
    ml: "വിദ്യാർത്ഥി",
    mni: "ꯃꯍꯩꯔꯣꯏ",
    mr: "विद्यार्थी",
    ne: "विद्यार्थी",
    or: "ଛାତ୍ର",
    pa: "ਵਿਦਿਆਰਥੀ",
    sa: "विद्यार्थी",
    sat: "ᱯᱟᱲᱦᱟᱣᱟᱜ",
    sd: "شاگرد",
    ta: "மாணவர்",
    te: "విద్యార్థి",
    ur: "طالب علم"
  }
};
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

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function isUserLoggedIn() {
  const token = localStorage.getItem("yojanMitraAuthToken");
  const user = localStorage.getItem("loggedInUser");
  const isLoggedIn = localStorage.getItem("yojanMitraLoggedIn") === "true";

  if (token && user && isLoggedIn) {
    return true;
  }

  localStorage.removeItem("yojanMitraLoggedIn");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("yojanMitraUserId");
  return false;
}

function logoutUser() {
  localStorage.removeItem("yojanMitraAuthToken");
  localStorage.removeItem("yojanMitraLoggedIn");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("user");
  localStorage.removeItem("yojanMitraUserId");
  localStorage.removeItem("postLoginRedirect");
  showToast("Logged out");
  setTimeout(() => {
    window.location.href = "/category.html";
  }, 500);
}

function renderAuthActions() {
  logoutButton.hidden = !isUserLoggedIn();
}

function getLocalName(category) {
  const translatedName = categoryTranslations[category.id]?.[language];
  if (translatedName) {
    return translatedName;
  }

  if (language === "kn" && category.localNameKn) {
    return category.localNameKn;
  }

  if (language === "en") {
    return category.name;
  }

  return category.localName || category.name;
}

function getSpeechLang() {
  return speechLangCodes[language] || "hi-IN";
}

function speakPrompt() {
  if (!("speechSynthesis" in window)) {
    showToast("Voice not supported on this browser");
    return;
  }

  window.speechSynthesis.cancel();
  const text = activeCopy.prompt;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getSpeechLang();
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

async function postJson(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

function renderCategories() {
  categoriesGrid.innerHTML = categories.map((category) => {
    const isSelected = selectedCategory === category.id;
    const categoryName = getLocalName(category);
    return `
      <button
        class="category-option ${isSelected ? "selected" : ""}"
        type="button"
        data-category-id="${category.id}"
        style="--category-color: ${category.color};"
        aria-pressed="${isSelected}"
      >
        <span class="category-icon" aria-hidden="true">${category.icon}</span>
        <span class="category-name">${categoryName}</span>
        <span class="scheme-count">${category.schemeCount} ${activeCopy.schemes}</span>
      </button>
    `;
  }).join("");

  nextButton.disabled = !selectedCategory;
}

async function goToQuestions(categoryId) {
  selectedCategory = categoryId;
  localStorage.setItem("selectedCategory", selectedCategory);
  renderCategories();
  const questionsUrl = `/questions.html?category=${encodeURIComponent(selectedCategory)}`;

  if (!isUserLoggedIn()) {
    localStorage.setItem("postLoginRedirect", questionsUrl);
    showToast("Please login to continue");
    setTimeout(() => {
      window.location.href = "/kisaan-login.html";
    }, 600);
    return;
  }

  try {
    await postJson("https://govt-schemes-2t15.onrender.com/api/categories/select", {
      categoryId: selectedCategory,
      language
    });
  } catch (error) {
    showToast("Saved locally. Opening questions...");
  } finally {
    window.location.href = questionsUrl;
  }
}

async function loadCategories() {
  try {
    const response = await fetch("https://govt-schemes-2t15.onrender.com/api/categories");
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error("Using offline category list");
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not load categories");
    }

    categories = result.categories.length ? result.categories : fallbackCategories;
    renderCategories();
  } catch (error) {
    categories = fallbackCategories;
    renderCategories();
    showToast("Showing default categories");
  }
}

categoriesGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-category-id]");
  if (!card) return;

  selectedCategory = card.dataset.categoryId;
  localStorage.setItem("selectedCategory", selectedCategory);
  renderCategories();
});

nextButton.addEventListener("click", async () => {
  if (!selectedCategory) return;

  try {
    await goToQuestions(selectedCategory);
  } catch (error) {
    showToast(error.message || "Could not save category");
  }
});

backButton.addEventListener("click", () => {
  window.history.back();
});

logoutButton.addEventListener("click", logoutUser);
voiceButton.addEventListener("click", speakPrompt);

headingNativeText.textContent = activeCopy.heading;
subheadingNativeText.textContent = activeCopy.subheading;
voiceNativeText.textContent = activeCopy.prompt;
nextButton.textContent = activeCopy.next;
featureVoiceNative.textContent = activeCopy.featureVoice;
featurePasswordNative.textContent = activeCopy.featurePassword;
featureExploreNative.textContent = activeCopy.featureExplore;
featureMissedNative.textContent = activeCopy.featureMissed;
featureVoiceTitle.textContent = activeCopy.featureVoiceTitle;
featurePasswordTitle.textContent = activeCopy.featurePasswordTitle;
featureExploreTitle.textContent = activeCopy.featureExploreTitle;
featureMissedTitle.textContent = activeCopy.featureMissedTitle;

loadCategories();
renderAuthActions();
setTimeout(speakPrompt, 500);
