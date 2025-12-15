import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Server is running");
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
