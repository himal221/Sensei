const axios = require('axios');

exports.generateRoadmapData = async (userData) => {
    const { studentType, githubProfile, academicYear, currentKnowledge, dreamCompany, dreamRole } = userData;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    const prompt = `
        You are an elite Agentic Career AI. 
        CONTEXT: A student named ${studentType} in their ${academicYear} year wants to reach ${dreamCompany} as a ${dreamRole}.
        CURRENT STATUS: ${currentKnowledge}
        GITHUB: ${githubProfile}

        MISSION:
        1. Perform a surgical 'Gap Analysis'. Compare the student's current knowledge (${currentKnowledge}) vs the expert requirements of ${dreamCompany} for a ${dreamRole} role.
        2. Create a personalized, sequential 5-Skill Mastery Path that specifically targets the weaknesses found in analysis.
        3. For each skill, provide 2 missions (tasks). 
        4. For each mission, provide 2-3 specific learning resources (YouTube search links, technical blogs, and documentation).
        5. For each mission, provide a 5-question high-quality MCQ quiz with explanations.

        RULES:
        - The analysis must mention specific technologies the user ALREADY knows vs what they NEED to learn.
        - The skills must be ordered logically for a ${academicYear} student.
        
        Return ONLY valid JSON following this structure:
        {
            "title": "Mastery Path for ${dreamRole} @ ${dreamCompany}",
            "analysis": "Specific personalized gap analysis.",
            "skills": [
                {
                    "title": "Skill Name",
                    "description": "Why this skill is needed for ${dreamCompany}",
                    "icon": "LucideIconName",
                    "tasks": [
                        {
                            "title": "Mission title",
                            "description": "Learning path details",
                            "resources": ["URL1", "URL2"],
                            "quiz": [{ "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." }]
                        }
                    ]
                }
            ]
        }
    `;

    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    for (const modelName of models) {
        let attempts = 0;
        const maxAttempts = 2; // Retry once per model if temporary failure

        while (attempts < maxAttempts) {
            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                    {
                        contents: [{ parts: [{ text: prompt }] }],
                        safetySettings
                    }
                );

                if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
                    attempts++;
                    continue;
                }

                const text = response.data.candidates[0].content.parts[0].text;
                console.log(`SUCCESS: RESPONSE GAINED FROM ${modelName}`);
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error(`No JSON found in ${modelName} response. Attempt ${attempts + 1}`);
                    attempts++;
                    continue;
                }
                return JSON.parse(jsonMatch[0]);
            } catch (error) {
                const status = error.response?.status;
                console.error(`Model ${modelName} failed (Status: ${status}):`, error.response?.data?.error?.message || error.message);
                
                // If Rate Limit (429) or Service Overloaded (503), wait 3s and retry
                if ((status === 429 || status === 503) && attempts < maxAttempts - 1) {
                    console.log(`Waiting 3s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    attempts++;
                } else {
                    break; // Move to next model
                }
            }
        }
    }

    // High quality dynamic fallback if API fails
    const userSkillsList = currentKnowledge ? currentKnowledge.split(',').map(s => s.trim()) : ['General Tech'];
    const focusSkill = userSkillsList[0] || 'Technical Skills';
    
    return {
        title: `Path to ${dreamRole} @ ${dreamCompany}`,
        analysis: `Based on your existing skills in ${currentKnowledge || 'tech'}, here is a targeted roadmap to help you secure a ${dreamRole} role at ${dreamCompany}.`,
        skills: [
            {
                title: `Advanced ${focusSkill}`,
                description: `Building upon your baseline knowledge in ${focusSkill} to meet ${dreamCompany}'s rigorous standards for ${dreamRole}s.`,
                icon: "Cpu",
                tasks: [
                    {
                        title: `Deep Dive into ${focusSkill} Architecture`,
                        description: `Master the complex theoretical aspects of ${focusSkill} that interviewers at ${dreamCompany} test for.`,
                        resources: [
                            `https://www.youtube.com/results?search_query=${encodeURIComponent(focusSkill)}+advanced+tutorial`,
                            `https://dev.to/search?q=${encodeURIComponent(focusSkill)}`
                        ],
                        quiz: [
                            { 
                                question: `Which of the following is a key advanced concept in ${focusSkill}?`, 
                                options: ["Optimization", "Basic Syntax", "Hello World", "Simple Arrays"], 
                                correctAnswer: 0, 
                                explanation: `Optimization is crucial when building scalable systems with ${focusSkill} for ${dreamCompany}.` 
                            }
                        ]
                    }
                ]
            }
        ]
    };
};

exports.getGithubStats = async (username) => {
    try {
        const token = (process.env.GITHUB_TOKEN || "").trim();
        if (token) {
            console.log("GitHub Token detected, applying to request...");
        } else {
            console.warn("No GITHUB_TOKEN found in .env. Rate limits will apply.");
        }
        
        const config = token ? { headers: { Authorization: `token ${token}` } } : {};
        
        const userRes = await axios.get(`https://api.github.com/users/${username}`, config);
        const repoRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, config);
        
        // Calculate basic stats
        const languages = [...new Set(repoRes.data.map(r => r.language).filter(Boolean))].slice(0, 5);
        
        // Consistency check: Update in last 7 days?
        const lastUpdate = repoRes.data.length > 0 ? new Date(repoRes.data[0].updated_at) : null;
        const now = new Date();
        const isConsistent = lastUpdate && (now - lastUpdate) / (1000 * 60 * 60 * 24) <= 7;

        return {
            public_repos: userRes.data.public_repos,
            followers: userRes.data.followers,
            avatar_url: userRes.data.avatar_url,
            languages: languages,
            name: userRes.data.name || username,
            isConsistent: !!isConsistent
        };
    } catch (error) {
        console.error("GitHub API Error:", error.message);
        return null;
    }
};

exports.generateQuizUpdate = async (taskTitle, taskDesc) => {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const prompt = `Act as an expert technical interviewer. Generate 5 advanced, mission-specific MCQs for the task: "${taskTitle}". Task Context: ${taskDesc}. 
    Each question should test deep practical knowledge, not basic definitions. 
    Return as JSON array of objects with: question, options (4 specific choices), correctAnswer (index), explanation. NO MARKDOWN.`;
    
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    for (const modelName of models) {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    safetySettings
                }
            );

            if (!response.data || !response.data.candidates || !response.data.candidates[0]) continue;

            const text = response.data.candidates[0].content.parts[0].text;
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (error) {
            console.error(`Quiz Update Model ${modelName} failed:`, error.response?.data?.error || error.message);
            continue;
        }
    }

    return Array.from({ length: 5 }, (_, i) => ({
        question: `Revision Question ${i + 1} for ${taskTitle}`,
        options: ["Optimized approach", "Initial brute force", "Memory-efficient logic", "Randomized strategy"],
        correctAnswer: 0,
        explanation: `Comprehensive verification of your understanding of ${taskTitle}.`
    }));
};
