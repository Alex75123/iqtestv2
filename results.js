document.addEventListener('DOMContentLoaded', () => {
    // Get results from localStorage
    const testResults = localStorage.getItem('testResults');
    
    if (testResults) {
        const results = JSON.parse(testResults);
        displayResults(results);
    } else {
        // Redirect to index if no results found
        window.location.href = 'index.html';
    }
});

function displayResults(results) {
    // Display basic scores
    document.getElementById('correct-answers').textContent = `${results.totalCorrect}/20`;
    document.getElementById('iq-score').textContent = results.iqScore;
    document.getElementById('weighted-score').textContent = 
        `${results.weightedScore.toFixed(1)}/39.0`; // Show both numbers with one decimal
    
    // Calculate and display percentile
    const percentile = calculatePercentile(results.iqScore);
    document.getElementById('percentile-rank').textContent = `Top ${percentile}%`;
    
    // Update detailed analysis
    updateAnalysis(results);
    
    // Draw bell curve instead of positioning marker
    drawBellCurve(results.iqScore);
}

function calculatePercentile(iqScore) {
    // Using normal distribution properties for IQ (mean=100, SD=15)
    const mean = 100;
    const sd = 15;
    const z = (iqScore - mean) / sd;
    const percentile = (1 - normalCDF(z)) * 100;
    // Return with 1 decimal place, clamped between 0.1 and 99.9
    return Math.min(99.9, Math.max(0.1, percentile)).toFixed(1);
}

function normalCDF(z) {
    // Approximation of normal cumulative distribution function
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
}

function updateAnalysis(results) {
    // Performance level analysis
    const performanceLevel = getPerformanceLevel(results.totalCorrect);
    document.getElementById('performance-level').textContent = 
        `Your performance is in the ${performanceLevel} range`;
    
    // Pattern recognition analysis with percentage
    const patternScore = Math.round((results.totalCorrect / 20) * 100);
    document.getElementById('pattern-analysis').textContent = 
        `Pattern Recognition Accuracy: ${patternScore}% - ${getPatternAnalysis(patternScore)}`;
    
    // Problem solving analysis
    document.getElementById('problem-solving').textContent = getDetailedAnalysis(results.totalCorrect);
    
    // Update IQ characteristics and career recommendations
    updateIQCharacteristics(results.iqScore);
    updateCareerRecommendations(results.iqScore);
}

function getPerformanceLevel(correct) {
    if (correct >= 18) return "Genius";
    if (correct >= 16) return "Superior";
    if (correct >= 12) return "Above Average";
    if (correct >= 8) return "Average";
    return "Developing";
}

function getDetailedAnalysis(correct) {
    let analysis = '';
    const score = (correct / 20) * 100;
    
    // Detailed performance analysis based on score ranges
    if (correct >= 18) {  // 90-100%
        analysis = "Exceptional cognitive abilities demonstrated. Your performance indicates superior pattern recognition, " +
                  "advanced logical reasoning, and excellent problem-solving skills. You excel at identifying complex " +
                  "relationships and show remarkable mental agility in processing abstract concepts. Your score places " +
                  "you among the top performers, suggesting exceptional intellectual capabilities.";
    } else if (correct >= 16) {  // 80-89%
        analysis = "Very strong cognitive performance displayed. You exhibit advanced pattern recognition abilities and " +
                  "strong analytical thinking. Your problem-solving approach shows sophistication and you demonstrate " +
                  "excellent capacity for understanding complex logical relationships. Your performance indicates " +
                  "well-developed intellectual abilities significantly above average.";
    } else if (correct >= 12) {  // 60-79%
        analysis = "Above average cognitive abilities shown. You demonstrate good pattern recognition skills and solid " +
                  "logical reasoning capabilities. Your performance indicates strong problem-solving abilities and good " +
                  "mental flexibility. While there's room for development in some areas, your overall cognitive " +
                  "performance is notably strong.";
    } else if (correct >= 8) {  // 40-59%
        analysis = "Average cognitive performance demonstrated. You show reasonable pattern recognition abilities and " +
                  "basic logical reasoning skills. Your problem-solving approach indicates standard cognitive processing " +
                  "with potential for development. Consider practicing with logic puzzles and pattern recognition " +
                  "exercises to enhance your capabilities.";
    } else {  // Below 40%
        analysis = "Foundational cognitive abilities displayed. While basic pattern recognition is present, there's " +
                  "significant room for improvement in logical reasoning and problem-solving approaches. Regular practice " +
                  "with cognitive exercises could help develop stronger analytical skills and pattern recognition abilities.";
    }
    
    return analysis;
}

