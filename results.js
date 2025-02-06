document.addEventListener('DOMContentLoaded', () => {
    // Get results from localStorage (you'll need to store these during the test)
    const results = JSON.parse(localStorage.getItem('testResults'));
    
    if (results) {
        // Update scores
        document.getElementById('final-score').textContent = results.iqScore;
        document.getElementById('number-series-score').textContent = results.numberSeriesCorrect;
        document.getElementById('missing-numbers-score').textContent = results.missingNumbersCorrect;
        document.getElementById('logic-problems-score').textContent = results.logicProblemsCorrect;

        // Generate performance summary
        const performanceText = generatePerformanceSummary(results);
        document.getElementById('performance-text').innerHTML = performanceText;

        // Calculate and set percentile
        const percentile = calculatePercentile(results.iqScore);
        setPercentileIndicator(percentile);
        
        // Set strength levels
        setStrengthLevels(results);
        
        // Generate career recommendations
        generateCareerRecommendations(results);
        
        // Generate development suggestions
        generateDevelopmentSuggestions(results);
    }

    // Add this to your DOMContentLoaded event listener
    document.getElementById('download-certificate').addEventListener('click', generateCertificate);
    document.getElementById('submit-review').addEventListener('click', submitReview);

    // Add to your DOMContentLoaded event listener
    let currentRating = 0;

    document.querySelectorAll('.stars i').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            updateStars(rating);
        });

        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            previewStars(rating);
        });

        star.addEventListener('mouseout', function() {
            resetStars();
        });
    });
});

function generatePerformanceSummary(results) {
    let summary = '';
    
    // Calculate percentages for each section
    const numberSeriesPercent = (results.numberSeriesCorrect / 15) * 100;
    const missingNumbersPercent = (results.missingNumbersCorrect / 10) * 100;
    const logicProblemsPercent = (results.logicProblemsCorrect / 15) * 100;

    // Generate summary based on performance
    summary += `<p>Your strongest performance was in ${getStrongestSection(
        numberSeriesPercent,
        missingNumbersPercent,
        logicProblemsPercent
    )}.</p>`;

    summary += `<p>This indicates a natural aptitude for ${getAptitudeDescription(
        getStrongestSection(
            numberSeriesPercent,
            missingNumbersPercent,
            logicProblemsPercent
        )
    )}.</p>`;

    return summary;
}

