// --- 1. መሠረታዊ ተለዋዋጮች ---
const ADMIN_PASSWORD = "Mertule Mariyam@2026";
let currentExamData = []; 
let currentQuestionIndex = 0;
let userAnswers = {};
let examTimer;
let timeLeft = 3600;

// ናሙና ጥያቄዎች (ሲስተሙ ባዶ እንዳይሆን)
const sampleQuestions = [
    { q: "የመረጡለ ማርያም 2ኛ ደረጃ ትምህርት ቤት የት ይገኛል?", a: "ምስራቅ ጎጃም", b: "ምዕራብ ጎጃም", c: "አዲስ አበባ", d: "ባህር ዳር", correct: "A" },
    { q: "የብሔራዊ ፈተና መለማመጃ አፑን የሰራው ማን ነው?", a: "ዮሐንስ", b: "በረከት ቀናው", c: "ሰለሞን", d: "ካሳሁን", correct: "B" },
    { q: "2 + 2 ስንት ነው?", a: "3", b: "4", c: "5", d: "6", correct: "B" }
];

// --- 2. የገጽ መለዋወጫ (Navigation) - የተስተካከለ ---
function navigateTo(screenId) {
    // ሁሉንም ሴክሽኖች ደብቅ
    document.querySelectorAll('section').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active-screen');
    });
    // የተፈለገውን ገጽ ብቻ አሳይ
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active-screen');
    }
}

// --- 3. የመግቢያ እና አድሚን ሎጂክ ---
function enterAsStudent() {
    navigateTo('field-page');
}

function askAdminPassword() {
    let pass = prompt("የአድሚን ፓስወርድ ያስገቡ፡");
    if (pass === ADMIN_PASSWORD) {
        navigateTo('admin-page');
    } else {
        alert("የተሳሳተ ፓስወርድ!");
    }
}

// --- 4. የትምህርት ዝርዝር ---
const subjectData = {
    natural: [
        { name: 'English', icon: '📖' },
        { name: 'Maths', icon: '🧮' },
        { name: 'Physics', icon: '🔬' },
        { name: 'Chemistry', icon: '⚗️' },
        { name: 'IT', icon: '💻' }
    ],
    social: [
        { name: 'English', icon: '📖' },
        { name: 'Maths', icon: '🧮' },
        { name: 'Geography', icon: '🌍' },
        { name: 'History', icon: '🏛️' },
        { name: 'Economics', icon: '📊' }
    ]
};

function showSubjects(field) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = ''; 
    document.getElementById('field-title').innerText = field === 'natural' ? "Natural Science" : "Social Science";

    subjectData[field].forEach(subj => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.onclick = () => startExamLoad(subj.name);
        card.innerHTML = `
            <div class="subj-icon">${subj.icon}</div>
            <p>${subj.name}</p>
        `;
        container.appendChild(card);
    });
    navigateTo('subject-page');
}

// --- 5. የፈተና መቆጣጠሪያ ---
function startExamLoad(subjectName) {
    currentExamData = sampleQuestions; 
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 3600;
    
    document.getElementById('total-q-num').innerText = currentExamData.length;
    showQuestion(0);
    startTimer();
    navigateTo('exam-page');
}

function showQuestion(index) {
    const q = currentExamData[index];
    document.getElementById('current-q-num').innerText = index + 1;
    document.getElementById('q-text').innerText = q.q;
    
    const optionsHtml = `
        <button class="option-btn ${userAnswers[index] === 'A' ? 'selected' : ''}" onclick="selectOption(${index}, 'A')">A. ${q.a}</button>
        <button class="option-btn ${userAnswers[index] === 'B' ? 'selected' : ''}" onclick="selectOption(${index}, 'B')">B. ${q.b}</button>
        <button class="option-btn ${userAnswers[index] === 'C' ? 'selected' : ''}" onclick="selectOption(${index}, 'C')">C. ${q.c}</button>
        <button class="option-btn ${userAnswers[index] === 'D' ? 'selected' : ''}" onclick="selectOption(${index}, 'D')">D. ${q.d}</button>
    `;
    document.getElementById('options-list').innerHTML = optionsHtml;

    // የ Back ቁልፍ ህግ (እስከ 3 ጥያቄ ወደኋላ መመለስ ይቻላል)
    document.getElementById('prev-btn').disabled = (index === 0);

    if (index === currentExamData.length - 1) {
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('final-submit').classList.remove('hidden');
    } else {
        document.getElementById('next-btn').classList.remove('hidden');
        document.getElementById('final-submit').classList.add('hidden');
    }
}

function selectOption(qIndex, option) {
    userAnswers[qIndex] = option;
    showQuestion(qIndex);
}

function moveNext() {
    if (!userAnswers[currentQuestionIndex]) {
        alert("እባክዎ መጀመሪያ መልስ ይምረጡ!");
        return;
    }
    showQuestion(currentQuestionIndex + 1);
}

function movePrev() {
    showQuestion(currentQuestionIndex - 1);
}

function startTimer() {
    if(examTimer) clearInterval(examTimer);
    examTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(examTimer);
            finishExam();
        } else {
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0'+s : s}`;
        }
    }, 1000);
}

function finishExam() {
    clearInterval(examTimer);
    let score = 0;
    currentExamData.forEach((q, i) => { if (userAnswers[i] === q.correct) score++; });
    document.getElementById('final-score').innerText = score + " / " + currentExamData.length;
    navigateTo('result-page');
}
