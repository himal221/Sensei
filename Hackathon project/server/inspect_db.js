const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');
const dotenv = require('dotenv');
dotenv.config();

async function checkRoadmap() {
    await mongoose.connect(process.env.MONGODB_URI);
    const roadmaps = await Roadmap.find();
    console.log(`FOUND ${roadmaps.length} ROADMAPS.`);
    roadmaps.forEach(r => {
        console.log(`User: ${r.user}, Title: ${r.title}, Skills: ${r.skills.length}`);
    });
    process.exit();
}

checkRoadmap();
