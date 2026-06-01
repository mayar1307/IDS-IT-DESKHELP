const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/pages/login.html";
}

document.getElementById("userName").textContent = user?.name || "User";
document.getElementById("userRole").textContent = user?.role || "";

async function loadDashboardStats() {
  try {
    const response = await fetch("/api/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const stats = await response.json();

    document.getElementById("totalTickets").textContent = stats.totalTickets;
    document.getElementById("openTickets").textContent = stats.openTickets;
    document.getElementById("inProgressTickets").textContent = stats.inProgressTickets;
    document.getElementById("pendingTickets").textContent = stats.pendingTickets;
    document.getElementById("resolvedTickets").textContent = stats.resolvedTickets;
    document.getElementById("closedTickets").textContent = stats.closedTickets;
    document.getElementById("totalUsers").textContent = stats.totalUsers;
  } catch (error) {
    console.error(error);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/pages/login.html";
}

loadDashboardStats();