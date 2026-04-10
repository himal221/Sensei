const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const aiService = require('../services/aiService');

// @desc    Generate Roadmap using AI
// @route   POST /api/roadmap/generate
// @access  Private
exports.generateRoadmap = async (req, res) => {
    try {
        const { studentType, githubProfile, academicYear, currentKnowledge, dreamCompany, dreamRole } = req.body;
        const userId = req.user.id;

        // 1. Update User Profile with onboarding data
        await User.findByIdAndUpdate(userId, {
            studentType, githubProfile, academicYear, currentKnowledge, dreamCompany, dreamRole
        });

        // 2. Clear old roadmaps to prevent sync issues
        await Roadmap.deleteMany({ user: userId });

        // 3. Generate structured data using AI
        const userData = { studentType, githubProfile, academicYear, currentKnowledge, dreamCompany, dreamRole };
        const aiData = await aiService.generateRoadmapData(userData);

        // 4. Transform and set status
        const skills = aiData.skills.map((s, idx) => ({
            ...s,
            status: idx === 0 ? 'in-progress' : 'locked',
            tasks: s.tasks.map(t => ({ ...t, completed: false }))
        }));

        const roadmap = await Roadmap.create({
            user: userId,
            title: aiData.title,
            targetCompany: dreamCompany,
            targetRole: dreamRole,
            skills: skills,
            analysis: aiData.analysis
        });

        res.status(201).json({ success: true, roadmap });
    } catch (error) {
        console.error("Roadmap Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get User Roadmap
// @route   GET /api/roadmap
// @access  Private
exports.getRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'No roadmap found' });
        }
        res.json({ success: true, roadmap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete a task
// @route   PUT /api/roadmap/complete/:skillId/:taskId
// @access  Private
exports.completeTask = async (req, res) => {
    try {
        const { skillId, taskId } = req.params;
        const roadmap = await Roadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found' });
        }

        roadmap.skills[skillId].tasks[taskId].completed = true;
        
        // If all tasks in a skill are completed, mark skill as completed
        const allCompleted = roadmap.skills[skillId].tasks.every(t => t.completed);
        if (allCompleted) {
            roadmap.skills[skillId].status = 'completed';
            // Unlock next skill if it exists
            if (roadmap.skills[parseInt(skillId) + 1]) {
                roadmap.skills[parseInt(skillId) + 1].status = 'in-progress';
            }
        }

        await roadmap.save();
        res.json({ success: true, message: 'Task completed!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Regenerate Quiz for a task
// @route   GET /api/roadmap/quiz/refresh/:skillId/:taskId
// @access  Private
exports.regenerateQuiz = async (req, res) => {
    try {
        const { skillId: sId, taskId: tId } = req.params;
        const skillId = Number(sId);
        const taskId = Number(tId);
        const roadmap = await Roadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

        if (!roadmap.skills[skillId] || !roadmap.skills[skillId].tasks[taskId]) {
            return res.status(400).json({ success: false, message: 'Invalid skill or task ID' });
        }

        const task = roadmap.skills[skillId].tasks[taskId];
        const newQuiz = await aiService.generateQuizUpdate(task.title, task.description);

        if (newQuiz && Array.isArray(newQuiz) && newQuiz.length > 0) {
            roadmap.skills[skillId].tasks[taskId].quiz = newQuiz;
            await roadmap.save();
            return res.json({ success: true, quiz: newQuiz });
        } else {
            return res.status(500).json({ success: false, message: 'AI failed to generate valid questions' });
        }
    } catch (error) {
        console.error("Quiz Regeneration Controller Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get GitHub Stats
// @route   GET /api/roadmap/github/:username
// @access  Private
exports.getGithubStats = async (req, res) => {
    try {
        const stats = await aiService.getGithubStats(req.params.username);
        if (!stats) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};