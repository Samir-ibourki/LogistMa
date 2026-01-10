import express from "express";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/", (req, res) => {
  res.json({ message: "hello world" })
})
app.use("/api", routes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ force: true });
    console.log("✅ Models synchronized");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
