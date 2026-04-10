const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: Number, // Index
    explanation: String
});

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    resources: [String], // URLs
    completed: { type: Boolean, default: false },
    quiz: [quizSchema]
});

const skillSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String, // String name for lucide icons
    tasks: [taskSchema],
    status: { type: String, enum: ['locked', 'in-progress', 'completed'], default: 'locked' }
});

const roadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    targetCompany: String,
    targetRole: String,
    skills: [skillSchema],
    analysis: String // AI overview
}, {
    timestamps: true
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
