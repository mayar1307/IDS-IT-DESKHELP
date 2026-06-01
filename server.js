const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const statusRoutes = require("./routes/statusRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/status", statusRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/pages/index.html");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
