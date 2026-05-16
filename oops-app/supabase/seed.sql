-- OOPS: The Cursed Dating App - Seed Data

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER,
    bio TEXT,
    red_flags TEXT[],
    img_url TEXT,
    attachment_style VARCHAR(50) DEFAULT 'avoidant',
    texting_habit VARCHAR(50) DEFAULT 'dry',
    ghosting_chance FLOAT DEFAULT 0.5,
    love_bomb_chance FLOAT DEFAULT 0.2,
    jealousy_level FLOAT DEFAULT 0.5,
    preferred_language VARCHAR(50) DEFAULT 'english',
    mood VARCHAR(50) DEFAULT 'unstable',
    last_active TIMESTAMP DEFAULT NOW() - INTERVAL '3 years'
);

INSERT INTO profiles (name, age, bio, red_flags, img_url) VALUES
('Chad', 24, 'Crypto bro. I only speak in 3-letter acronyms. HODL my heart.', ARRAY['No wallet', 'Crypto', 'Loud'], 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chad'),
('Stacy', 22, 'Looking for my 5th husband. The first 4 were "unlucky".', ARRAY['Missing people', 'Sharp objects'], 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy'),
('Gary', 38, 'Expert at World of Warcraft and failing job interviews.', ARRAY['No shower', 'Basement dweller'], 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary');

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    message TEXT,
    sender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO chat_messages (profile_id, message, sender) VALUES
(1, 'I''ll reply when Mercury is in retrograde.', 'them');

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    icon VARCHAR(50)
);

INSERT INTO achievements (name, description, icon) VALUES
('Double Texted', 'You sent two messages in a row. How desperate.', '📱'),
('Ignored While Online', 'They were online but chose not to reply to you.', '👁️'),
('Sent Paragraph', 'You poured your heart out. They replied "k".', '📝'),
('Fell Too Fast', 'You got attached after 3 messages.', '💔'),
('Got "lol" as Reply', 'The ultimate conversation killer.', '🤡');

CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER DEFAULT 1,
    achievement_id INTEGER REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    langgraph_state JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

