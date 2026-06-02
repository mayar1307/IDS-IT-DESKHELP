const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

const roleMap = {
  Admin: 1,
  "IT Support Agent": 2,
  Employee: 3,
  Manager: 4
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedRole = document.getElementById("role").value;

  const registerData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    roleId: roleMap[selectedRole],
    departmentId: 1
  };

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    });

    const data = await response.json();
    message.textContent = data.message;

    if (response.ok) {
      setTimeout(() => {
        window.location.href = "/pages/login.html";
      }, 800);
    }
  } catch (error) {
    message.textContent = "Something went wrong.";
    console.error(error);
  }
});