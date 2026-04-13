const express = require('express');
const { z } = require('zod');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');
const { Firestore } = require('@google-cloud/firestore');

const router = express.Router();

const compareRequestSchema = z.object({
  sportA: z.string(),
  sportB: z.string(),
  forceSync: z.boolean().optional()
});

const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'unsung-heroes-engine'
});

const compareGeminiResponseSchema = z.object({
  discrepancySynthesis: z.string(),
  physicalTollProfileA: z.string(),
  tippingPointA: z.string(),
  physicalTollProfileB: z.string(),
  tippingPointB: z.string(),
  genderParityInsight: z.string(),
  telemetryDataA: z.array(z.object({ name: z.string(), value: z.number() })),
  telemetryDataB: z.array(z.object({ name: z.string(), value: z.number() }))
});

router.post('/', async (req, res) => {
  try {
    const parsed = compareRequestSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
    }
    
    const { sportA, sportB, forceSync } = parsed.data;

    const docId = [sportA, sportB].sort().join('_vs_');
    const docRef = firestore.collection('comparisons').doc(docId);

    if (!forceSync) {
        const doc = await docRef.get();
        if (doc.exists) {
            const cachedData = doc.data();
            cachedData.cached = true;
            return res.status(200).json(cachedData);
        }
    }

    const targetUrlsA = [
      `https://www.teamusa.com/news/${sportA}`,
      `https://www.teamusa.com/athletes`,
      `https://www.teamusa.com/about`
    ];
    
    const targetUrlsB = [
      `https://www.teamusa.com/news/${sportB}`,
      `https://www.teamusa.com/athletes`,
      `https://www.teamusa.com/about`
    ];

    const allUrls = [...targetUrlsA, ...targetUrlsB];
    const responses = await Promise.allSettled(allUrls.map(u => fetch(u)));
    
    if ((responses[0].status === 'rejected' || !responses[0].value.ok) ||
        (responses[3].status === 'rejected' || !responses[3].value.ok)) {
        return res.status(500).json({ error: 'Primary Upstream Team USA feed unavailable for one or both sports.' });
    }

    const activeSourcesA = [];
    const activeSourcesB = [];

    const scrapeHtml = async (responseObj, url, targetArray) => {
       if (responseObj.status === 'fulfilled' && responseObj.value.ok) {
          targetArray.push(url);
          const html = await responseObj.value.text();
          const $ = cheerio.load(html);
          return $('p').text().substring(0, 2000); 
       }
       return "DATA DEGRADED. TARGET SEVERED OR UNREACHABLE.";
    };

    const newsDataA = await scrapeHtml(responses[0], allUrls[0], activeSourcesA);
    const athletesDataA = await scrapeHtml(responses[1], allUrls[1], activeSourcesA);
    const aboutDataA = await scrapeHtml(responses[2], allUrls[2], activeSourcesA);
    
    const newsDataB = await scrapeHtml(responses[3], allUrls[3], activeSourcesB);
    const athletesDataB = await scrapeHtml(responses[4], allUrls[4], activeSourcesB);
    const aboutDataB = await scrapeHtml(responses[5], allUrls[5], activeSourcesB);

    if (!process.env.GCP_PROJECT_ID || !process.env.VERTEX_LOCATION) {
      return res.status(500).json({ error: 'Failed to generate archetype. Please verify GCP Environment bindings (.env).' });
    }

    const ai = new GoogleGenAI({
        vertexai: true,
        project: process.env.GCP_PROJECT_ID,
        location: process.env.VERTEX_LOCATION
    });

    const systemInstruction = `
      You are an expert sports analyst functioning as a Head-to-Head Parity Engine.
      CRITICAL RULE 1: Analyze the provided scraped texts from two distinct Olympic/Paralympic sports. Nullify any Name, Image, or Likeness (NIL) tracking outputs into generalized structural observations.
      CRITICAL RULE 2: You MUST conceptually synthesize 3-5 structural metrics for EACH sport, returning them as telemetryDataA and telemetryDataB arrays. Map them mathematically from 0-100 based on the strain, funding, or isolation levels.
      CRITICAL RULE 3: You MUST generate a "discrepancySynthesis" string. This AI output explicitly contrasts the financial and visibility realities of the two sports, highlighting the discrepancy.
      CRITICAL RULE 4: This "discrepancySynthesis" MUST strictly use conditional phrasing (e.g., "The lack of mainstream news coverage could isolate these athletes vs...", "Funding discrepancies might signify..."). Absolute guarantees of performance are strictly forbidden. Maintain the NIL ban.
      CRITICAL RULE 5: Synthesize "physicalTollProfileA", "tippingPointA" for Sport A, and "physicalTollProfileB", "tippingPointB" for Sport B defining conditional bounds of strain and thresholds gracefully natively.
      CRITICAL RULE 6: Synthesize a "genderParityInsight" explicitly capturing disparate impact loads matching Male and Female roster bounds intuitively logically conditionally natively.
      
      Return valid JSON in this exact structure: {"discrepancySynthesis": "STRING MAXIMUM 4 SENTENCES", "physicalTollProfileA": "...", "tippingPointA": "...", "physicalTollProfileB": "...", "tippingPointB": "...", "genderParityInsight": "...", "telemetryDataA": [{"name": "string", "value": number}], "telemetryDataB": [{"name": "string", "value": number}]}
      
      Sport A Context:
      News: ${newsDataA}
      Athletes: ${athletesDataA}
      About: ${aboutDataA}
      
      Sport B Context:
      News: ${newsDataB}
      Athletes: ${athletesDataB}
      About: ${aboutDataB}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemInstruction
    });
    
    let outputText = result.text;
    
    try {
        const cleanedMetadata = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const finalJson = JSON.parse(cleanedMetadata);
        
        const parsedLLM = compareGeminiResponseSchema.safeParse(finalJson);
        if (!parsedLLM.success) {
            return res.status(500).json({ error: 'LLM generated structurally invalid JSON array payload.', details: parsedLLM.error.issues });
        }

        const payload = { 
             success: true, 
             cached: false,
             data: parsedLLM.data,
             metadata: { activeSourcesA, activeSourcesB }
        };

        await docRef.set(payload);
        return res.status(200).json(payload);
    } catch(e) {
        return res.status(500).json({ error: 'Upstream schema corruption avoiding parsing error bounds', debug: outputText });
    }

  } catch (error) {
    console.error('[PIPELINE ERROR]:', error);
    return res.status(500).json({ error: 'Internal pipeline failure' });
  }
});

module.exports = router;
