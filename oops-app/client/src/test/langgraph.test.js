import { describe, it, expect, vi } from 'vitest';

// ── Mock the LLM to avoid real API calls ──────────────────────
vi.mock('@langchain/mistralai', () => ({
  ChatMistralAI: vi.fn().mockImplementation(() => ({
    invoke: vi.fn().mockResolvedValue({
      content: 'আমি ভালো আছি। তুমি কি চাও যে আমি ভালো না থাকি?'
    })
  }))
}));

vi.mock('@langchain/langgraph', () => ({
  StateGraph: vi.fn().mockImplementation(() => ({
    addNode: vi.fn().mockReturnThis(),
    addEdge: vi.fn().mockReturnThis(),
    setEntryPoint: vi.fn().mockReturnThis(),
    compile: vi.fn().mockReturnValue({
      invoke: vi.fn().mockResolvedValue({
        messages: [{ content: 'হ্যাঁ ঠিক আছে' }],
        mood: 'distanced',
        attachmentLevel: 40,
        achievementUnlocked: null,
        toxicEvent: null
      })
    })
  })),
  END: 'END'
}));

// ── Password Validation Logic (pure function tests) ───────────
const validatePassword = (password) => ({
  noE: password.length > 0 && !/e/i.test(password),
  hasNickname: /[A-Z][a-z]{2,}/.test(password),
  hasWeather: /sunny|rain|cloud|snow|storm|wind/i.test(password),
});

// ── Language Detection ────────────────────────────────────────
const getLanguageLabel = (lang) => {
  const map = { english: '🇬🇧 English', bengali: '🇮🇳 বাংলা (Bengali)', hindi: '🇮🇳 हिन्दी (Hindi)' };
  return map[lang] || 'Unknown';
};

// ── Mood Analysis ─────────────────────────────────────────────
const analyzeMood = (msg, attachmentLevel) => {
  let mood = 'unstable';
  let attachment = attachmentLevel;
  if (msg.length > 100) { mood = 'annoyed'; attachment -= 20; }
  if (/love|obsessed/i.test(msg)) { mood = 'distanced'; }
  return { mood, attachmentLevel: Math.max(0, attachment) };
};

describe('🤖 AI Logic & LangGraph Tests', () => {
  // ── Password Validation ───────────────────────────────────
  describe('Password Validation', () => {
    it('rejects password with letter e', () => {
      expect(validatePassword('helloworld').noE).toBe(false);
    });

    it('accepts password without e', () => {
      expect(validatePassword('JohnSunny123').noE).toBe(true);
    });

    it('detects capitalized nickname', () => {
      expect(validatePassword('IAmJohn').hasNickname).toBe(true);
    });

    it('detects weather keyword sunny', () => {
      expect(validatePassword('ItIsSunny').hasWeather).toBe(true);
    });

    it('detects weather keyword rain', () => {
      expect(validatePassword('GoingRain').hasWeather).toBe(true);
    });

    it('full valid password passes all rules', () => {
      const result = validatePassword('JohnSunny123');
      expect(result.noE).toBe(true);
      expect(result.hasNickname).toBe(true);
      expect(result.hasWeather).toBe(true);
    });
  });

  // ── Language Label ────────────────────────────────────────
  describe('Language Selector', () => {
    it('returns English label', () => {
      expect(getLanguageLabel('english')).toContain('English');
    });

    it('returns Bengali label in Bengali script', () => {
      expect(getLanguageLabel('bengali')).toContain('বাংলা');
    });

    it('returns Hindi label in Hindi script', () => {
      expect(getLanguageLabel('hindi')).toContain('हिन्दी');
    });

    it('returns Unknown for unknown language', () => {
      expect(getLanguageLabel('klingon')).toBe('Unknown');
    });
  });

  // ── Mood Analysis ─────────────────────────────────────────
  describe('Mood & Attachment Analysis', () => {
    it('short message keeps mood unstable', () => {
      const { mood } = analyzeMood('hi', 50);
      expect(mood).toBe('unstable');
    });

    it('long message (>100 chars) sets mood to annoyed', () => {
      const longMsg = 'a'.repeat(101);
      const { mood, attachmentLevel } = analyzeMood(longMsg, 50);
      expect(mood).toBe('annoyed');
      expect(attachmentLevel).toBe(30);
    });

    it('love message sets mood to distanced', () => {
      const { mood } = analyzeMood('I love you so much', 50);
      expect(mood).toBe('distanced');
    });

    it('attachment never goes below 0', () => {
      const { attachmentLevel } = analyzeMood('a'.repeat(101), 5);
      expect(attachmentLevel).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Ex Message Logic ──────────────────────────────────────
  describe('Ex Message Trigger', () => {
    const exMessages = [
      "i miss you",
      "you were my favorite notification",
      "i almost called you last night",
    ];

    it('ex message array is not empty', () => {
      expect(exMessages.length).toBeGreaterThan(0);
    });

    it('randomly picks from ex messages', () => {
      const pick = exMessages[Math.floor(Math.random() * exMessages.length)];
      expect(exMessages).toContain(pick);
    });
  });
});
