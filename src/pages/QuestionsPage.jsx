// File: src/pages/QuestionsPage.jsx
import { useMemo, useState } from "react";

const questionSets = {
  women: [
    { key: "age", label: "Age", icon: "🎂", type: "number", placeholder: "Enter age" },
    { key: "maritalStatus", label: "Marital status", icon: "💍", type: "select", options: ["Single", "Married", "Widowed", "Divorced"] },
    { key: "income", label: "Income", icon: "💰", type: "number", placeholder: "Monthly or annual income" },
    { key: "occupation", label: "Occupation", icon: "🧰", type: "text", placeholder: "Work or occupation" },
    { key: "state", label: "State", icon: "📍", type: "text", placeholder: "Your state" },
    { key: "educationLevel", label: "Education level", icon: "🎓", type: "select", options: ["No formal education", "School", "PUC/12th", "Graduate", "Postgraduate"] },
  ],
  woman: [],
  student: [
    { key: "age", label: "Age", icon: "🎂", type: "number", placeholder: "Enter age" },
    { key: "educationLevel", label: "Education level", icon: "🎓", type: "select", options: ["School", "PUC/12th", "Diploma", "Graduate", "Postgraduate"] },
    { key: "annualFamilyIncome", label: "Annual family income", icon: "💰", type: "number", placeholder: "Family income per year" },
    { key: "casteCategory", label: "Caste/category", icon: "🪪", type: "select", options: ["General", "OBC", "SC", "ST", "Minority", "Other"] },
    { key: "state", label: "State", icon: "📍", type: "text", placeholder: "Your state" },
    { key: "gender", label: "Gender", icon: "👤", type: "select", options: ["Female", "Male", "Other"] },
  ],
  farmer: [
    { key: "age", label: "Age", icon: "🎂", type: "number", placeholder: "Enter age" },
    { key: "landSize", label: "Land size", icon: "🌾", type: "number", placeholder: "Land in acres" },
    { key: "annualIncome", label: "Annual income", icon: "💰", type: "number", placeholder: "Income per year" },
    { key: "cropType", label: "Crop type", icon: "🌱", type: "text", placeholder: "Example: rice, cotton" },
    { key: "state", label: "State", icon: "📍", type: "text", placeholder: "Your state" },
    { key: "irrigationAvailable", label: "Irrigation available", icon: "💧", type: "select", options: ["Yes", "No"] },
  ],
  "senior-citizen": [
    { key: "age", label: "Age", icon: "🎂", type: "number", placeholder: "Enter age" },
    { key: "pensionStatus", label: "Pension status", icon: "🏦", type: "select", options: ["Receiving pension", "Not receiving pension"] },
    { key: "income", label: "Income", icon: "💰", type: "number", placeholder: "Monthly or annual income" },
    { key: "state", label: "State", icon: "📍", type: "text", placeholder: "Your state" },
    { key: "healthCondition", label: "Health condition", icon: "🩺", type: "text", placeholder: "Example: disability, chronic illness" },
  ],
  senior: [],
  business: [
    { key: "age", label: "Age", icon: "🎂", type: "number", placeholder: "Enter age" },
    { key: "businessType", label: "Business type", icon: "🏪", type: "text", placeholder: "Example: shop, tailoring" },
    { key: "annualIncome", label: "Annual income", icon: "💰", type: "number", placeholder: "Income per year" },
    { key: "state", label: "State", icon: "📍", type: "text", placeholder: "Your state" },
    { key: "loanRequired", label: "Loan required or not", icon: "📄", type: "select", options: ["Yes", "No"] },
  ],
};

questionSets.woman = questionSets.women;
questionSets.senior = questionSets["senior-citizen"];

const categoryTitles = {
  women: "Women",
  woman: "Women",
  student: "Student",
  farmer: "Farmer",
  senior: "Senior Citizen",
  "senior-citizen": "Senior Citizen",
  business: "Business",
};

