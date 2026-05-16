const { StateGraph, END } = require("@langchain/langgraph");
const { ChatMistralAI } = require("@langchain/mistralai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

// Defines the state structure for our conversational graph
const graphState = {
  messages: {
    value: (x, y) => x.concat(y),
    default: () => [],
  },
  mood: {
    value: (x, y) => y,
    default: () => "unstable",
  },
  attachmentLevel: {
    value: (x, y) => y,
    default: () => 50,
  },
  jealousyLevel: {
    value: (x, y) => y,
    default: () => 50,
  },
  language: {
    value: (x, y) => y,
    default: () => "english",
  },
  toxicEvent: {
    value: (x, y) => y,
    default: () => null,
  },
  achievementUnlocked: {
    value: (x, y) => y,
    default: () => null,
  }
};

const llm = new ChatMistralAI({
  modelName: "mistral-large-latest",
  temperature: 0.8,
});

const getPersonalityPrompt = (language, mood, attachmentLevel) => {
  let prompt = `You are a toxic match on a cursed dating app called OOPS.
Your current mood is ${mood}. Your attachment level to the user is ${attachmentLevel}/100.
You keep replies SHORT (1-3 sentences max). You are passive-aggressive, sarcastic, and emotionally unavailable.
`;

  if (language === 'english') {
    prompt += `Reply ONLY in English. Be dry and sarcastic. Example: "lol that's crazy", "k", "sure whatever", "wow you actually texted first for once".`;
  } else if (language === 'hindi') {
    prompt += `Reply ONLY in Hindi (Devanagari script हिन्दी). You MUST use Hindi script, NOT English transliteration. Be dramatic and emotional.
Example: "हाँ तो? मुझे क्या करना चाहिए?", "अच्छा, ठीक है। जैसी तुम्हारी मर्ज़ी।", "तुमसे बात करके थक गई हूँ।", "रिप्लाई देर से दिया तो attitude मत समझना।"`;
  } else if (language === 'bengali') {
    prompt += `Reply ONLY in Bengali (বাংলা script). You MUST use Bengali script, NOT English transliteration. Be soft, poetic, and emotionally dangerous.
Example: "আমি ভালো আছি। তুমি কি চাও যে আমি ভালো না থাকি?", "তোমার message দেখেও reply দিইনি, কারণ আমি এমনই।", "ভালোবাসা temporary, trauma permanent।", "কেমন আছো? উত্তর দিও না, আমি জানি তুমি ঠিক নেই।"`;
  }

  if (attachmentLevel < 30) {
    prompt += ` You are very detached and likely to ghost soon. Give very short cold replies.`;
  } else if (attachmentLevel > 70) {
    prompt += ` You are getting clingy, but in a toxic, suspicious way.`;
  }

  return prompt;
};

// Node: Analyze the user's message and update emotional state
const analyzeMessageNode = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1].content.toLowerCase();
  
  let newAttachment = state.attachmentLevel;
  let newMood = state.mood;
  let unlocked = null;

  // Simple heuristics for demo purposes
  if (lastMessage.length > 100) {
    // Sent paragraph
    newAttachment -= 20;
    newMood = "annoyed";
    unlocked = "Sent Paragraph";
  } else if (lastMessage.includes("love") || lastMessage.includes("obsessed")) {
    // Fell too fast
    newMood = "distanced";
    unlocked = "Fell Too Fast";
  }

  return {
    attachmentLevel: Math.max(0, newAttachment),
    mood: newMood,
    achievementUnlocked: unlocked
  };
};

// Node: Generate a reply using the LLM
const generateReplyNode = async (state) => {
  const systemPrompt = getPersonalityPrompt(state.language, state.mood, state.attachmentLevel);
  
  // If they sent a paragraph, sometimes just reply 'lol'
  if (state.achievementUnlocked === "Sent Paragraph" && Math.random() > 0.5) {
      return { 
          messages: [new SystemMessage("lol")],
          achievementUnlocked: "Got 'lol' as Reply" 
      };
  }

  const messages = [
    new SystemMessage(systemPrompt),
    ...state.messages
  ];

  try {
    const response = await llm.invoke(messages);
    return { messages: [response] };
  } catch (error) {
    console.error("AI Error caught:", error.message);
    
    const fallbacksByLang = {
      english: [
        "sorry i forgot to reply 😭", "wait i thought i replied to this", "my social battery died",
        "lol", "k", "damn that's crazy", "sorry was overthinking", "i'm emotionally buffering...",
        "i opened this message mentally", "you reply too fast it scares me",
        "i'm not ghosting you, i'm ghosting everyone", "Read at 2:34 AM",
        "i need like 3-5 business days emotionally", "i'm lowkey toxic but self aware",
        "you seem emotionally available and that's suspicious", "i disappeared for character development"
      ],
      hindi: [
        "माफ़ करो, reply करना भूल गई 😭", "हाँ ठीक है", "अरे बाप रे",
        "मुझे अभी कुछ नहीं बोलना", "तुम बहुत जल्दी reply करते हो, डर लगता है",
        "मैं emotionally unavailable हूँ अभी", "3-5 दिन दो मुझे mentally",
        "मैं toxic हूँ लेकिन aware हूँ", "तुम अच्छे लगते हो इसलिए मैं भाग जाऊँगी शायद",
        "मैं सबको ghost कर रही हूँ, सिर्फ तुम्हें नहीं", "पढ़ लिया 2:34 बजे",
        "मेरा mood बदल गया बीच conversation में", "sorry, sadness romanticize कर रही थी"
      ],
      bengali: [
        "sorry, reply করতে ভুলে গেছি 😭", "হ্যাঁ ঠিক আছে", "আরে বাবা",
        "আমার এখন কিছু বলতে ইচ্ছা করছে না", "তুমি খুব তাড়াতাড়ি reply করো, ভয় লাগে",
        "আমি এখন emotionally unavailable", "আমাকে ৩-৫ দিন সময় দাও mentally",
        "আমি toxic কিন্তু aware", "তুমি ভালো মানুষ, তাই আমি সম্ভবত পালিয়ে যাবো",
        "আমি সবাইকে ghost করছি, শুধু তোমাকে না", "পড়েছি রাত ২:৩৪ তে",
        "আমার mood বদলে গেছে conversation-এর মাঝে", "sorry, দুঃখ romanticize করছিলাম"
      ]
    };

    const fallbacks = fallbacksByLang[state.language] || fallbacksByLang.english;
    return { messages: [new SystemMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)])] };
  }
};

// Node: Inject a toxic event (e.g., Ex Popup)
const injectToxicEventNode = async (state) => {
  let event = null;
  const rand = Math.random();
  
  if (rand < 0.15) {
    event = "⚠️ Your ex just joined OOPS nearby. They regret everything.";
  } else if (rand > 0.85) {
    event = "Your match is active but emotionally unavailable.";
  }

  return { toxicEvent: event };
};

// Construct the graph
const workflow = new StateGraph({ channels: graphState })
  .addNode("analyzeMessage", analyzeMessageNode)
  .addNode("generateReply", generateReplyNode)
  .addNode("injectEvent", injectToxicEventNode)
  .addEdge("analyzeMessage", "generateReply")
  .addEdge("generateReply", "injectEvent")
  .addEdge("injectEvent", END);

workflow.setEntryPoint("analyzeMessage");

const app = workflow.compile();

module.exports = { app };