function getPatternAnalysis(score) {
    if (score >= 90) return "Exceptional pattern recognition abilities";
    if (score >= 80) return "Very strong pattern identification skills";
    if (score >= 60) return "Good pattern recognition capabilities";
    if (score >= 40) return "Basic pattern recognition skills";
    return "Developing pattern recognition abilities";
}

function drawBellCurve(iqScore) {
    const canvas = document.getElementById('bell-curve-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size with padding for labels
    canvas.width = 1100;  // Increased for more label space
    canvas.height = 400;
    
    // Center the actual curve by adding padding
    const padding = 100;  // Increased padding on each side
    const curveWidth = 900;  // Keep original curve width
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Parameters for normal distribution
    const mean = 100;
    const sd = 15;
    const start = 55;  // -3 SD
    const end = 145;   // +3 SD
    
    // Calculate max height of curve for scaling
    const maxY = 1 / (sd * Math.sqrt(2 * Math.PI)); // Height at mean
    const heightScale = 300; // Scale factor to make curve visible
    
    // Draw bell curve
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height);
    
    // Draw curve
    for (let x = padding; x <= padding + curveWidth; x++) {
        const score = start + ((x - padding) / curveWidth) * (end - start);
        const z = (score - mean) / sd;
        const y = Math.exp(-(z * z) / 2) / (sd * Math.sqrt(2 * Math.PI));
        const scaledY = (y / maxY) * heightScale;
        ctx.lineTo(x, canvas.height - scaledY);
    }
    
    // Complete the path
    ctx.lineTo(padding + curveWidth, canvas.height);
    ctx.closePath();
    
    // Fill entire curve with light color
    ctx.fillStyle = 'rgba(71, 118, 230, 0.1)';
    ctx.fill();
    
    // Fill user's percentile area
    ctx.beginPath();
    const userX = ((iqScore - start) / (end - start)) * curveWidth + padding;
    ctx.moveTo(userX, canvas.height);
    
    for (let x = userX; x <= padding + curveWidth; x++) {
        const score = start + ((x - padding) / curveWidth) * (end - start);
        const z = (score - mean) / sd;
        const y = Math.exp(-(z * z) / 2) / (sd * Math.sqrt(2 * Math.PI));
        const scaledY = (y / maxY) * heightScale;
        ctx.lineTo(x, canvas.height - scaledY);
    }
    
    ctx.lineTo(padding + curveWidth, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(71, 118, 230, 0.2)';
    ctx.fill();
    
    // Draw curve outline
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height);
    for (let x = padding; x <= padding + curveWidth; x++) {
        const score = start + ((x - padding) / curveWidth) * (end - start);
        const z = (score - mean) / sd;
        const y = Math.exp(-(z * z) / 2) / (sd * Math.sqrt(2 * Math.PI));
        const scaledY = (y / maxY) * heightScale;
        ctx.lineTo(x, canvas.height - scaledY);
    }
    ctx.strokeStyle = '#4776E6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw standard deviation markers
    for (let i = -3; i <= 3; i++) {
        const score = mean + (i * sd);
        const x = ((score - start) / (end - start)) * curveWidth + padding;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(71, 118, 230, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, canvas.height - 40);
        ctx.lineTo(x, 50);
        ctx.stroke();
    }
    
    // Draw labels
    const labels = [
        { score: 55, text: 'Very Low', percent: '0.1%' },
        { score: 70, text: 'Low', percent: '2%' },
        { score: 85, text: 'Below Average', percent: '16%' },
        { score: 100, text: 'Average', percent: '50%' },
        { score: 115, text: 'Above Average', percent: '84%' },
        { score: 130, text: 'Superior', percent: '98%' },
        { score: 145, text: 'Genius', percent: '99.9%' }
    ];
    
    labels.forEach(label => {
        const x = ((label.score - start) / (end - start)) * curveWidth + padding;
        
        // Draw labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label.score.toString(), x, canvas.height - 25);
        ctx.fillText(label.text, x, canvas.height - 10);
        ctx.fillText(label.percent, x, 40);
    });
    
    // Draw marker for user's score
    const markerX = ((iqScore - start) / (end - start)) * curveWidth + padding;
    
    // Draw vertical line
    ctx.beginPath();
    ctx.strokeStyle = '#4776E6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.moveTo(markerX, canvas.height - 35);
    ctx.lineTo(markerX, 20);
    ctx.stroke();
    
    // Draw marker point
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(markerX, 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4776E6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw score label
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Your Score: ${iqScore}`, markerX, 10);
}

function generateSerialNumber(results) {
    // Create a unique serial number based on date and score
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const score = results.iqScore.toString().padStart(3, '0');
    
    return `GMI-${year}${month}${day}-${score}-${random}`;
}

function downloadCertificate() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 2000;
    canvas.height = 1414;
    
    // Get results and generate serial number
    const results = JSON.parse(localStorage.getItem('testResults'));
    const serialNumber = generateSerialNumber(results);
    
    // Set background
    ctx.fillStyle = '#f8f9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative border
    ctx.strokeStyle = '#4776E6';
    ctx.lineWidth = 20;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Add inner border
    ctx.strokeStyle = '#8E54E9';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);
    
    // Add watermark
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-Math.PI/6);
    ctx.font = 'bold 150px Arial';
    ctx.fillStyle = '#4776E6';
    ctx.textAlign = 'center';
    ctx.fillText('GetMyIQ', 0, 0);
    ctx.restore();
    
    // Add certificate content
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    
    // Add logo/header
    ctx.font = 'bold 100px Arial';
    ctx.fillText('GetMyIQ', canvas.width/2, 200);
    
    // Certificate title
    ctx.font = 'bold 80px Arial';
    ctx.fillText('Certificate of Achievement', canvas.width/2, 400);
    
    // Add decorative line
    const lineY = 450;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 200, lineY);
    ctx.lineTo(canvas.width/2 + 200, lineY);
    ctx.strokeStyle = '#4776E6';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add certificate text
    const percentile = calculatePercentile(results.iqScore);
    
    ctx.font = '40px Arial';
    ctx.fillText('This is to certify that the participant completed', canvas.width/2, 600);
    ctx.fillText('the GetMyIQ Intelligence Assessment with the following results:', canvas.width/2, 660);
    
    // Add results with decorative boxes
    function drawResultBox(text, value, y) {
        const boxWidth = 400;
        const boxHeight = 80;
        const boxX = canvas.width/2 - boxWidth/2;
        
        // Draw box
        ctx.fillStyle = '#f8f9ff';
        ctx.strokeStyle = '#4776E6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, y - boxHeight/2, boxWidth, boxHeight, 10);
        ctx.stroke();
        ctx.fill();
        
        // Add text
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 45px Arial';
        ctx.fillText(`${text}: ${value}`, canvas.width/2, y + 15);
    }
    
    drawResultBox('IQ Score', results.iqScore, 800);
    drawResultBox('Percentile', `Top ${percentile}%`, 920);
    drawResultBox('Accuracy', `${results.totalCorrect}/20`, 1040);
    
    // Add date
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    ctx.font = '35px Arial';
    ctx.fillText(`Issued on ${date}`, canvas.width/2, 1200);
    
    // Add serial number at the bottom
    ctx.font = '25px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Certificate ID: ${serialNumber}`, canvas.width/2, canvas.height - 100);
    
    // Add QR code or verification text
    ctx.font = '20px Arial';
    ctx.fillText('Verify this certificate at getmyiq.com/verify', canvas.width/2, canvas.height - 60);
    
    // Add decorative corners
    function drawCorner(x, y, rotate) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate * Math.PI/2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(100, 0);
        ctx.lineTo(100, 100);
        ctx.strokeStyle = '#4776E6';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }
    
    drawCorner(100, 100, 0);
    drawCorner(canvas.width-100, 100, 1);
    drawCorner(canvas.width-100, canvas.height-100, 2);
    drawCorner(100, canvas.height-100, 3);
    
    // Download the certificate
    const link = document.createElement('a');
    link.download = 'GetMyIQ-Certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function handlePurchaseClick() {
    localStorage.setItem('returnToResults', 'true');
    window.location.href = 'https://buy.stripe.com/4gwdUi12J9D6eqc9AB';
}

