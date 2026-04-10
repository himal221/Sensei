const express = require('express');
const router = express.Router();
const { 
    generateRoadmap, 
    getRoadmap, 
    completeTask, 
    regenerateQuiz,
    getGithubStats
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.get('/github/:username', protect, getGithubStats);
router.put('/complete/:skillId/:taskId', protect, completeTask);
router.get('/quiz/refresh/:skillId/:taskId', protect, regenerateQuiz);

module.exports = router;
