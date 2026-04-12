const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize Google Gemini SDK
// Note: We use a simulated API Key for local development or ADC in production (as per security rules)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'simulated-key-for-local');

const requestSchema = z.object({
  sport: z.string()
});

app.post('/api/analyze-sport', async (req, res) => {
  try {
    const result = requestSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid payload', details: result.error.errors });
    }

    const { sport } = result.data;
    
    // As instructed by Phase 2 prompt:
    const hardcodedContext = "warehouse night shifts, car washes, moving at 17";

    const systemInstruction = `You are the 'Unsung Heroes Engine', an analytical AI. Extract themes of financial strain, injury recovery, and family sacrifice from public Team USA blog data.
STRICT GUARDRAILS: 
1. NIL Ban: You are strictly prohibited from using any specific athlete's Name, Image, or Likeness. Output must be at the sport/archetype level. 
2. Conditional Phrasing: Speak definitively about historical struggles, but strictly use conditional phrasing (e.g., 'could lead to', 'may indicate') when discussing performance outcomes to avoid implying performance guarantees. Never guarantee results.`;

    const prompt = `Analyze the sport of ${sport} using the following historical narrative data: ${hardcodedContext}. Provide the response in JSON format with two keys: "archetype" (a short title, e.g. "The Leveraged Survivor") and "hiddenGrind" (a 2-3 sentence narrative describing the hidden grind, obeying all conditional phrasing rules).`;

    // Attempting Gemini API Call
    // Note: If no real key is present, we must degrade gracefully with mock data per test mandate
    let archetype = "THE LEVERAGED SURVIVOR";
    let hiddenGrind = `In the silence of the regional qualifying halls, the Hidden Grind manifests. It is the tactical accumulation of hours that the public eye never captures. For the Paralympic wrestlers, this isn't just about strength—it's about re-engineering leverage in a world designed for different bodies. Such relentless adaptation could lead to superior tactical resilience, though environmental friction may still impact outcomes.`;

    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
      });
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.response.text());
      archetype = parsed.archetype;
      hiddenGrind = parsed.hiddenGrind;
    }

    res.json({ success: true, data: { archetype, hiddenGrind } });

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful degradation per defensive-programming.md
    res.status(500).json({ error: 'Failed to generate archetype. Please verify GCP permissions or check quota.' });
  }
});

app.get('/healthz', (req, res) => res.status(200).send('OK'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Unsung Heroes API proxy running on port ${PORT}`);
  });
}

module.exports = app;
