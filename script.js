const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key

const state = {
    currentQuestion: 0,
    answers: [],
    timeLeft: 1800, // 30 minutes in seconds
    timer: null,
    questions: [] // Will be populated with question data
};

// Sample question data structure (you'll need to create 30 similar questions)
const questions = [
    // Section 1: Number Series (15 questions)
    {
        question: "Which number logically follows this series? 7 9 5 11, 4 15 12 7, 13 8 11 ?",
        options: ["8", "10", "11", "13"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "2, 5, 8, 11, ?",
        options: ["8", "12", "14", "16"],
        correctAnswer: 2,
        section: "Number Series"
    },
    {
        question: "121, 144, 169, 196, ?",
        options: ["225", "230", "275", "221"],
        correctAnswer: 0,
        section: "Number Series"
    },
    {
        question: "2, 3, 5, 9, 17, 33, 65, ?",
        options: ["104", "129", "97", "135"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "2, 8, 26, 62, 122, 212, ?",
        options: ["338", "339", "340", "341"],
        correctAnswer: 0,
        section: "Number Series"
    },
    {
        question: "13, 17, 19, 23, 29, ?",
        options: ["30", "31", "33", "34"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "2, 2, 4, 12, 48, 240, ?",
        options: ["347", "567", "1009", "1440"],
        correctAnswer: 3,
        section: "Number Series"
    },
    {
        question: "13 17 23 29 31 37 ?",
        options: ["39", "41", "49", "55"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "5, 6, 9, 14, 21, ?",
        options: ["None of the above", "30", "31", "36"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "1, 3, 9, 27, 81, ?",
        options: ["216", "243", "250", "none of the above"],
        correctAnswer: 1,
        section: "Number Series"
    },
    {
        question: "71, 55, 46, 42, ?",
        options: ["41", "40", "39", "60"],
        correctAnswer: 0,
        section: "Number Series"
    },
    {
        question: "225, 100, 36, 9, 1, ?",
        options: ["11", "-5", "6", "0"],
        correctAnswer: 3,
        section: "Number Series"
    },
    {
        question: "5, 11, 23, 47, 95, ?",
        options: ["176", "191", "199", "207"],
        correctAnswer: 2,
        section: "Number Series"
    },
    {
        question: "1, 2, 2, 4, 3, 8, 7, 10, ?",
        options: ["9", "8", "13", "11"],
        correctAnswer: 3,
        section: "Number Series"
    },
    {
        question: "831, 842, 853, 864, 875, ?",
        options: ["880", "886", "890", "892"],
        correctAnswer: 1,
        section: "Number Series"
    },

    // Section 2: Missing Numbers (10 questions)
    {
        question: "8 10 14 18 ? 34 50 66",
        options: ["20", "26", "28", "30"],
        correctAnswer: 1,
        section: "Missing Numbers"
    },
    {
        question: "16 (31) 47\n21 (?) 48",
        options: ["37", "21", "15", "27"],
        correctAnswer: 3,
        section: "Missing Numbers"
    },
    {
        question: "144, ?, 206, 240",
        options: ["155", "167", "170", "174"],
        correctAnswer: 3,
        section: "Missing Numbers"
    },
    {
        question: "16, 64, ?, 1024, 4096",
        options: ["98", "156", "256", "298"],
        correctAnswer: 2,
        section: "Missing Numbers"
    },
    {
        question: "56, 75, 94, ? , 132",
        options: ["113", "128", "130", "131"],
        correctAnswer: 0,
        section: "Missing Numbers"
    },
    {
        question: "19, 57, ?, 513",
        options: ["88", "171", "333", "467"],
        correctAnswer: 1,
        section: "Missing Numbers"
    },
    {
        question: "2448, 408, 68, ?",
        options: ["9", "11", "17", "29"],
        correctAnswer: 2,
        section: "Missing Numbers"
    },
    {
        question: "68, ?, 86, 95, 104",
        options: ["77", "11", "17", "29"],
        correctAnswer: 0,
        section: "Missing Numbers"
    },
    {
        question: "498 668 ? 974\n(249) (334) (448) (486)",
        options: ["699", "966", "896", "716"],
        correctAnswer: 2,
        section: "Missing Numbers"
    },
    {
        question: "278, 179, ?, -19, -118",
        options: ["0", "80", "-7", "66"],
        correctAnswer: 1,
        section: "Missing Numbers"
    },

    // Section 3: Logic Problems (15 questions)
    {
        question: "Mary is 16 years old. She is 4 times older than her brother. How old will Mary be when she is twice his age?",
        options: ["That's impossible", "20", "24", "28"],
        correctAnswer: 2,
        section: "Logic Problems"
    },
    {
        question: "Which fraction is the biggest?",
        options: ["3/5", "5/8", "1/2", "4/7"],
        correctAnswer: 1,
        section: "Logic Problems"
    },
    {
        question: "The store reduces the price of one product by 20 percent. How many percent do you need to raise to the percentage to get the original price?",
        options: ["25", "27", "30", "35"],
        correctAnswer: 0,
        section: "Logic Problems"
    },
    {
        question: "What is always associated with DOLMEN?",
        options: ["cloths", "statue", "tribe", "stone"],
        correctAnswer: 3,
        section: "Logic Problems"
    },
    {
        question: "What is a GOOGOL?",
        options: ["a folk dance", "a carrion crow", "an albatross", "a mathematical term"],
        correctAnswer: 3,
        section: "Logic Problems"
    },
    {
        question: "Which is the odd one out? CLAVICHORD, HARPSICHORD, CLARION, ACCORDION",
        options: ["clavichord", "harpsichord", "clarion", "accordion"],
        correctAnswer: 2,
        section: "Logic Problems"
    },
    {
        question: "LATTICE : WINDOW - Which two words below have the same relationship?",
        options: ["portal: gable", "mansard: roof", "parapet: door", "fascia: floor"],
        correctAnswer: 1,
        section: "Logic Problems"
    },
    {
        question: "Which word means the same as ESOTERIC?",
        options: ["pristine", "misshapen", "gibbous", "secret"],
        correctAnswer: 3,
        section: "Logic Problems"
    },
    {
        question: "What is a GIGOT?",
        options: ["a dancer", "a leg of mutton", "a rogue", "a measure"],
        correctAnswer: 1,
        section: "Logic Problems"
    },
    {
        question: "What is the name given to a group of LARKS?",
        options: ["exaltation", "badelynge", "flock", "pitying"],
        correctAnswer: 0,
        section: "Logic Problems"
    },
    {
        question: "Which one of these is not a musical instrument?",
        options: ["NILOIV", "MATBAN", "THIZRE", "LAMYCB"],
        correctAnswer: 1,
        section: "Logic Problems"
    },
    {
        question: "GENEALOGY : ANCESTRY\nETYMOLOGY : ?",
        options: ["knowledge", "fossils", "inscriptions", "words"],
        correctAnswer: 3,
        section: "Logic Problems"
    },
    {
        question: "What is STOCCADO?",
        options: ["a stockade", "fast talking", "a fencing stroke", "illness"],
        correctAnswer: 2,
        section: "Logic Problems"
    },
    {
        question: "What is always associated with INCARNADINE?",
        options: ["imprisonment", "body language", "flesh coloured", "quarries"],
        correctAnswer: 2,
        section: "Logic Problems"
    },
    {
        question: "How many minutes is it before noon if 29 minutes ago it was six times as many minutes past 10 am?",
        options: ["13 minutes", "15 minutes", "10 minutes", "16 minutes"],
        correctAnswer: 0,
        section: "Logic Problems"
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
    questionContainer.innerHTML = `
        <h3>${question.section}</h3>
        <p class="question-text">${question.question}</p>
        <div id="options-container">
            ${question.options.map((option, i) => `
                <div class="option ${state.answers[index] === i ? 'selected' : ''}" onclick="selectOption(${i})">
                    ${option}
                </div>
            `).join('')}
        </div>
    `;
}

function selectOption(optionIndex) {
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
            // If it's the last question and all questions are answered
            const allAnswered = state.answers.filter(answer => answer !== undefined).length === questions.length;
            if (allAnswered) {
                const submitButton = document.getElementById('submit-test');
                submitButton.classList.remove('hidden');
                submitButton.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, 300); // 300ms delay before moving to next question
}

function endTest() {
    clearInterval(state.timer);
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('payment-screen').classList.remove('hidden');
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

// Modify your handlePayment function to show loading
async function handlePayment() {
    showLoading();
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 499 // $4.99 in cents
            })
        });
        
        const data = await response.json();
        
        const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: elements.getElement('card'),
                billing_details: {
                    name: 'Test User'
                }
            }
        });
        
        hideLoading();
        
        if (result.error) {
            alert(result.error.message);
        } else {
            showResults();
        }
    } catch (error) {
        hideLoading();
        console.error('Error:', error);
        alert('Payment failed. Please try again.');
    }
}

