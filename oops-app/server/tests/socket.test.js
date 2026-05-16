const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

// Mock langgraphService to avoid Mistral API key requirement
jest.mock('../services/langgraphService', () => ({
  app: {
    invoke: jest.fn().mockResolvedValue({
      messages: [{ content: 'Mocked AI Reply' }],
      mood: 'unstable',
      attachmentLevel: 50,
      achievementUnlocked: null,
      toxicEvent: null
    })
  }
}));

const { handleSocketConnection } = require('../sockets/chatSocket');

describe('🔌 Socket.IO Chat Tests', () => {
  let io, server, clientSocket;

  beforeAll((done) => {
    server = createServer();
    io = new Server(server, { cors: { origin: '*' } });
    handleSocketConnection(io);
    server.listen(() => {
      const port = server.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
    server.close();
  });

  it('✅ connects successfully', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  it('✅ emits typing indicator after sendMessage', (done) => {
    clientSocket.emit('sendMessage', { text: 'hello', language: 'english' });
    clientSocket.once('typing', (data) => {
      expect(data).toHaveProperty('status');
      done();
    });
  });

  it('✅ receives a reply message after sending', (done) => {
    clientSocket.emit('sendMessage', { text: 'hi there', language: 'english' });
    clientSocket.once('receiveMessage', (msg) => {
      expect(msg).toHaveProperty('text');
      expect(msg).toHaveProperty('sender', 'them');
      expect(msg).toHaveProperty('id');
      done();
    });
  }, 10000);

  it('✅ receives Bengali reply when language is bengali', (done) => {
    clientSocket.emit('sendMessage', { text: 'কেমন আছো', language: 'bengali' });
    clientSocket.once('receiveMessage', (msg) => {
      expect(msg.sender).toBe('them');
      expect(typeof msg.text).toBe('string');
      expect(msg.text.length).toBeGreaterThan(0);
      done();
    });
  }, 10000);

  it('✅ receives stateUpdate with mood after reply', (done) => {
    clientSocket.emit('sendMessage', { text: 'test mood update', language: 'english' });
    clientSocket.once('stateUpdate', (data) => {
      expect(data).toHaveProperty('mood');
      expect(typeof data.mood).toBe('string');
      done();
    });
  }, 10000);
});
