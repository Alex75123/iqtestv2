const state = {
    currentQuestion: 0,
    answers: [],
    timeLeft: 1200, //  20 minutes in seconds
    timer: null,
    questions: [] // Will be populated with question data
};

// Function to shuffle array (for randomizing options)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Question structure example (you'll replace with actual questions)
const questions = [
    {
        question: "Question 1",
        options: shuffleArray(["1a", "1b", "1c", "1d", "1e", "1solution"]),
        correctAnswer: "1solution",
        section: "IQ Test"
    },
    {
        question: "Question 2",
        options: shuffleArray(["2a", "2b", "2c", "2d", "2e", "2solution"]),
        correctAnswer: "2solution",
        section: "IQ Test"
    },
    {
        question: "Question 3",
        options: shuffleArray(["3a", "3b", "3c", "3d", "3e", "3solution"]),
        correctAnswer: "3solution",
        section: "IQ Test"
    },
    {
        question: "Question 4",
        options: shuffleArray(["4a", "4b", "4c", "4d", "4e", "4solution"]),
        correctAnswer: "4solution",
        section: "IQ Test"
    },
    {
        question: "Question 5",
        options: shuffleArray(["5a", "5b", "5c", "5d", "5e", "5solution"]),
        correctAnswer: "5solution",
        section: "IQ Test"
    },
    {
        question: "Question 6",
        options: shuffleArray(["6a", "6b", "6c", "6d", "6e", "6solution"]),
        correctAnswer: "6solution",
        section: "IQ Test"
    },
    {
        question: "Question 7",
        options: shuffleArray(["7a", "7b", "7c", "7d", "7e", "7solution"]),
        correctAnswer: "7solution",
        section: "IQ Test"
    },
    {
        question: "Question 8",
        options: shuffleArray(["8a", "8b", "8c", "8d", "8e", "8solution"]),
        correctAnswer: "8solution",
        section: "IQ Test"
    },
    {
        question: "Question 9",
        options: shuffleArray(["9a", "9b", "9c", "9d", "9e", "9solution"]),
        correctAnswer: "9solution",
        section: "IQ Test"
    },
    {
        question: "Question 10",
        options: shuffleArray(["10a", "10b", "10c", "10d", "10e", "10solution"]),
        correctAnswer: "10solution",
        section: "IQ Test"
    },
    {
        question: "Question 11",
        options: shuffleArray(["11a", "11b", "11c", "11d", "11e", "11solution"]),
        correctAnswer: "11solution",
        section: "IQ Test"
    },
    {
        question: "Question 12",
        options: shuffleArray(["12a", "12b", "12c", "12d", "12e", "12solution"]),
        correctAnswer: "12solution",
        section: "IQ Test"
    },
    {
        question: "Question 13",
        options: shuffleArray(["13a", "13b", "13c", "13d", "13e", "13solution"]),
        correctAnswer: "13solution",
        section: "IQ Test"
    },
    {
        question: "Question 14",
        options: shuffleArray(["14a", "14b", "14c", "14d", "14e", "14solution"]),
        correctAnswer: "14solution",
        section: "IQ Test"
    },
    {
        question: "Question 15",
        options: shuffleArray(["15a", "15b", "15c", "15d", "15e", "15solution"]),
        correctAnswer: "15solution",
        section: "IQ Test"
    },
    {
        question: "Question 16",
        options: shuffleArray(["16a", "16b", "16c", "16d", "16e", "16solution"]),
        correctAnswer: "16solution",
        section: "IQ Test"
    },
    {
        question: "Question 17",
        options: shuffleArray(["17a", "17b", "17c", "17d", "17e", "17solution"]),
        correctAnswer: "17solution",
        section: "IQ Test"
    },
    {
        question: "Question 18",
        options: shuffleArray(["18a", "18b", "18c", "18d", "18e", "18solution"]),
        correctAnswer: "18solution",
        section: "IQ Test"
    },
    {
        question: "Question 19",
        options: shuffleArray(["19a", "19b", "19c", "19d", "19e", "19solution"]),
        correctAnswer: "19solution",
        section: "IQ Test"
    },
    {
        question: "Question 20",
        options: shuffleArray(["20a", "20b", "20c", "20d", "20e", "20solution"]),
        correctAnswer: "20solution",
        section: "IQ Test"
    }
];

function startTest() {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('test-screen').classList.remove('hidden');
    startTimer();
    loadQuestion(0);
    initializeNavigation();
}

