const { GoogleGenAI } = require('@google/genai');

try {
  const ai = new GoogleGenAI({ vertexai: { project: 'test-project', location: 'global' } });
  console.log("Constructor 1 succeeded");
} catch (e) { console.error("Constructor 1 failed:", e.message); }

try {
  const ai2 = new GoogleGenAI({ project: 'test-project', location: 'global' });
  console.log("Constructor 2 succeeded");
} catch (e) { console.error("Constructor 2 failed:", e.message); }
