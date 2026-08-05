require('dotenv').config();
const mongoose = require('mongoose');
const { runSeeder } = require('../controllers/seedController');

const seedCLI = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/yoga_db';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Seeding data...');
    await runSeeder();
    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedCLI();
