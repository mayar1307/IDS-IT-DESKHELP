const ticketForm = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");

ticketForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ticketData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value
  };

  try {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ticketData)
    });

    const data = await response.json();

    console.log("Ticket response:", data);

    const card = document.createElement("div");
    card.className = "ticket-card";
    card.innerHTML = `
      <h3>${ticketData.title}</h3>
      <p>${ticketData.description}</p>
      <p><strong>Category:</strong> ${ticketData.category}</p>
      <p><strong>Priority:</strong> ${ticketData.priority}</p>
      <p><strong>Status:</strong> Temporary Frontend Ticket</p>
    `;

    ticketList.appendChild(card);
    ticketForm.reset();
  } catch (error) {
    console.error(error);
  }
});