// Global state
let currentUser = null;
let currentAssessment = {
    questions: [],
    currentQuestion: 0,
    answers: []
};

// API base URL
const API_BASE = window.location.origin + '/api';

// Show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Auth functions
async function signup(event) {
    event.preventDefault();
    
    const userData = {
        firstName: document.getElementById('signup-firstname').value,
        lastName: document.getElementById('signup-lastname').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
        university: document.getElementById('signup-university').value,
        studentId: document.getElementById('signup-studentid').value
    };

    try {
        const response = await fetch(API_BASE + '/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            updateUI();
            showSection('dashboard');
        } else {
            document.getElementById('signup-error').textContent = data.error;
        }
    } catch (error) {
        document.getElementById('signup-error').textContent = 'Signup failed. Please try again.';
    }
}

async function login(event) {
    event.preventDefault();
    
    const credentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    try {
        const response = await fetch(API_BASE + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            updateUI();
            showSection('dashboard');
        } else {
            document.getElementById('login-error').textContent = data.error;
        }
    } catch (error) {
        document.getElementById('login-error').textContent = 'Login failed. Please try again.';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateUI();
    showSection('home');
}

// Update UI based on auth state
function updateUI() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('signup-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('dashboard-link').style.display = 'block';
        document.getElementById('user-name').textContent = currentUser.firstName;
        loadMoodHistory();
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('signup-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('dashboard-link').style.display = 'none';
        currentUser = null;
    }
}

// Mood tracking
async function trackMood(mood) {
    const token = localStorage.getItem('token');
    if (!token) {
        showSection('login');
        return;
    }

    try {
        const response = await fetch(API_BASE + '/mood/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ mood })
        });

        if (response.ok) {
            // Visual feedback
            document.querySelectorAll('.mood-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.classList.add('selected');

            loadMoodHistory();
            
            // Show success message
            alert('Mood tracked successfully!');
        } else {
            alert('Failed to track mood');
        }
    } catch (error) {
        console.error('Failed to track mood:', error);
        alert('Failed to track mood. Please try again.');
    }
}

async function loadMoodHistory() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(API_BASE + '/mood/history', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            const data = await response.json();
            const historyDiv = document.getElementById('mood-history');
            
            if (data.entries && data.entries.length > 0) {
                const lastEntry = data.entries[0]; // Most recent entry
                const moodEmoji = getMoodEmoji(lastEntry.mood);
                historyDiv.innerHTML = `
                    <p><strong>Last mood:</strong> ${moodEmoji} ${lastEntry.mood.replace('_', ' ')}</p>
                    <small>${new Date(lastEntry.createdAt).toLocaleDateString()}</small>
                `;
            } else {
                historyDiv.innerHTML = '<p>No mood entries yet. Track your first mood!</p>';
            }
        }
    } catch (error) {
        console.error('Failed to load mood history:', error);
    }
}

function getMoodEmoji(mood) {
    const emojis = {
        'very_sad': '😢',
        'sad': '😔',
        'neutral': '😐',
        'happy': '😊',
        'very_happy': '😄'
    };
    return emojis[mood] || '😐';
}

// Assessment
async function startAssessment() {
    const token = localStorage.getItem('token');
    if (!token) {
        showSection('login');
        return;
    }

    try {
        const response = await fetch(API_BASE + '/assessment/questions');
        if (response.ok) {
            const data = await response.json();
            
            currentAssessment.questions = data.questions;
            currentAssessment.currentQuestion = 0;
            currentAssessment.answers = [];
            
            showQuestion();
            showSection('assessment');
        }
    } catch (error) {
        console.error('Failed to load assessment:', error);
        alert('Failed to load assessment. Please try again.');
    }
}

function showQuestion() {
    const question = currentAssessment.questions[currentAssessment.currentQuestion];
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question">
            <div class="question-text">${question.text}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectAnswer(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update selected answer if exists
    const currentAnswer = currentAssessment.answers[currentAssessment.currentQuestion];
    if (currentAnswer !== undefined) {
        container.querySelectorAll('.option')[currentAnswer.answer]?.classList.add('selected');
    }
    
    // Update progress
    document.getElementById('progress').textContent = 
        `Question ${currentAssessment.currentQuestion + 1} of ${currentAssessment.questions.length}`;
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentAssessment.currentQuestion === 0;
    document.getElementById('next-btn').textContent = 
        currentAssessment.currentQuestion === currentAssessment.questions.length - 1 ? 
        'Finish' : 'Next';
}

function selectAnswer(answerIndex) {
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    // Store answer
    currentAssessment.answers[currentAssessment.currentQuestion] = {
        questionId: currentAssessment.currentQuestion + 1,
        answer: answerIndex
    };
}

function previousQuestion() {
    if (currentAssessment.currentQuestion > 0) {
        currentAssessment.currentQuestion--;
        showQuestion();
    }
}

async function nextQuestion() {
    if (currentAssessment.answers[currentAssessment.currentQuestion] === undefined) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    if (currentAssessment.currentQuestion < currentAssessment.questions.length - 1) {
        currentAssessment.currentQuestion++;
        showQuestion();
    } else {
        await submitAssessment();
    }
}

async function submitAssessment() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(API_BASE + '/assessment/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                answers: currentAssessment.answers
            })
        });

        if (response.ok) {
            const data = await response.json();
            showResults(data.assessment);
        } else {
            alert('Failed to submit assessment');
        }
    } catch (error) {
        console.error('Failed to submit assessment:', error);
        alert('Failed to submit assessment. Please try again.');
    }
}

function showResults(assessment) {
    const resultsDiv = document.getElementById('results-content');
    
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h3>Assessment Complete!</h3>
            <p><strong>Score:</strong> ${assessment.totalScore}</p>
            <p><strong>Severity Level:</strong> ${assessment.severity}</p>
            <div style="margin: 1.5rem 0;">
                <h4>Recommendations:</h4>
                <ul>
                    ${assessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <p style="color: var(--gray); font-size: 0.9rem;">
                Remember: This assessment is for informational purposes only. 
                If you're experiencing severe symptoms, please seek professional help.
            </p>
        </div>
    `;
    
    showSection('results');
}

// Crisis support
async function loadCrisisResources() {
    try {
        const response = await fetch(API_BASE + '/crisis/resources');
        if (response.ok) {
            const data = await response.json();
            
            const contactsDiv = document.getElementById('crisis-contacts');
            contactsDiv.innerHTML = data.resources.map(contact => `
                <div class="contact-item">
                    <div>
                        <div class="contact-name">${contact.name}</div>
                        <div style="color: var(--gray); font-size: 0.9rem;">${contact.description || 'Available 24/7'}</div>
                    </div>
                    <div class="contact-phone">${contact.phone}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load crisis resources:', error);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    loadCrisisResources();
    
    // Show home section by default
    showSection('home');
    
    // Add click handlers for mood options
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.mood-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
});

// Utility function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
