const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/pages/login.html";
}

const ticketForm = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");
const message = document.getElementById("message");

async function loadTickets() {
  try {
    const response = await fetch("/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const tickets = await response.json();

    ticketList.innerHTML = "";

    tickets.forEach((ticket) => {
      const card = document.createElement("div");
      card.className = "ticket-card";

      card.innerHTML = `
        <h3>${ticket.Title}</h3>
        <p>${ticket.Description}</p>
        <p><strong>Category:</strong> ${ticket.Category}</p>
        <p><strong>Priority:</strong> ${ticket.Priority}</p>
        <p><strong>Status:</strong> ${ticket.Status}</p>
        <p><strong>Created:</strong> ${new Date(ticket.CreatedAt).toLocaleString()}</p>

        <div class="comment-box">
          <input type="text" id="comment-${ticket.TicketId}" placeholder="Add a comment">
          <button class="btn small" onclick="addComment(${ticket.TicketId})">Comment</button>
          <button class="btn secondary small" onclick="loadComments(${ticket.TicketId})">View Comments</button>
        </div>

        <div id="comments-${ticket.TicketId}" class="comments"></div>

        <div class="attachment-box">
          <input type="text" id="attachment-${ticket.TicketId}" placeholder="File path e.g. docs/error.png">
          <button class="btn small" onclick="addAttachment(${ticket.TicketId})">Add Attachment</button>
          <button class="btn secondary small" onclick="loadAttachments(${ticket.TicketId})">View Attachments</button>
        </div>

        <div id="attachments-${ticket.TicketId}" class="comments"></div>
      `;

      ticketList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

ticketForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ticketData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    categoryId: Number(document.getElementById("category").value),
    priorityId: Number(document.getElementById("priority").value),
    createdBy: user.userId,
    assignedTo: user.userId,
    statusId: 1
  };

  try {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ticketData)
    });

    const data = await response.json();
    message.textContent = data.message;

    if (response.ok) {
      ticketForm.reset();
      loadTickets();
    }
  } catch (error) {
    console.error(error);
  }
});

async function addComment(ticketId) {
  const input = document.getElementById(`comment-${ticketId}`);

  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ticketId,
      message: input.value
    })
  });

  const data = await response.json();
  alert(data.message);
  input.value = "";
}

async function loadComments(ticketId) {
  const response = await fetch(`/api/comments/ticket/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const comments = await response.json();
  const container = document.getElementById(`comments-${ticketId}`);

  container.innerHTML = comments.map(comment => `
    <div class="mini-card">
      <strong>${comment.UserName}</strong>
      <p>${comment.Message}</p>
    </div>
  `).join("");
}

async function addAttachment(ticketId) {
  const input = document.getElementById(`attachment-${ticketId}`);

  const response = await fetch("/api/attachments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ticketId,
      filePath: input.value
    })
  });

  const data = await response.json();
  alert(data.message);
  input.value = "";
}

async function loadAttachments(ticketId) {
  const response = await fetch(`/api/attachments/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const attachments = await response.json();
  const container = document.getElementById(`attachments-${ticketId}`);

  container.innerHTML = attachments.map(att => `
    <div class="mini-card">
      <p>${att.FilePath}</p>
    </div>
  `).join("");
}

function logout() {
  localStorage.clear();
  window.location.href = "/pages/login.html";
}

loadTickets();