const authCard = document.getElementById("authCard");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const setMessage = (element, message, type) => {
  element.textContent = message;
  element.className = `message ${type || ""}`.trim();
};

const submitJson = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

showRegister.addEventListener("click", () => {
  authCard.classList.add("register-mode");
  setMessage(loginMessage, "");
});

showLogin.addEventListener("click", () => {
  authCard.classList.remove("register-mode");
  setMessage(registerMessage, "");
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = registerForm.querySelector(".primary-button");
  const formData = new FormData(registerForm);

  submitButton.disabled = true;
  setMessage(registerMessage, "Creating account...", "");

  try {
    const result = await submitJson("https://govt-schemes-2t15.onrender.com/api/register", {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    setMessage(registerMessage, result.message, result.success ? "success" : "error");

    if (result.success) {
      registerForm.reset();
      setTimeout(() => authCard.classList.remove("register-mode"), 900);
    }
  } catch (error) {
    setMessage(registerMessage, "Registration failed", "error");
  } finally {
    submitButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector(".primary-button");
  const formData = new FormData(loginForm);

  submitButton.disabled = true;
  setMessage(loginMessage, "Checking account...", "");

  try {
    const result = await submitJson("https://govt-schemes-2t15.onrender.com/api/login", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    setMessage(loginMessage, result.message, result.success ? "success" : "error");
  } catch (error) {
    setMessage(loginMessage, "Login failed", "error");
  } finally {
    submitButton.disabled = false;
  }
});