function calculateIQ() {
    // Implement IQ calculation logic based on answers and time taken
    const correctAnswers = state.answers.filter((answer, index) => 
        answer === questions[index].correctAnswer
    ).length;
    
    // This is a simplified IQ calculation - you should implement a more sophisticated algorithm
    const baseIQ = 90;
    const pointsPerQuestion = 1.5;
    return baseIQ + (correctAnswers * pointsPerQuestion);
}

function showResults() {
    const results = {
        iqScore: calculateIQ(),
        numberSeriesCorrect: countCorrectAnswers(0, 15),
        missingNumbersCorrect: countCorrectAnswers(15, 25),
        logicProblemsCorrect: countCorrectAnswers(25, 40)
    };
    
    // Store results in localStorage
    localStorage.setItem('testResults', JSON.stringify(results));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function countCorrectAnswers(start, end) {
    return state.answers.slice(start, end).filter((answer, index) => 
        answer === questions[start + index].correctAnswer
    ).length;
}

function generateAnalysis(iqScore) {
    const numberSeriesScore = getPerformanceLevel(state.answers.slice(0, 15));
    const missingNumbersScore = getPerformanceLevel(state.answers.slice(15, 25));
    const logicProblemsScore = getPerformanceLevel(state.answers.slice(25, 40));

    return `
        <h3>Test Analysis</h3>
        <p>Your score of ${iqScore} indicates...</p>
        <ul>
            <li>Number Series (15 questions): ${numberSeriesScore}</li>
            <li>Missing Numbers (10 questions): ${missingNumbersScore}</li>
            <li>Logic Problems (15 questions): ${logicProblemsScore}</li>
        </ul>
        <p>Detailed Analysis:</p>
        <ul>
            <li>Number Pattern Recognition: ${numberSeriesScore === 'Excellent' ? 
                'You excel at recognizing numerical patterns and sequences' : 
                'Consider practicing more with number sequences'}</li>
            <li>Mathematical Logic: ${missingNumbersScore === 'Excellent' ? 
                'You show strong mathematical reasoning abilities' : 
                'Focus on understanding mathematical relationships'}</li>
            <li>Problem Solving: ${logicProblemsScore === 'Excellent' ? 
                'Your logical reasoning skills are highly developed' : 
                'Practice more complex logical problems'}</li>
        </ul>
    `;
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

    // Show submit button if all questions are answered
    const submitButton = document.getElementById('submit-test');
    if (state.answers.filter(answer => answer !== undefined).length === questions.length) {
        submitButton.classList.remove('hidden');
    }
}

function navigateToQuestion(index) {
    state.currentQuestion = index;
    loadQuestion(index);
    updateNavigationStatus();
}

// Add submit test function
function submitTest() {
    if (confirm('Are you sure you want to submit your test? You cannot change your answers after submission.')) {
        endTest();
    }
}

// Event Listeners
document.getElementById('start-test').addEventListener('click', startTest);
document.getElementById('purchase-button').addEventListener('click', handlePayment);
document.getElementById('submit-test').addEventListener('click', submitTest); 