// Handle star rating
document.querySelectorAll('.star-rating i').forEach(star => {
    star.addEventListener('click', (e) => {
        const rating = e.target.dataset.rating;
        document.querySelectorAll('.star-rating i').forEach(s => {
            const sRating = s.dataset.rating;
            if (sRating <= rating) {
                s.classList.remove('far');
                s.classList.add('fas');
            } else {
                s.classList.remove('fas');
                s.classList.add('far');
            }
        });
    });
});

// Handle review submission
document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('review-name').value;
    const email = document.getElementById('review-email').value;
    const review = document.getElementById('review-text').value;
    const rating = document.querySelectorAll('.star-rating i.fas').length;
    
    // Get the review section
    const reviewSection = document.querySelector('.review-section');
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'review-success';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; color: #4776E6; margin-bottom: 1rem;"></i>
        <h3>Thank you for your review!</h3>
        <p>Your feedback helps us improve our service.</p>
    `;
    
    // Replace review form with success message
    reviewSection.innerHTML = '';
    reviewSection.appendChild(successMessage);
    
    // Hide the review section after 3 seconds
    setTimeout(() => {
        reviewSection.classList.add('hidden');
    }, 3000);
});

function updateIQCharacteristics(iqScore) {
    const cognitiveStrengths = document.getElementById('cognitive-strengths');
    const learningStyle = document.getElementById('learning-style');
    
    const characteristics = getIQCharacteristics(iqScore);
    
    // Update cognitive strengths
    cognitiveStrengths.innerHTML = characteristics.cognitive.map(strength => `
        <div class="characteristic-item">
            <i class="fas fa-check"></i>
            <div>${strength}</div>
        </div>
    `).join('');
    
    // Update learning style
    learningStyle.innerHTML = characteristics.learning.map(style => `
        <div class="characteristic-item">
            <i class="fas fa-lightbulb"></i>
            <div>${style}</div>
        </div>
    `).join('');
}

function updateCareerRecommendations(iqScore) {
    const careerPaths = document.getElementById('career-paths');
    const careers = getCareerRecommendations(iqScore);
    
    careerPaths.innerHTML = careers.map(career => `
        <div class="career-card">
            <h3>${career.title}</h3>
            <p class="career-description">${career.description}</p>
            <div class="career-skills">
                ${career.skills.map(skill => `
                    <span class="skill-tag">${skill}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function getIQCharacteristics(iqScore) {
    if (iqScore >= 130) {
        return {
            cognitive: [
                "Exceptional abstract reasoning abilities",
                "Superior problem-solving capabilities",
                "Advanced pattern recognition",
                "Excellent analytical thinking",
                "Strong conceptual understanding"
            ],
            learning: [
                "Quick to grasp complex concepts",
                "Highly independent learner",
                "Strong preference for intellectual challenges",
                "Excellent at synthesizing information",
                "Innovative approach to problem-solving"
            ]
        };
    } else if (iqScore >= 115) {
        return {
            cognitive: [
                "Above-average analytical abilities",
                "Strong logical reasoning",
                "Good pattern recognition",
                "Effective problem-solving skills",
                "Clear conceptual thinking"
            ],
            learning: [
                "Learns new concepts quickly",
                "Self-directed learning capability",
                "Enjoys intellectual challenges",
                "Good at connecting ideas",
                "Systematic approach to problems"
            ]
        };
    } else if (iqScore >= 100) {
        return {
            cognitive: [
                "Solid reasoning abilities",
                "Good practical problem-solving",
                "Standard pattern recognition",
                "Balanced analytical thinking",
                "Practical conceptual understanding"
            ],
            learning: [
                "Steady learning pace",
                "Benefits from structured learning",
                "Handles moderate complexity well",
                "Good at applying learned concepts",
                "Methodical problem-solving approach"
            ]
        };
    } else {
        return {
            cognitive: [
                "Practical thinking abilities",
                "Hands-on problem-solving",
                "Basic pattern recognition",
                "Concrete analytical thinking",
                "Practical approach to tasks"
            ],
            learning: [
                "Learns through practical experience",
                "Benefits from step-by-step instruction",
                "Prefers concrete examples",
                "Hands-on learning style",
                "Sequential problem-solving approach"
            ]
        };
    }
}

function getCareerRecommendations(iqScore) {
    if (iqScore >= 130) {
        return [
            {
                title: "Research Scientist",
                description: "Lead innovative research projects and develop new theories in your field of expertise.",
                skills: ["Analysis", "Research", "Innovation", "Complex Problem Solving"]
            },
            {
                title: "Quantum Computing Engineer",
                description: "Design and develop next-generation quantum computing systems and algorithms.",
                skills: ["Quantum Mechanics", "Programming", "Mathematics", "Physics"]
            },
            {
                title: "Strategic Consultant",
                description: "Solve complex business challenges and develop high-level strategic initiatives.",
                skills: ["Strategy", "Analysis", "Leadership", "Problem Solving"]
            }
        ];
    } else if (iqScore >= 115) {
        return [
            {
                title: "Software Engineer",
                description: "Design and develop sophisticated software solutions and systems.",
                skills: ["Programming", "Problem Solving", "System Design", "Analytics"]
            },
            {
                title: "Financial Analyst",
                description: "Analyze complex financial data and provide strategic investment advice.",
                skills: ["Analysis", "Finance", "Statistics", "Research"]
            },
            {
                title: "Project Manager",
                description: "Lead and coordinate complex projects across multiple teams and disciplines.",
                skills: ["Leadership", "Organization", "Communication", "Planning"]
            }
        ];
    } else if (iqScore >= 100) {
        return [
            {
                title: "Business Administrator",
                description: "Manage business operations and implement organizational strategies.",
                skills: ["Management", "Organization", "Communication", "Planning"]
            },
            {
                title: "Marketing Specialist",
                description: "Develop and execute marketing strategies for products and services.",
                skills: ["Marketing", "Communication", "Creativity", "Analysis"]
            },
            {
                title: "Healthcare Professional",
                description: "Provide patient care and support in various healthcare settings.",
                skills: ["Patient Care", "Communication", "Technical Skills", "Teamwork"]
            }
        ];
    } else {
        return [
            {
                title: "Skilled Technician",
                description: "Perform specialized technical work and maintenance in various fields.",
                skills: ["Technical", "Practical", "Problem Solving", "Attention to Detail"]
            },
            {
                title: "Customer Service Specialist",
                description: "Provide excellent customer support and problem resolution.",
                skills: ["Communication", "Problem Solving", "Patience", "Organization"]
            },
            {
                title: "Administrative Assistant",
                description: "Support office operations and maintain organizational efficiency.",
                skills: ["Organization", "Communication", "Multi-tasking", "Attention to Detail"]
            }
        ];
    }
}

