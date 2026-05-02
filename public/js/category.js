// File: public/category.js
const categoriesGrid = document.getElementById("categoriesGrid");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const voiceButton = document.getElementById("voiceButton");
const toast = document.getElementById("toast");
const headingNativeText = document.getElementById("headingNativeText");
const voiceNativeText = document.getElementById("voiceNativeText");
const nextNativeText = document.getElementById("nextNativeText");
const featureVoiceNative = document.getElementById("featureVoiceNative");
const featurePasswordNative = document.getElementById("featurePasswordNative");
const featureExploreNative = document.getElementById("featureExploreNative");
const featureMissedNative = document.getElementById("featureMissedNative");

const language = localStorage.getItem("appLanguage") || "hi";
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
    prompt: "आप कौन हैं? अपनी श्रेणी चुनें",
    next: "आगे बढ़ें",
    schemes: "योजनाएं",
    featureVoice: "आवाज से सहायता",
    featurePassword: "पासवर्ड की जरूरत नहीं",
    featureExplore: "लॉगिन के बिना जानकारी देखें",
    featureMissed: "मिस्ड कॉल से लॉगिन"
  },
  kn: {
    heading: "ನೀವು ಯಾರು?",
    prompt: "ನೀವು ಯಾರು? ನಿಮ್ಮ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    next: "ಮುಂದೆ ಹೋಗಿ",
    schemes: "ಯೋಜನೆಗಳು",
    featureVoice: "ಧ್ವನಿ ಸಹಾಯ",
    featurePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ",
    featureExplore: "ಲಾಗಿನ್ ಇಲ್ಲದೆ ಮಾಹಿತಿ ನೋಡಿ",
    featureMissed: "ಮಿಸ್ಡ್ ಕಾಲ್ ಮೂಲಕ ಲಾಗಿನ್"
  },
  en: {
    heading: "Who are you?",
    prompt: "Who are you? Tap your category",
    next: "Next",
    schemes: "schemes",
    featureVoice: "Voice assistance",
    featurePassword: "No password needed",
    featureExplore: "View without login information",
    featureMissed: "Login by missed call"
  }
};

const activeCopy = copy[language] || copy.hi;
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

function getLocalName(category) {
  if (language === "kn" && category.localNameKn) {
    return category.localNameKn;
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
  const text = `${activeCopy.prompt}. Who are you? Tap your category.`;
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
    return `
      <button
        class="category-option ${isSelected ? "selected" : ""}"
        type="button"
        data-category-id="${category.id}"
        style="--category-color: ${category.color};"
        aria-pressed="${isSelected}"
      >
        <span class="category-icon" aria-hidden="true">${category.icon}</span>
        <span class="category-name">${category.name}</span>
        <span class="category-subtitle">${getLocalName(category)}</span>
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

  try {
    await postJson("/api/categories/select", {
      categoryId: selectedCategory,
      language
    });
  } catch (error) {
    showToast("Saved locally. Opening questions...");
  } finally {
    window.location.href = `/questions.html?category=${encodeURIComponent(selectedCategory)}`;
  }
}

async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
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
  goToQuestions(selectedCategory);
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

voiceButton.addEventListener("click", speakPrompt);

headingNativeText.textContent = activeCopy.heading;
voiceNativeText.textContent = activeCopy.prompt;
nextNativeText.textContent = activeCopy.next;
featureVoiceNative.textContent = activeCopy.featureVoice;
featurePasswordNative.textContent = activeCopy.featurePassword;
featureExploreNative.textContent = activeCopy.featureExplore;
featureMissedNative.textContent = activeCopy.featureMissed;

loadCategories();
setTimeout(speakPrompt, 500);
