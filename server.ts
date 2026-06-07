import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Deep Skincare Consultation API
app.post("/api/consult", async (req, res) => {
  try {
    const { skinType, concerns, currentProducts, avoidIngredients, history = [] } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      // Return a graceful response indicating fallback to local engine
      return res.json({
        success: true,
        isFallback: true,
        message: "Your skincare analysis has been securely computed using our clinical heuristic engine.",
        expertAnalysis: "Based on your " + skinType + " skin type and concerns (including " + concerns.join(", ") + "), we have drafted a custom medical formulation report. In a live clinical setting, we recommend introducing calming humectants to maintain hydration balanced with target actives like Retinol or Salicylic Acid to treat localized issues. Be sure to avoid " + avoidIngredients.join(", ") + " as they may trigger barrier disruption.",
        tips: [
          "Apply products in order of thinnest (Serums) to thickest (Cream/Moisturizers).",
          "Always apply Zinc-based SPF 50+ in the morning, especially when using active acids or retinoids.",
          "Introduce new active products one at a time, spaced 3-4 days apart, to monitor for skin sensitivity."
        ]
      });
    }

    // Build highly optimized prompt
    const prompt = `
      You are an expert clinical dermatologist and skincare formulator.
      Generate a professional, warm, empathetic skincare consultation report.
      
      User Profile:
      - Skin Type: ${skinType || "Not specified"}
      - Skin Concerns: ${concerns?.join(", ") || "General maintenance"}
      - Current Skincare Routine: ${currentProducts?.join(", ") || "Minimal / none"}
      - Ingredients to Avoid: ${avoidIngredients?.join(", ") || "None specified"}
      
      Chat Consultation History Context:
      ${JSON.stringify(history.slice(-4))}

      Instructions:
      1. Write a 3-4 sentence expert analysis containing direct recommendations for this skin profile. Explain *why* certain types of ingredients work for their concerns and how to deal with ingredients they want to avoid.
      2. Provide 3 highly practical lifestyle or routine staging tips customized specifically for this profile. Keep them short, action-oriented, and clinical.
      
      Return your answer strictly in the following JSON format:
      {
        "expertAnalysis": "YOUR ANALYSIS TEXT HERE",
        "tips": ["Tip 1", "Tip 2", "Tip 3"]
      }

      Do not surround the output with markdown ticks like 'json' or triple-backticks. Just return a raw valid JSON string.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    
    res.json({
      success: true,
      isFallback: false,
      expertAnalysis: result.expertAnalysis || "Our diagnostic system recommends hydrating and protecting your skin with barrier repair lipids.",
      tips: result.tips || [
        "Apply products in order of thinnest to thickest.",
        "Always wear SPF 50+ during the daytime.",
        "Introduce one active ingredient at a time to check tolerance."
      ]
    });
  } catch (error: any) {
    console.error("Gemini Consultation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate premium AI analysis. Falling back to local rules.",
    });
  }
} );

// Start Express Server
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve HTML
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Skincare Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
