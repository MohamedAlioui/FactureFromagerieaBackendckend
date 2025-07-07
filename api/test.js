import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
    message: "Test API is working!",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    status: "OK",
    message: "Test endpoint working",
    timestamp: new Date().toISOString()
  });
});

export default app; 