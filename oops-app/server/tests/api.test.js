const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Build a minimal express app for testing (no DB needed)
const buildApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Inline routes for isolated testing
  app.get('/api/forecast', (req, res) => {
    const forecasts = [
      "Chance of ghosting: 87%",
      "Emotional unavailability index: EXTREME",
      "Attachment level rising. Danger imminent.",
    ];
    res.json({ forecast: forecasts[Math.floor(Math.random() * forecasts.length)] });
  });

  app.get('/api/ex-message', (req, res) => {
    res.json({ message: "hey... i know it's been a while" });
  });

  app.get('/api/red-flags', (req, res) => {
    res.json({ flags: ["Love bombing", "Breadcrumbing", "Orbiting"] });
  });

  app.post('/api/validate-password', (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    const noE = !/e/i.test(password);
    const hasNickname = /[A-Z][a-z]{2,}/.test(password);
    const hasWeather = /sunny|rain|cloud|snow|storm|wind/i.test(password);
    const valid = noE && hasNickname && hasWeather;
    res.json({ valid, noE, hasNickname, hasWeather });
  });

  return app;
};

describe('🌩️ OOPS API Tests', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  // ── Forecast ────────────────────────────────────────────────
  describe('GET /api/forecast', () => {
    it('returns a forecast string', async () => {
      const res = await request(app).get('/api/forecast');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('forecast');
      expect(typeof res.body.forecast).toBe('string');
    });
  });

  // ── Ex Message ──────────────────────────────────────────────
  describe('GET /api/ex-message', () => {
    it('returns a toxic ex message', async () => {
      const res = await request(app).get('/api/ex-message');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message.length).toBeGreaterThan(0);
    });
  });

  // ── Red Flags ───────────────────────────────────────────────
  describe('GET /api/red-flags', () => {
    it('returns an array of red flags', async () => {
      const res = await request(app).get('/api/red-flags');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('flags');
      expect(Array.isArray(res.body.flags)).toBe(true);
      expect(res.body.flags.length).toBeGreaterThan(0);
    });
  });

  // ── Password Validation ─────────────────────────────────────
  describe('POST /api/validate-password', () => {
    it('rejects request with no password', async () => {
      const res = await request(app).post('/api/validate-password').send({});
      expect(res.status).toBe(400);
    });

    it('fails a weak password', async () => {
      const res = await request(app)
        .post('/api/validate-password')
        .send({ password: 'hello' });
      expect(res.body.valid).toBe(false);
    });

    it('passes a valid cursed password', async () => {
      // No 'e', has capitalized name "John", has weather "sunny"
      const res = await request(app)
        .post('/api/validate-password')
        .send({ password: 'ItsJohnSunny123' });
      expect(res.body.valid).toBe(true);
      expect(res.body.noE).toBe(true);
      expect(res.body.hasNickname).toBe(true);
      expect(res.body.hasWeather).toBe(true);
    });

    it('fails if password contains letter e', async () => {
      const res = await request(app)
        .post('/api/validate-password')
        .send({ password: 'JohnSunnyhere' });
      expect(res.body.noE).toBe(false);
      expect(res.body.valid).toBe(false);
    });
  });
});
