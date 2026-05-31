function getTickets(req, res) {
  res.json({
    message: "Get all tickets route working. Database integration will be added later.",
    tickets: []
  });
}

function createTicket(req, res) {
  res.json({
    message: "Create ticket route working. Database integration will be added later.",
    receivedData: req.body
  });
}

function updateTicket(req, res) {
  res.json({
    message: `Update ticket route working for ticket ID: ${req.params.id}`,
    receivedData: req.body
  });
}

function deleteTicket(req, res) {
  res.json({
    message: `Delete ticket route working for ticket ID: ${req.params.id}`
  });
}

module.exports = {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
};