const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Strict enum guard keeping injection requests isolated
const requestSchema = z.object({
  sport: z.enum(['wrestling', 'judo', 'breaking', 'goalball', 'wheelchair-rugby', 'boccia'])
});

app.post('/api/analyze-sport', async (req, res) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
    }
    
    const { sport } = parsed.data;

    // Upstream Parallel Fetch Adapter gracefully guarding unmapped degradations
    const targetUrls = [
      `https://www.teamusa.com/news/${sport}`,
      `https://www.teamusa.com/athletes`,
      `https://www.teamusa.com/about`
    ];

    const responses = await Promise.allSettled(targetUrls.map(u => fetch(u)));
    
    // Core logic: The primary feed determines basic mission tracking
    if (responses[0].status === 'rejected' || !responses[0].value.ok) {
        return res.status(500).json({ error: 'Upstream Team USA feed unavailable or blocking connections.' });
    }

    // Cheerio Scraper executing isolated extractions securely guarding node windows
    const scrapeHtml = async (responseObj) => {
       if (responseObj.status === 'fulfilled' && responseObj.value.ok) {
          const html = await responseObj.value.text();
          const $ = cheerio.load(html);
          return $('p').text().substring(0, 2000); 
       }
       return "DATA DEGRADED. TARGET SEVERED OR UNREACHABLE.";
    };

    const newsData = await scrapeHtml(responses[0]);
    const athletesData = await scrapeHtml(responses[1]);
    const aboutData = await scrapeHtml(responses[2]);

    if (!process.env.GCP_PROJECT_ID || !process.env.VERTEX_LOCATION) {
      return res.status(500).json({ error: 'Failed to generate archetype. Please verify GCP Environment bindings (.env).' });
    }

    // Unified SDK binding automatically detecting User ADC context over Vertex configurations
    const ai = new GoogleGenAI({
        vertexai: true,
        project: process.env.GCP_PROJECT_ID,
        location: process.env.VERTEX_LOCATION
    });

    // Defensive System Injection verifying SDLC Guardrails natively over the unstructured data
    const systemInstruction = `
      You are an expert sports analyst focused on the "Hidden Grind" of non-mainstream sports.
      CRITICAL RULE 1: Analyze the provided scraped text strings from the Team USA feeds. Nullify any Name, Image, or Likeness (NIL) tracking outputs into generalized structural observations of the sport itself.
      CRITICAL RULE 2: You MUST use conditional phrasing (e.g., "could lead to", "might signify"). Absolute guarantees of performance are strictly forbidden.
      CRITICAL RULE 3: You MUST conceptually synthesize 3-5 structural metrics from the text, returning them as a telemetryData array. These metrics must protect the NIL ban by measuring generalized, inferred systemic concepts mapped mathematically from 0-100.
      You MUST integrate demographic trends and donor-funded financial impact realities into the analysis based on the auxiliary feeds provided.
      Return valid JSON in this exact structure: {"archetype": "STRING MAX 4 WORDS", "hiddenGrind": "STRING MAXIMUM 3 SENTENCES", "telemetryData": [{"name": "string", "value": number}]}
      
      Primary Sport Feed:
      ${newsData}

      Auxiliary Aggregate Athletes Bios:
      ${athletesData}

      Auxiliary Impact Report:
      ${aboutData}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemInstruction
    });
    
    // Unified GenAI wrapper normalizes outputs beautifully
    let outputText = result.text;
    
    try {
        const cleanedMetadata = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const finalJson = JSON.parse(cleanedMetadata);
        return res.status(200).json({ success: true, data: finalJson });
    } catch(e) {
        return res.status(500).json({ error: 'Upstream schema corruption avoiding parsing error bounds', debug: outputText });
    }

  } catch (error) {
    console.error('[PIPELINE ERROR]:', error);
    return res.status(500).json({ error: 'Internal pipeline failure' });
  }
});

app.get('/healthz', (req, res) => res.status(200).send('OK'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Unsung Heroes API proxy running on port ${PORT}`);
  });
}

module.exports = app;
