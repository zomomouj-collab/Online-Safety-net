const quizData = [
    {
        question: "A stranger on Discord asks which school you go to for a 'survey'. What do you do?",
        a: "Tell them the name but not the address.",
        b: "Block them and report the interaction.",
        c: "Ask them which school they go to first.",
        correct: "b"
    },
    {
        question: "You get a DM saying you won a $500 Amazon Gift Card. You just need to click a link. This is likely:",
        a: "A lucky day!",
        b: "A phishing scam to steal your login info.",
        c: "A marketing promotion.",
        correct: "b"
    },
    {
        question: "On social media, someone you don't know asks for your phone number. You should:",
        a: "Give it to them if they seem nice.",
        b: "Never share it and block the person.",
        c: "Share it but tell them not to call.",
        correct: "b"
    },
    {
        question: "What should you do if you receive a suspicious email with an attachment?",
        a: "Open it to see what it is.",
        b: "Delete it without opening.",
        c: "Forward it to friends.",
        correct: "b"
    },
    {
        question: "When posting on social media, it's best to:",
        a: "Share everything about your day.",
        b: "Think before posting and keep personal info private.",
        c: "Tag everyone you know.",
        correct: "b"
    },
    {
        question: "What is a strong password?",
        a: "Your pet's name followed by '123'.",
        b: "A mix of letters, numbers, and symbols that's unique.",
        c: "The same password for all accounts.",
        correct: "b"
    },
    {
        question: "If someone asks for your location on social media, you should:",
        a: "Share your exact address if they're a friend.",
        b: "Never share your location with strangers.",
        c: "Post it publicly so friends can find you.",
        correct: "b"
    },
    {
        question: "Before clicking on a link in an email, you should:",
        a: "Click it immediately if it looks interesting.",
        b: "Hover over it to check the real URL.",
        c: "Ignore the email entirely.",
        correct: "b"
    },
    {
        question: "Two-factor authentication (2FA) is:",
        a: "A way to log in twice.",
        b: "Only for banking apps.",
        c:  "An extra security step using your phone or app.",
        correct: "c"
    },
    {
        question: "If you see someone being bullied online, you should:",
        a: "Report it to the platform and tell a trusted adult.",
        b: "Join in to fit in.",
        c: "Ignore it because it's not your problem.",
        correct: "a"
    }
];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let currentQuiz = 0;
let score = 0;

// sound helper using Web Audio API (no external files needed)
function playTone(freq, duration, type='sine') {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = type;
    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.02);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration + 0.02);
}

function playCorrect() {
    playTone(880, 0.2, 'triangle');
    setTimeout(() => playTone(1040, 0.12, 'triangle'), 120);
}

function playWrong() {
    playTone(220, 0.25, 'sawtooth');
}

if (questionEl) {
    console.log('Quiz elements found, loading quiz...');
    loadQuiz();
} else {
    console.log('Quiz elements not found');
}

function loadQuiz() {
    console.log('Loading quiz question:', currentQuiz);
    const currentData = quizData[currentQuiz];
    
    // Update progress
    const progress = ((currentQuiz + 1) / quizData.length) * 100;
    progressBar.style.setProperty('--progress-width', `${progress}%`);
    progressText.textContent = `Question ${currentQuiz + 1} of ${quizData.length}`;
    
    // Animate question
    questionEl.style.animation = 'none';
    setTimeout(() => {
        questionEl.innerText = currentData.question;
        questionEl.style.animation = 'fadeInQuestion 0.8s ease-out';
    }, 10);
    
    // Clear previous options and add new ones with animation
    optionsEl.innerHTML = `
        <button class="option-btn" onclick="selectAnswer('a')">${currentData.a}</button>
        <button class="option-btn" onclick="selectAnswer('b')">${currentData.b}</button>
        <button class="option-btn" onclick="selectAnswer('c')">${currentData.c}</button>
    `;
}

function nextQuestion() {
    currentQuiz++;
    nextBtn.style.display = 'none';
    if (currentQuiz < quizData.length) {
        loadQuiz();
    } else {
        showResults();
    }
}

// Add event listener for next button
if (nextBtn) {
    nextBtn.addEventListener('click', nextQuestion);
}

function selectAnswer(ans) {
    const buttons = document.querySelectorAll('.option-btn');
    const correctAnswer = quizData[currentQuiz].correct;
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show feedback
    buttons.forEach((btn, index) => {
        const optionLetter = ['a', 'b', 'c'][index];
        if (optionLetter === correctAnswer) {
            btn.classList.add('correct');
        } else if (optionLetter === ans && ans !== correctAnswer) {
            btn.classList.add('wrong');
        }
    });
    
    if (ans === correctAnswer) {
        score++;
        celebrate();
        playCorrect();
    } else {
        playWrong();
    }
    
    // Show next button after a delay
    setTimeout(() => {
        nextBtn.style.display = 'inline-block';
    }, 1500);
}

function celebrate() {
    // Create multiple confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = ['#ff6b35', '#28a745', '#007bff', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 5)];
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
    
    // Add a success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = '🎉 Correct! 🎉';
    successMsg.style.position = 'fixed';
    successMsg.style.top = '30%';
    successMsg.style.left = '50%';
    successMsg.style.transform = 'translate(-50%, -50%)';
    successMsg.style.fontSize = '3rem';
    successMsg.style.zIndex = '1000';
    successMsg.style.animation = 'bounce 1s ease-in-out';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        if (successMsg.parentNode) {
            successMsg.parentNode.removeChild(successMsg);
        }
    }, 1000);
}

function showResults() {
    // Fade out quiz container
    quizContainer.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.style.animation = 'fadeIn 1s ease-out';
        
        let message = '';
        if (score === quizData.length) {
            message = `Perfect! You got all ${score} questions right! 🏆`;
        } else if (score >= quizData.length * 0.8) {
            message = `Great job! You scored ${score} out of ${quizData.length}! 🌟`;
        } else if (score >= quizData.length * 0.6) {
            message = `Good work! You scored ${score} out of ${quizData.length}. Keep learning! 📚`;
        } else {
            message = `You scored ${score} out of ${quizData.length}. Review the topics and try again! 💪`;
        }
        
        scoreText.innerText = message;
        scoreText.style.animation = 'slideIn 0.8s ease-out 0.5s both';
    }, 500);
}