function getStrongestSection(ns, mn, lp) {
    const scores = {
        'Number Series': ns,
        'Missing Numbers': mn,
        'Logic Problems': lp
    };
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function getAptitudeDescription(section) {
    const descriptions = {
        'Number Series': 'pattern recognition and sequential thinking, which is valuable in fields like data analysis, programming, and scientific research',
        'Missing Numbers': 'mathematical reasoning and analytical problem-solving, which is beneficial in fields like engineering, finance, and quantitative analysis',
        'Logic Problems': 'abstract reasoning and critical thinking, which is essential in fields like law, philosophy, and strategic planning'
    };
    return descriptions[section];
}

function calculatePercentile(iqScore) {
    // Simple percentile calculation based on IQ score
    return Math.min(Math.max(((iqScore - 70) / (130 - 70)) * 100, 0), 100);
}

function setPercentileIndicator(percentile) {
    const indicator = document.getElementById('percentile-marker');
    indicator.style.left = `${percentile}%`;
    
    const text = document.getElementById('percentile-text');
    text.textContent = `Your IQ score is higher than ${Math.round(percentile)}% of the population.`;
}

function setStrengthLevels(results) {
    // Calculate strength percentages based on section scores
    const patternStrength = (results.numberSeriesCorrect / 15) * 100;
    const numericalStrength = (results.missingNumbersCorrect / 10) * 100;
    const logicalStrength = (results.logicProblemsCorrect / 15) * 100;
    
    document.getElementById('pattern-strength').style.width = `${patternStrength}%`;
    document.getElementById('numerical-strength').style.width = `${numericalStrength}%`;
    document.getElementById('logical-strength').style.width = `${logicalStrength}%`;
}

function getStrongestArea(results) {
    const scores = {
        'Number Series': (results.numberSeriesCorrect / 15) * 100,
        'Missing Numbers': (results.missingNumbersCorrect / 10) * 100,
        'Logic Problems': (results.logicProblemsCorrect / 15) * 100
    };
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function generateCareerRecommendations(results) {
    const careerSuggestions = document.getElementById('career-suggestions');
    const strongestArea = getStrongestArea(results);
    const iqScore = results.iqScore;
    
    // Define IQ ranges
    let careerRange;
    if (iqScore >= 115) {
        careerRange = 'high';
    } else if (iqScore >= 90) {
        careerRange = 'mid';
    } else {
        careerRange = 'low';
    }

    const careers = {
        'Number Series': {
            high: [
                { 
                    title: 'Data Scientist',
                    description: 'Analyze complex data patterns and trends',
                    details: 'Your strong pattern recognition abilities make you well-suited for data science. This role involves:',
                    requirements: [
                        'Analyzing large datasets to identify trends',
                        'Building predictive models',
                        'Creating data visualization solutions',
                        'Developing machine learning algorithms'
                    ],
                    skills: 'Key skills: Python, R, SQL, Statistical Analysis'
                },
                { 
                    title: 'Software Developer',
                    description: 'Create algorithms and solve complex problems',
                    details: 'Your sequential thinking abilities align well with software development. This career involves:',
                    requirements: [
                        'Designing efficient algorithms',
                        'Building scalable applications',
                        'Debugging complex systems',
                        'Pattern-based problem solving'
                    ],
                    skills: 'Key skills: Programming Languages, System Design, Algorithm Optimization'
                },
                { 
                    title: 'Research Analyst',
                    description: 'Identify patterns in research data',
                    details: 'Your pattern recognition skills are valuable in research analysis. This role focuses on:',
                    requirements: [
                        'Conducting detailed data analysis',
                        'Identifying research trends',
                        'Making data-driven predictions',
                        'Creating comprehensive reports'
                    ],
                    skills: 'Key skills: Statistical Analysis, Research Methods, Data Visualization'
                }
            ],
            mid: [
                { 
                    title: 'Business Intelligence Analyst',
                    description: 'Analyze business data and create reports',
                    details: 'Your pattern recognition abilities suit business intelligence work. This role involves:',
                    requirements: [
                        'Creating data visualizations',
                        'Generating regular business reports',
                        'Monitoring key metrics',
                        'Identifying business trends'
                    ],
                    skills: 'Key skills: SQL, Excel, Data Visualization, Business Analysis'
                },
                {
                    title: 'Financial Analyst',
                    description: 'Analyze financial data and trends',
                    details: 'Your numerical abilities are well-suited for financial analysis. This role includes:',
                    requirements: [
                        'Analyzing financial statements',
                        'Creating financial models',
                        'Forecasting business trends',
                        'Preparing financial reports'
                    ],
                    skills: 'Key skills: Financial Modeling, Excel, Accounting Principles'
                },
                {
                    title: 'Market Research Analyst',
                    description: 'Analyze market trends and consumer behavior',
                    details: 'Your analytical skills fit market research work. This role involves:',
                    requirements: [
                        'Conducting market research',
                        'Analyzing consumer data',
                        'Preparing research reports',
                        'Presenting findings to stakeholders'
                    ],
                    skills: 'Key skills: Research Methods, Data Analysis, Report Writing'
                }
            ],
            low: [
                { 
                    title: 'Data Entry Specialist',
                    description: 'Process and verify numerical data',
                    details: 'Your attention to numerical patterns can be valuable in data entry. This role involves:',
                    requirements: [
                        'Entering data accurately and efficiently',
                        'Verifying information consistency',
                        'Maintaining organized records',
                        'Following established procedures'
                    ],
                    skills: 'Key skills: Attention to Detail, Basic Excel, Data Verification'
                },
                {
                    title: 'Inventory Control Clerk',
                    description: 'Monitor and manage inventory levels',
                    details: 'Your pattern recognition skills suit inventory management. This role includes:',
                    requirements: [
                        'Tracking inventory levels',
                        'Recording stock movements',
                        'Maintaining inventory records',
                        'Processing purchase orders'
                    ],
                    skills: 'Key skills: Inventory Management, Basic Mathematics, Record Keeping'
                },
                {
                    title: 'Production Assistant',
                    description: 'Support production operations',
                    details: 'Your attention to detail fits production work. This role involves:',
                    requirements: [
                        'Monitoring production schedules',
                        'Recording production data',
                        'Checking quality standards',
                        'Maintaining production records'
                    ],
                    skills: 'Key skills: Quality Control, Basic Mathematics, Record Keeping'
                }
            ]
        },
        'Missing Numbers': {
            high: [
                {
                    title: 'Quantitative Analyst',
                    description: 'Develop complex mathematical models for finance',
                    details: 'Your exceptional numerical abilities are perfect for quantitative analysis. This role involves:',
                    requirements: [
                        'Developing mathematical trading models',
                        'Creating risk assessment frameworks',
                        'Analyzing market patterns',
                        'Implementing algorithmic strategies'
                    ],
                    skills: 'Key skills: Advanced Mathematics, Financial Modeling, Programming, Statistics'
                },
                {
                    title: 'Actuary',
                    description: 'Analyze financial costs of risk and uncertainty',
                    details: 'Your strong mathematical skills suit actuarial work. This role involves:',
                    requirements: [
                        'Calculating probability and risk',
                        'Developing pricing strategies',
                        'Creating statistical models',
                        'Analyzing complex datasets'
                    ],
                    skills: 'Key skills: Statistical Analysis, Risk Assessment, Financial Mathematics'
                },
                {
                    title: 'Research Mathematician',
                    description: 'Conduct advanced mathematical research',
                    details: 'Your numerical abilities are ideal for mathematical research. This role includes:',
                    requirements: [
                        'Developing mathematical theories',
                        'Solving complex problems',
                        'Publishing research papers',
                        'Collaborating with other researchers'
                    ],
                    skills: 'Key skills: Advanced Mathematics, Research Methods, Analytical Thinking'
                }
            ],
            mid: [
                {
                    title: 'Financial Controller',
                    description: 'Manage financial operations and reporting',
                    details: 'Your numerical skills suit financial control work. This role involves:',
                    requirements: [
                        'Managing financial operations',
                        'Preparing financial reports',
                        'Analyzing business metrics',
                        'Developing budgets'
                    ],
                    skills: 'Key skills: Accounting, Financial Analysis, Budgeting, Excel'
                },
                {
                    title: 'Cost Estimator',
                    description: 'Calculate project and product costs',
                    details: 'Your numerical abilities fit cost estimation work. This role includes:',
                    requirements: [
                        'Analyzing project requirements',
                        'Calculating material and labor costs',
                        'Preparing detailed estimates',
                        'Tracking project expenses'
                    ],
                    skills: 'Key skills: Cost Analysis, Project Planning, Mathematical Modeling'
                },
                {
                    title: 'Insurance Underwriter',
                    description: 'Evaluate insurance applications and risk',
                    details: 'Your mathematical skills suit underwriting. This role involves:',
                    requirements: [
                        'Assessing insurance risks',
                        'Calculating premium rates',
                        'Analyzing statistical data',
                        'Making coverage decisions'
                    ],
                    skills: 'Key skills: Risk Assessment, Statistical Analysis, Decision Making'
                }
            ],
            low: [
                {
                    title: 'Accounting Clerk',
                    description: 'Process financial transactions and records',
                    details: 'Your numerical abilities suit accounting work. This role involves:',
                    requirements: [
                        'Processing financial transactions',
                        'Maintaining accounting records',
                        'Reconciling accounts',
                        'Preparing basic reports'
                    ],
                    skills: 'Key skills: Basic Accounting, Data Entry, Excel'
                },
                {
                    title: 'Payroll Administrator',
                    description: 'Process and manage employee payroll',
                    details: 'Your numerical skills fit payroll administration. This role includes:',
                    requirements: [
                        'Calculating employee wages',
                        'Processing payroll transactions',
                        'Maintaining payroll records',
                        'Handling tax deductions'
                    ],
                    skills: 'Key skills: Payroll Software, Basic Mathematics, Record Keeping'
                },
                {
                    title: 'Bank Teller',
                    description: 'Process banking transactions',
                    details: 'Your numerical abilities suit banking operations. This role involves:',
                    requirements: [
                        'Processing customer transactions',
                        'Handling cash accurately',
                        'Maintaining transaction records',
                        'Balancing daily accounts'
                    ],
                    skills: 'Key skills: Cash Handling, Basic Mathematics, Customer Service'
                }
            ]
        },
        'Logic Problems': {
            high: [
                {
                    title: 'Management Consultant',
                    description: 'Solve complex business problems',
                    details: 'Your strong logical abilities suit strategic consulting. This role involves:',
                    requirements: [
                        'Analyzing business challenges',
                        'Developing strategic solutions',
                        'Leading organizational change',
                        'Creating implementation plans'
                    ],
                    skills: 'Key skills: Strategic Analysis, Problem Solving, Business Strategy'
                },
                {
                    title: 'Systems Architect',
                    description: 'Design complex technical systems',
                    details: 'Your logical thinking suits systems architecture. This role includes:',
                    requirements: [
                        'Designing system architectures',
                        'Solving complex technical problems',
                        'Creating scalable solutions',
                        'Optimizing system performance'
                    ],
                    skills: 'Key skills: Systems Design, Technical Architecture, Problem Solving'
                },
                {
                    title: 'Corporate Strategist',
                    description: 'Develop business strategies',
                    details: 'Your logical abilities fit strategic planning. This role involves:',
                    requirements: [
                        'Analyzing market opportunities',
                        'Developing business strategies',
                        'Evaluating competitive landscapes',
                        'Planning strategic initiatives'
                    ],
                    skills: 'Key skills: Strategic Planning, Market Analysis, Business Development'
                }
            ],
            mid: [
                {
                    title: 'Business Analyst',
                    description: 'Analyze business processes and needs',
                    details: 'Your logical thinking suits business analysis. This role involves:',
                    requirements: [
                        'Analyzing business processes',
                        'Identifying improvement opportunities',
                        'Documenting requirements',
                        'Implementing solutions'
                    ],
                    skills: 'Key skills: Process Analysis, Problem Solving, Documentation'
                },
                {
                    title: 'Project Manager',
                    description: 'Plan and execute projects',
                    details: 'Your logical abilities fit project management. This role includes:',
                    requirements: [
                        'Planning project timelines',
                        'Managing resources',
                        'Coordinating team efforts',
                        'Solving project challenges'
                    ],
                    skills: 'Key skills: Project Planning, Team Leadership, Problem Solving'
                },
                {
                    title: 'Quality Assurance Manager',
                    description: 'Ensure product and process quality',
                    details: 'Your logical thinking suits quality management. This role involves:',
                    requirements: [
                        'Developing quality standards',
                        'Implementing testing procedures',
                        'Analyzing quality metrics',
                        'Improving processes'
                    ],
                    skills: 'Key skills: Quality Management, Process Analysis, Problem Solving'
                }
            ],
            low: [
                {
                    title: 'Administrative Coordinator',
                    description: 'Coordinate office operations',
                    details: 'Your logical abilities suit administrative work. This role involves:',
                    requirements: [
                        'Organizing office procedures',
                        'Coordinating schedules',
                        'Managing documentation',
                        'Solving daily operational issues'
                    ],
                    skills: 'Key skills: Organization, Basic Problem Solving, Communication'
                },
                {
                    title: 'Customer Service Supervisor',
                    description: 'Manage customer service operations',
                    details: 'Your problem-solving abilities fit customer service. This role includes:',
                    requirements: [
                        'Resolving customer issues',
                        'Managing service team',
                        'Implementing service procedures',
                        'Tracking service metrics'
                    ],
                    skills: 'Key skills: Problem Solving, Team Leadership, Customer Service'
                },
                {
                    title: 'Logistics Coordinator',
                    description: 'Coordinate shipping and receiving',
                    details: 'Your logical thinking suits logistics work. This role involves:',
                    requirements: [
                        'Organizing shipments',
                        'Tracking deliveries',
                        'Managing inventory',
                        'Solving logistics issues'
                    ],
                    skills: 'Key skills: Organization, Basic Problem Solving, Coordination'
                }
            ]
        }
    };

    // Check if careers exist for the strongest area and range
    if (!careers[strongestArea] || !careers[strongestArea][careerRange]) {
        console.error('No careers found for:', strongestArea, careerRange);
        return;
    }

    const recommendedCareers = careers[strongestArea][careerRange];
    
    // Add a header explaining the career range
    const rangeDescriptions = {
        high: 'Based on your high IQ score (115+), here are some advanced career paths that match your cognitive abilities:',
        mid: 'With your IQ score in the average to above-average range (90-115), these career paths could be good matches:',
        low: 'Here are some career paths that could be a good fit based on your cognitive profile:'
    };

    careerSuggestions.innerHTML = `
        <div class="iq-range-context">
            <h4>Career Recommendations</h4>
            <p>${rangeDescriptions[careerRange]}</p>
        </div>
        ${recommendedCareers.map(career => `
            <div class="career-path-card">
                <h4>${career.title}</h4>
                <p class="career-description">${career.description}</p>
                <div class="career-details">
                    <p>${career.details}</p>
                    <ul>
                        ${career.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                    <p class="career-skills">${career.skills}</p>
                </div>
            </div>
        `).join('')}
    `;
}

function generateDevelopmentSuggestions(results) {
    const suggestionsDiv = document.getElementById('development-tips');
    const weakestArea = getWeakestArea(results);
    
    const suggestions = {
        'Number Series': [
            {
                title: 'Pattern Recognition Training',
                description: 'Practice pattern recognition exercises daily',
                activities: [
                    'Complete number sequence puzzles',
                    'Study mathematical patterns in nature (Fibonacci, etc.)',
                    'Practice with online pattern recognition games'
                ],
                resources: [
                    'Khan Academy - Number Patterns',
                    'Brilliant.org - Pattern Recognition Course',
                    'Math Workout mobile app'
                ],
                timeframe: 'Dedicate 20-30 minutes daily for optimal improvement'
            },
            {
                title: 'Mathematical Sequence Study',
                description: 'Study mathematical sequences and series',
                activities: [
                    'Learn about arithmetic and geometric sequences',
                    'Practice identifying sequence rules',
                    'Work on progressive difficulty exercises'
                ],
                resources: [
                    'IXL Math - Sequence Practice',
                    'Mathematics Stack Exchange',
                    'Number Sequence Workbooks'
                ],
                timeframe: 'Set aside 1 hour, 3 times per week'
            }
        ],
        'Missing Numbers': [
            {
                title: 'Mental Mathematics Training',
                description: 'Enhance your mental calculation abilities',
                activities: [
                    'Practice mental arithmetic daily',
                    'Work on speed mathematics techniques',
                    'Solve mathematical puzzles and problems'
                ],
                resources: [
                    'Trachtenberg Speed System of Mathematics',
                    'Mental Math Trainer App',
                    'Mathematics Olympiad Practice Books'
                ],
                timeframe: 'Practice 30 minutes daily'
            },
            {
                title: 'Advanced Problem Solving',
                description: 'Develop mathematical problem-solving skills',
                activities: [
                    'Solve word problems',
                    'Practice algebra and numerical reasoning',
                    'Work with mathematical modeling'
                ],
                resources: [
                    'GMAT Mathematical Practice Questions',
                    'Art of Problem Solving Website',
                    'Mathematical Thinking Course'
                ],
                timeframe: 'Dedicate 1 hour every other day'
            }
        ],
        'Logic Problems': [
            {
                title: 'Critical Thinking Development',
                description: 'Enhance logical reasoning abilities',
                activities: [
                    'Solve logic puzzles and brain teasers',
                    'Practice deductive reasoning problems',
                    'Work on syllogisms and logical arguments'
                ],
                resources: [
                    'Logic Puzzles Daily Website',
                    'Critical Thinking Workbook',
                    'Philosophy Logic Course Materials'
                ],
                timeframe: 'Practice 45 minutes daily'
            },
            {
                title: 'Analytical Reasoning Practice',
                description: 'Strengthen analytical thinking skills',
                activities: [
                    'Complete LSAT logic games',
                    'Practice case study analysis',
                    'Work on complex problem decomposition'
                ],
                resources: [
                    'LSAT Logic Games Practice Book',
                    'Case Study Analysis Course',
                    'Analytical Reasoning Apps'
                ],
                timeframe: 'Set aside 1 hour, 4 times per week'
            }
        ]
    };

    const areaSuggestions = suggestions[weakestArea];
    suggestionsDiv.innerHTML = areaSuggestions.map(suggestion => `
        <div class="suggestion-item">
            <h4>${suggestion.title}</h4>
            <p class="suggestion-description">${suggestion.description}</p>
            <div class="suggestion-details">
                <h5>Recommended Activities:</h5>
                <ul>
                    ${suggestion.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
                <h5>Helpful Resources:</h5>
                <ul>
                    ${suggestion.resources.map(resource => `<li>${resource}</li>`).join('')}
                </ul>
                <p class="timeframe"><strong>Recommended Timeframe:</strong> ${suggestion.timeframe}</p>
            </div>
        </div>
    `).join('');
}

// Add helper function to determine weakest area
function getWeakestArea(results) {
    const scores = {
        'Number Series': (results.numberSeriesCorrect / 15) * 100,
        'Missing Numbers': (results.missingNumbersCorrect / 10) * 100,
        'Logic Problems': (results.logicProblemsCorrect / 15) * 100
    };
    return Object.keys(scores).reduce((a, b) => scores[a] < scores[b] ? a : b);
}

// Add this function to generate and download the certificate
function generateCertificate() {
    const results = JSON.parse(localStorage.getItem('testResults'));
    const iqScore = results.iqScore;
    const date = new Date().toLocaleDateString();
    const certificateId = generateCertificateId();
    
    const certificateHTML = `
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Montserrat', sans-serif;
                    text-align: center;
                    padding: 40px;
                    background: #f8f9ff;
                    color: #2c3e50;
                }
                .certificate {
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 60px;
                    background: white;
                    border-radius: 20px;
                    position: relative;
                    box-shadow: 0 10px 40px rgba(71, 118, 230, 0.1);
                    overflow: hidden;
                }
                .certificate::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 10px;
                    background: linear-gradient(90deg, #4776E6, #8E54E9);
                }
                .company-name {
                    font-size: 42px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #4776E6, #8E54E9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 30px;
                    letter-spacing: 2px;
                    position: relative;
                    z-index: 2;
                }
                .header {
                    font-family: 'Playfair Display', serif;
                    font-size: 36px;
                    color: #2c3e50;
                    margin: 30px 0;
                }
                .subheader {
                    font-size: 24px;
                    color: #4776E6;
                    margin-bottom: 40px;
                    font-weight: 600;
                }
                .score-container {
                    background: linear-gradient(135deg, #f8f9ff, #ffffff);
                    padding: 30px;
                    border-radius: 15px;
                    margin: 40px auto;
                    max-width: 400px;
                    border: 2px solid rgba(71, 118, 230, 0.1);
                }
                .score {
                    font-size: 72px;
                    background: linear-gradient(135deg, #4776E6, #8E54E9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 700;
                    margin: 20px 0;
                    position: relative;
                    z-index: 1;
                }
                .score::after {
                    content: 'IQ';
                    font-size: 24px;
                    margin-left: 10px;
                    opacity: 0.8;
                }
                .date {
                    font-size: 18px;
                    color: #666;
                    margin-top: 40px;
                    font-weight: 500;
                }
                .certificate-id {
                    font-size: 14px;
                    color: #666;
                    position: absolute;
                    bottom: 20px;
                    right: 30px;
                    font-family: 'Montserrat', sans-serif;
                    background: #f8f9ff;
                    padding: 8px 15px;
                    border-radius: 8px;
                }
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-30deg);
                    font-size: 180px;
                    color: rgba(71, 118, 230, 0.03);
                    pointer-events: none;
                    font-weight: 700;
                    white-space: nowrap;
                    z-index: 0;
                }
                .description {
                    font-size: 18px;
                    color: #666;
                    line-height: 1.6;
                    margin: 20px 0;
                }
                .signature-line,
                .signature-title {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <div class="watermark">GetMyIQ</div>
                <div class="company-name">GetMyIQ</div>
                <div class="header">Certificate of Achievement</div>
                <div class="subheader">Official IQ Assessment</div>
                <div class="description">
                    This certifies that you have successfully completed<br>
                    our comprehensive intelligence quotient assessment
                </div>
                <div class="score-container">
                    <div class="score">${iqScore}</div>
                </div>
                <div class="date">Issued on ${date}</div>
                <div class="certificate-id">Certificate ID: ${certificateId}</div>
            </div>
        </body>
        </html>
    `;

    // Create and trigger download
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GetMyIQ_Certificate_${date.replace(/\//g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GMI-${timestamp}-${randomStr}`;
}

function updateStars(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function previewStars(rating) {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach(star => {
        star.classList.remove('hover');
    });
}

function submitReview() {
    const reviewerName = document.getElementById('reviewer-name').value;
    const reviewText = document.getElementById('review-text').value;

    if (!reviewerName.trim()) {
        alert('Please enter your name before submitting.');
        return;
    }
    if (currentRating === 0) {
        alert('Please rate your experience before submitting.');
        return;
    }
    if (!reviewText.trim()) {
        alert('Please write a review before submitting.');
        return;
    }

    // Here you would typically send the review to your server
    console.log('Review submitted:', {
        name: reviewerName,
        rating: currentRating,
        text: reviewText
    });

    // Show success message
    alert('Thank you for your review!');
    
    // Hide the review section with a fade-out animation
    const reviewSection = document.querySelector('.review-section');
    reviewSection.style.opacity = '0';
    reviewSection.style.transform = 'translateY(20px)';
    
    // Remove the section after animation completes
    setTimeout(() => {
        reviewSection.style.display = 'none';
    }, 500); // Match this with the CSS transition duration
} 