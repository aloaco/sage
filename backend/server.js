const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const aiRoutes = require("./routes/ai");

app.get("/", (req, res) => {
  res.json({ message: "Sage Backend API is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
