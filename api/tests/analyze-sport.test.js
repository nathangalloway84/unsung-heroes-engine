const request = require('supertest');
const app = require('../index');

// Explicitly Mock Unified SDK boundaries
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: "{\"archetype\": \"THE LEVERAGED SURVIVOR\", \"hiddenGrind\": \"Data indicates this could lead to generalized success without strict guarantees.\", \"telemetryData\": [{\"name\": \"Media Visibility Index\", \"value\": 14}, {\"name\": \"Travel Strain Matrix\", \"value\": 92}]}"
          })
        }
      };
    })
  };
});

describe('POST /api/analyze-sport [VERTEX AI PIPELINE]', () => {
  beforeEach(() => {
    // Reset network fetch simulator and Env context
    global.fetch = jest.fn();
    process.env.GCP_PROJECT_ID = 'mock_project';
    process.env.VERTEX_LOCATION = 'global';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Upstream Scraper Degradation & Enum Binding', () => {
    it('Should return 500 cleanly if the target Team USA URL 404s', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 404 });
        
        const response = await request(app)
            .post('/api/analyze-sport')
            .send({ sport: 'goalball' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Upstream Team USA feed unavailable or blocking connections.');
    });

    it('Should block invalid unauthorized sport enums blocking injection', async () => {
        const response = await request(app)
            .post('/api/analyze-sport')
            .send({ sport: 'basketball' });

        expect(response.status).toBe(400);
        expect(response.body.details).toBeDefined();
    });
  });

  describe('NIL Compliance & Pipeline Routing', () => {
    it('Should correctly scrape up to 2000 characters per URL gracefully evaluating concurrent auxiliary feeds natively inside Gemini payload injection', async () => {
        global.fetch = jest.fn()
          .mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValue(`<html><body><p>Mock Team USA Wrestling content highlighting the hidden grind of regional matches.</p></body></html>`)
          })
          .mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValue(`<html><body><p>Demographic mapping trends identifying average hometown relocations.</p></body></html>`)
          })
          .mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValue(`<html><body><p>Explicit donor-funded financial pipeline requirements and limitations.</p></body></html>`)
          });

        const response = await request(app)
            .post('/api/analyze-sport')
            .send({ sport: 'wrestling' });
            
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.archetype).toBe("THE LEVERAGED SURVIVOR");
        expect(response.body.data.telemetryData).toBeDefined();
        expect(response.body.data.telemetryData[0].name).toBe("Media Visibility Index");
        // Verify we pinged the identical valid URL footprint sequentially hitting 3 explicit topologies natively
        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(global.fetch).toHaveBeenNthCalledWith(1, 'https://www.teamusa.com/news/wrestling');
        expect(global.fetch).toHaveBeenNthCalledWith(2, 'https://www.teamusa.com/athletes');
        expect(global.fetch).toHaveBeenNthCalledWith(3, 'https://www.teamusa.com/about');
    });
  });
});
