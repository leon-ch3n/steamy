import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chat.js";
import carDataRouter from "./routes/carData.js";
import { researchRouter } from "./routes/research.js";
import { vehicleHistoryRouter } from "./routes/vehicleHistory.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRouter);
app.use("/api/car", carDataRouter);
app.use("/api/research", researchRouter);
app.use("/api/car/history", vehicleHistoryRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

