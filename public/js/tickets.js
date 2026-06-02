const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/pages/login.html";
}

const ticketForm = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");
const message = document.getElementById("message");

async function loadTickets() {
  const response = await fetch("/api/tickets", {
    headers: { Authorization: `Bearer ${token}` }
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

      <button class="btn small" onclick="showEditForm(${ticket.TicketId}, '${ticket.Title}', '${ticket.Description}')">
        Edit
      </button>

      <button class="btn secondary small" onclick="deleteTicket(${ticket.TicketId})">
        Delete
      </button>

      <div id="edit-${ticket.TicketId}" class="comments"></div>

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
});

function showEditForm(ticketId, title, description) {
  const container = document.getElementById(`edit-${ticketId}`);

  container.innerHTML = `
    <div class="mini-card">
      <input type="text" id="edit-title-${ticketId}" value="${title}">
      <textarea id="edit-description-${ticketId}">${description}</textarea>

      <select id="edit-category-${ticketId}">
        <option value="1">Hardware</option>
        <option value="2">Software</option>
        <option value="3">Network</option>
        <option value="4">Email</option>
        <option value="5">Access Request</option>
        <option value="6">Other</option>
      </select>

      <select id="edit-priority-${ticketId}">
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
        <option value="4">Critical</option>
      </select>

      <select id="edit-status-${ticketId}">
        <option value="1">Open</option>
        <option value="2">In Progress</option>
        <option value="3">Pending</option>
        <option value="4">Resolved</option>
        <option value="5">Closed</option>
      </select>

      <button class="btn small" onclick="updateTicket(${ticketId})">Save Update</button>
    </div>
  `;
}

async function updateTicket(ticketId) {
  const updatedTicket = {
    title: document.getElementById(`edit-title-${ticketId}`).value,
    description: document.getElementById(`edit-description-${ticketId}`).value,
    categoryId: Number(document.getElementById(`edit-category-${ticketId}`).value),
    priorityId: Number(document.getElementById(`edit-priority-${ticketId}`).value),
    assignedTo: user.userId,
    statusId: Number(document.getElementById(`edit-status-${ticketId}`).value)
  };

  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedTicket)
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
    loadTickets();
  }
}

async function deleteTicket(ticketId) {
  if (!confirm("Are you sure you want to delete this ticket?")) return;

  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
    loadTickets();
  }
}

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
    headers: { Authorization: `Bearer ${token}` }
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
    headers: { Authorization: `Bearer ${token}` }
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