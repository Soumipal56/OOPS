const { app: graphApp } = require('../services/langgraphService');
const { HumanMessage } = require('@langchain/core/messages');

// In-memory session store (Replace with Supabase/MongoDB JSONB later)
const chatSessions = {};

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Initialize session state
    chatSessions[socket.id] = {
      messages: [],
      mood: "unstable",
      attachmentLevel: 50,
      language: "english", // Could be dynamic based on profile selected
      jealousyLevel: 50,
      lastMessageTime: null
    };

    socket.on('sendMessage', async (data) => {
      const session = chatSessions[socket.id];
      
      const now = Date.now();
      session.lastMessageTime = now;

      const userMessage = { content: data.text, sender: 'me', id: Date.now() };
      session.messages.push(userMessage);

      // Update language if client sent one
      if (data.language) session.language = data.language;

      // Prepare LangGraph input
      const inputs = {
        messages: [new HumanMessage(data.text)],
        mood: session.mood,
        attachmentLevel: session.attachmentLevel,
        language: session.language
      };



      try {
        // Simulate realistic delay for AI processing
        const typingMessages = [
          "asking friends what to say",
          "chilling with ex",
          "i should not date her",
          "pretending not to care",
          "typing..."
        ];
        const randomTypingMsg = typingMessages[Math.floor(Math.random() * typingMessages.length)];
        socket.emit('typing', { status: randomTypingMsg });

        let aiReplyText = null;

        try {
          const result = await graphApp.invoke(inputs);

          // Update session state
          session.mood = result.mood || session.mood;
          session.attachmentLevel = result.attachmentLevel || session.attachmentLevel;

          // Check achievements
          if (result.achievementUnlocked) {
            socket.emit('achievement', { name: result.achievementUnlocked });
          }

          // Check toxic events
          if (result.toxicEvent) {
            socket.emit('toxic_event', { text: result.toxicEvent });
          }

          // Extract AI reply
          const lastMsg = result.messages[result.messages.length - 1];
          aiReplyText = lastMsg?.content || null;
        } catch (graphErr) {
          console.error("LangGraph invoke failed:", graphErr.message);
        }

        // Guaranteed fallback if LangGraph returned nothing
        if (!aiReplyText) {
          const fallbacks = {
            english: ["k", "lol", "sure whatever", "i saw this and panicked", "my social battery died", "ok and?", "Read at 2:34 AM", "i was gonna reply but then anxiety happened"],
            hindi: ["हाँ ठीक है", "मुझे अभी कुछ नहीं बोलना", "पढ़ लिया 2:34 बजे", "k", "मेरा mood नहीं है"],
            bengali: ["হ্যাঁ ঠিক আছে", "পড়েছি রাত ২:৩৪ তে", "আমার এখন কিছু বলতে ইচ্ছা করছে না", "k", "আমার mood নেই"]
          };
          const pool = fallbacks[session.language] || fallbacks.english;
          aiReplyText = pool[Math.floor(Math.random() * pool.length)];
        }

        // Simulate typing delay based on message length
        const delay = Math.min(Math.max(aiReplyText.length * 40, 1500), 5000);

        setTimeout(() => {
          socket.emit('typing', { status: false });
          const aiMessage = { id: Date.now(), text: aiReplyText, sender: 'them', time: 'Just now' };
          session.messages.push(aiMessage);
          socket.emit('receiveMessage', aiMessage);
          socket.emit('stateUpdate', { mood: session.mood, attachmentLevel: session.attachmentLevel });
        }, delay);

      } catch (error) {
        console.error("Socket handler error:", error);
        socket.emit('typing', { status: false });
        // Last resort reply
        socket.emit('receiveMessage', { id: Date.now(), text: "k", sender: 'them', time: 'Just now' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      delete chatSessions[socket.id];
    });
  });
};

module.exports = {
  handleSocketConnection
};
