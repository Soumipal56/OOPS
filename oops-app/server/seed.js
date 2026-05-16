const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');

dotenv.config();

const profiles = [
  // Girl profiles (shown to boys)
  { name: "Stacy", age: 22, gender: "girl", bio: "My last 4 boyfriends are still 'missing'. I love true crime and sharp objects.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy", redFlags: ["Honest", "Human"], toxicTraits: ["Love bomber", "Chronic unfollower"] },
  { name: "Becky", age: 24, gender: "girl", bio: "I literally cannot even. Looking for someone to fund my iced coffee addiction.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Becky", redFlags: ["Has opinions", "Breathes"], toxicTraits: ["Passive aggressive", "Story poster"] },
  { name: "Karen", age: 31, gender: "girl", bio: "I will ask to speak to your manager. Live, Laugh, Lawsuit.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karen", redFlags: ["Assertive", "Alive"], toxicTraits: ["Complaint specialist", "Review bomber"] },

  // Boy profiles (shown to girls)
  { name: "Chad", age: 24, gender: "boy", bio: "I 'forget' my wallet on every first date. Looking for someone to bankroll my crypto habit.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chad", redFlags: ["Honest", "Human"], toxicTraits: ["Wallet forgetter", "Crypto bro"] },
  { name: "Gary", age: 38, gender: "boy", bio: "Living in my mom's basement. I haven't showered since the 2016 election. No drama pls.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary", redFlags: ["Nostalgic", "Existing"], toxicTraits: ["Basement dweller", "Anti-shower"] },
  { name: "Brad", age: 27, gender: "boy", bio: "Just looking for a gym bro who can occasionally cuddle. Not gay though.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brad", redFlags: ["Confused", "Fit"], toxicTraits: ["Mirror selfie addict", "Protein shake personality"] }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/oops-app');
    console.log('Connected to MongoDB for seeding...');

    await Profile.deleteMany({});
    console.log('Cleared existing profiles.');

    await Profile.insertMany(profiles);
    console.log(`Seeded ${profiles.length} profiles successfully!`);

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