function startTimer() {
    state.timer = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();
        
        if (state.timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('progress').textContent = `Question ${index + 1}/${questions.length}`;
    
    const questionContainer = document.getElementById('question-container');
    
    // Special handling for question 18
    if (index === 17) { // zero-based index for question 18
        questionContainer.innerHTML = `
            <h3>${question.section}</h3>
            <img id="question-image" src="iq questions/${index + 1}.jpg" alt="IQ Test Question ${index + 1}">
            <div class="number-input-container">
                <input type="number" 
                    id="number-answer" 
                    placeholder="Enter your answer"
                    class="number-input"
                    value="${state.answers[17] || ''}"
                    onchange="handleNumberInput(this.value)">
            </div>
        `;
    } else {
        // Regular question display
    questionContainer.innerHTML = `
        <h3>${question.section}</h3>
            <img id="question-image" src="iq questions/${index + 1}.jpg" alt="IQ Test Question ${index + 1}">
        <div id="options-container">
            ${question.options.map((option, i) => `
                <div class="option ${state.answers[index] === i ? 'selected' : ''}" onclick="selectOption(${i})">
                        <img src="iq answers/${option}.jpg" alt="Option ${i + 1}">
                </div>
            `).join('')}
        </div>
    `;
    }
}

function selectOption(optionIndex) {
    const currentQuestion = questions[state.currentQuestion];
    const selectedOption = currentQuestion.options[optionIndex];
    state.answers[state.currentQuestion] = optionIndex;
    
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    // Add selection to clicked option
    document.querySelectorAll('.option')[optionIndex].classList.add('selected');
    
    updateNavigationStatus();
    
    // Automatically move to next question after a short delay
    setTimeout(() => {
        if (state.currentQuestion < questions.length - 1) {
            state.currentQuestion++;
            loadQuestion(state.currentQuestion);
            updateNavigationStatus();
        } else {
            // Show submit button when on last question
            const submitButton = document.getElementById('submit-test');
            submitButton.classList.remove('hidden');
            submitButton.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
}

function endTest() {
    clearInterval(state.timer);
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('payment-screen').classList.remove('hidden');
    
    // Scroll to top of page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add this function to show loading screen
function showLoading() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loader"></div>
    `;
    document.body.appendChild(loadingScreen);
}

// Add this function to hide loading screen
function hideLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}
function calculateWeightedScore() {
    let weightedScore = 0;
    state.answers.forEach((answerIndex, questionIndex) => {
        // Special handling for question 18
        if (questionIndex === 17) {  // zero-based index for question 18
            if (answerIndex === '1112') {  // Check for exact numeric answer
                const questionWeight = 1 + (questionIndex * 0.1);
                weightedScore += questionWeight;
            }
        } else {
            const question = questions[questionIndex];
            const selectedOption = question.options[answerIndex];
            if (selectedOption === question.correctAnswer) {
                const questionWeight = 1 + (questionIndex * 0.1);
                weightedScore += questionWeight;
            }
        }
    });
    return weightedScore;
}

function calculateIQ() {
    const weightedScore = calculateWeightedScore();
    
    // Base IQ calculation using weighted score
    const baseIQ = 85;  // Minimum IQ score
    const maxIQ = 145;  // Maximum IQ score
    const maxWeightedScore = 39; // Max possible weighted score for 20 questions
    
    // Calculate IQ proportionally between 85 and 145
    const iqRange = maxIQ - baseIQ;
    const scorePercentage = weightedScore / maxWeightedScore;
    const iqGain = scorePercentage * iqRange;
    
    return Math.round(baseIQ + iqGain);
}

function showResults() {
    const correctAnswers = state.answers.filter((answerIndex, questionIndex) => {
        // Special handling for question 18
        if (questionIndex === 17) {
            return answerIndex === '1112';
        }
        // Normal handling for other questions
        const question = questions[questionIndex];
        const selectedOption = question.options[answerIndex];
        return selectedOption === question.correctAnswer;
    }).length;

    const weightedScore = calculateWeightedScore();

    const results = {
        iqScore: calculateIQ(),
        totalCorrect: correctAnswers,
        weightedScore: weightedScore
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    window.location.href = 'results.html';
}

function getPerformanceLevel(answers) {
    const correctCount = answers.filter((answer, index) => 
        answer === questions[index].correctAnswer
    ).length;
    
    const totalQuestions = answers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
}

function initializeNavigation() {
    const navigationContainer = document.querySelector('.question-navigation');
    navigationContainer.innerHTML = questions.map((_, index) => `
        <div class="question-number" onclick="navigateToQuestion(${index})">
            ${index + 1}
        </div>
    `).join('');
    updateNavigationStatus();
}

function updateNavigationStatus() {
    const navigationButtons = document.querySelectorAll('.question-number');
    navigationButtons.forEach((button, index) => {
        button.classList.remove('current', 'answered');
        if (index === state.currentQuestion) {
            button.classList.add('current');
        } else if (state.answers[index] !== undefined) {
            button.classList.add('answered');
        }
    });
}

function navigateToQuestion(index) {
    state.currentQuestion = index;
    loadQuestion(index);
    updateNavigationStatus();
}

// Update the submitTest function
function submitTest() {
    if (confirm('Are you sure you want to submit your test? You cannot change your answers after submission.')) {
        endTest();
    }
}

// Add this function back to handle the purchase redirect
function handlePurchaseClick() {
    // Store the current page URL to return to after payment
    localStorage.setItem('returnToResults', 'true');
    
    // Redirect to Stripe payment page
    window.location.href = 'https://buy.stripe.com/4gwdUi12J9D6eqc9AB';
}

// Update the number input handler to not auto-advance
function handleNumberInput(value) {
    state.answers[17] = value; // Store the numerical answer
    updateNavigationStatus();
}

// Keep the rest of your DOMContentLoaded event listener as is
document.addEventListener('DOMContentLoaded', () => {
    // Existing start test button listener
    const startButton = document.getElementById('start-test');
    if (startButton) {
        startButton.addEventListener('click', startTest);
    }

    // Submit test button listener
    const submitButton = document.getElementById('submit-test');
    if (submitButton) {
        submitButton.addEventListener('click', submitTest);
    }

    // Check if returning from payment
    if (localStorage.getItem('returnToResults') === 'true') {
        localStorage.removeItem('returnToResults');
        showResults();
    }

    // New top start test button listener
    const topStartTestButton = document.getElementById('top-start-test');
    if (topStartTestButton) {
        topStartTestButton.addEventListener('click', function() {
            startTest();
        });
    }
}); 