import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
  console.log("Hello");
  console.log(Date.now());
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
