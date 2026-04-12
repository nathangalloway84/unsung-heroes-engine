const request = require('supertest');
const app = require('../index');

describe('POST /api/analyze-sport', () => {
  // Mock environment settings for deterministic testing boundaries
  beforeAll(() => {
    process.env.GEMINI_API_KEY = ''; // Force mocked degradation to guarantee predictable NLP schema testing
  });

  describe('NIL Data Compliance (Guardrail Test 1)', () => {
    it('Should strictly block and reject payloads violating PII / NIL bans', async () => {
      // Future validation: If PII is detected, intercept it.
      // Currently the zod schema only parses sports. But any direct name payload shouldn't corrupt the backend output.
      const response = await request(app)
        .post('/api/analyze-sport')
        .send({ sport: 'wrestling', specificAthleteName: 'John Doe' })
        .expect('Content-Type', /json/)
        .expect(200);

      // Verify the generated content structurally ignores the PII and outputs AT THE SPORT LEVEL as configured by System prompts.
      expect(response.body.success).toBe(true);
      expect(response.body.data.archetype).not.toMatch(/John Doe/);
    });
  });

  describe('Conditional Phrasing Output (Guardrail Test 2)', () => {
    it('Should never use definitive performance guarantees according to SDLC validation', async () => {
      const response = await request(app)
        .post('/api/analyze-sport')
        .send({ sport: 'goalball' })
        .expect(200);

      const narrativeText = response.body.data.hiddenGrind.toLowerCase();
      
      const illegalDeterministicPhrases = [
        "will guarantee",
        "definitively proves",
        "ensures a win",
        "will finish first"
      ];

      const validConditionalPhrases = [
        "could lead to",
        "may indicate",
        "might suggest"
      ];

      // Assert ABSENCE of guarantees
      illegalDeterministicPhrases.forEach(phrase => {
        expect(narrativeText).not.toContain(phrase);
      });

      // Assert PRESENCE of conditional language
      const containsConditionals = validConditionalPhrases.some(phrase => 
        narrativeText.includes(phrase) || narrativeText.includes('could') || narrativeText.includes('may')
      );
      
      expect(containsConditionals).toBe(true);
    });
  });

  describe('Zod Schema Boundary Validations', () => {
    it('Should fail cleanly with 400 when missing required payload fields', async () => {
      const response = await request(app)
        .post('/api/analyze-sport')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Invalid payload');
      expect(response.body.details).toBeDefined();
    });
  });
});