export default function QuestionsPage() {
  const params = new URLSearchParams(window.location.search);
  const category = (params.get("category") || localStorage.getItem("selectedCategory") || "farmer").toLowerCase();
  const questions = useMemo(() => questionSets[category] || questionSets.farmer, [category]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [schemes, setSchemes] = useState([]);
  const [recommendationMeta, setRecommendationMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;

  const updateAnswer = (key, value) => {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError("");
    setSchemes([]);

    try {
      const response = await fetch("/api/recommend-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, answers }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not find schemes");
      }

      setRecommendationMeta({
        sections: result.sections || {},
        aiSummary: result.aiSummary || "",
        voiceSummary: result.voiceSummary || "",
      });
      setSchemes(result.schemes || []);
      if ("speechSynthesis" in window && result.voiceSummary) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(result.voiceSummary));
      }
    } catch (requestError) {
      setError(requestError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderSchemeCard = (scheme, index) => (
    <article className="scheme-card priority-card" key={scheme.id || scheme._id || scheme.name}>
      <div className="scheme-card-head">
        <span className="priority-badge">{index === 0 ? "Best Match" : scheme.priorityLabel || "Good Match"}</span>
        <span className="score-badge">{scheme.matchPercentage || 0}%</span>
      </div>
      <h3>{scheme.name}</h3>
      <p><strong>Why eligible:</strong> {scheme.whyEligible || scheme.whyRecommended}</p>
      <p><strong>Benefit:</strong> {scheme.benefit || scheme.benefits}</p>
      <p><strong>Documents needed:</strong> {(scheme.documentsRequired || []).join(", ")}</p>
      <p><strong>Missing documents:</strong> {(scheme.missingDocuments || []).join(", ") || "None"}</p>
      <p><strong>Urgency:</strong> {scheme.applyUrgency || "Open"}</p>
      {scheme.deadline && <p><strong>Deadline:</strong> {new Date(scheme.deadline).toLocaleDateString()}</p>}
      <a href={`/apply-assistant/${encodeURIComponent(scheme.id || scheme._id || "")}`}>Apply now</a>
    </article>
  );

  const handleNext = () => {
    if (!answers[currentQuestion.key]) {
      setError("Please answer this question");
      return;
    }

    setError("");
    if (isLastStep) {
      submitAnswers();
      return;
    }

    setStep((previous) => previous + 1);
  };

  const renderInput = () => {
    if (currentQuestion.type === "select") {
      return (
        <div className="option-list">
          {currentQuestion.options.map((option) => (
            <button
              className={answers[currentQuestion.key] === option ? "option active" : "option"}
              key={option}
              type="button"
              onClick={() => updateAnswer(currentQuestion.key, option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return (
      <input
        className="answer-input"
        inputMode={currentQuestion.type === "number" ? "numeric" : "text"}
        type={currentQuestion.type}
        placeholder={currentQuestion.placeholder}
        value={answers[currentQuestion.key] || ""}
        onChange={(event) => updateAnswer(currentQuestion.key, event.target.value)}
      />
    );
  };

  return (
    <main className="questions-page">
      <section className="questions-shell">
        <button className="back-button" type="button" onClick={() => window.history.back()}>
          ← Back
        </button>

        <div className="voice-banner">
          <span>🤖</span>
          <strong>Answer a few simple questions</strong>
        </div>

        <header>
          <p className="eyebrow">{categoryTitles[category] || "Category"}</p>
          <h1>Find schemes for you</h1>
          <p>Step {step + 1} of {questions.length}</p>
        </header>

        {!schemes.length && (
          <section className="question-card">
            <div className="question-icon">{currentQuestion.icon}</div>
            <h2>{currentQuestion.label}</h2>
            {renderInput()}
            {error && <p className="error-text">{error}</p>}
            <div className="actions">
              <button type="button" disabled={step === 0 || loading} onClick={() => setStep((previous) => previous - 1)}>
                Back
              </button>
              <button type="button" disabled={loading} onClick={handleNext}>
                {loading ? "Finding schemes..." : isLastStep ? "Show schemes" : "Next"}
              </button>
            </div>
          </section>
        )}

        {loading && <p className="loading-text">Finding best schemes for you...</p>}

        {!loading && schemes.length > 0 && (
          <section className="scheme-results">
            <h2>Recommended schemes</h2>
            {recommendationMeta.aiSummary && <p className="ai-summary">{recommendationMeta.aiSummary}</p>}
            {(recommendationMeta.sections?.central || schemes.filter((scheme) => scheme.schemeLevel === "central")).length > 0 && (
              <>
                <h3>Central Government Schemes</h3>
                {(recommendationMeta.sections?.central || schemes.filter((scheme) => scheme.schemeLevel === "central")).map(renderSchemeCard)}
              </>
            )}
            {(recommendationMeta.sections?.state || schemes.filter((scheme) => scheme.schemeLevel === "state")).length > 0 && (
              <>
                <h3>State Government Schemes</h3>
                {(recommendationMeta.sections?.state || schemes.filter((scheme) => scheme.schemeLevel === "state")).map((scheme, index) =>
                  renderSchemeCard(scheme, (recommendationMeta.sections?.central || []).length + index)
                )}
              </>
            )}
          </section>
        )}

        {!loading && schemes.length === 0 && error && step === questions.length - 1 && (
          <p className="error-text">{error}</p>
        )}
      </section>
    </main>
  );
}
