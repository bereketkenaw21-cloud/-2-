// --- 1. መሠረታዊ ተለዋዋጮች ---
const ADMIN_PASSWORD = "Mertule Mariyam@2026";
let currentExamData = []; // ጥያቄዎች እዚህ ይገባሉ
let currentQuestionIndex = 0;
let userAnswers = {};
let examTimer;
let timeLeft = 3600; // 1 ሰዓት በሰከንድ

// PWA: Service Worker ምዝገባ (ኦፍላይን እንዲሰራ)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered', reg))
            .catch(err => console.log('SW Reg Error', err));
    });
}

// --- 2. የገጽ መለዋወጫ (Navigation) ---
function navigateTo(screenId) {
    // ሁሉንም ገጾች ደብቅ
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-screen'));
    // የተፈለገውን ገጽ ብቻ አሳይ
    document.getElementById(screenId).classList.add('active-screen');
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

// --- 4. የትምህርት ዝርዝር (ሳብጀክት) መሙያ ---
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
    container.innerHTML = ''; // የቆየውን አጽዳ
    document.getElementById('field-title').innerText = field === 'natural' ? "Natural Science" : "Social Science";

    subjectData[field].forEach(subj => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.onclick = () => startExamLoad(subj.name); // ፈተና ለመጀመር
        card.innerHTML = `
            <div class="subj-icon">${subj.icon}</div>
            <p>${subj.name}</p>
        `;
        container.appendChild(card);
    });
    navigateTo('subject-page');
}

// --- 5. የፈተና መቆጣጠሪያ ሎጂክ ---

// ናሙና ጥያቄዎች (ለጊዜው - በኋላ በአድሚን ይጫናሉ)
const sampleQuestions = [
    { q: "የኢትዮጵያ ዋና ከተማ ማን ናት?", a: "አዲስ አበባ", b: "ጎንደር", c: "ሀዋሳ", d: "ባህር ዳር", correct: "A" },
    { q: "2 + 2 ስንት ነው?", a: "3", b: "4", c: "5", d: "22", correct: "B" }
];

function startExamLoad(subjectName) {
    // እዚህ ጋር በQR የመጣውን ወይም ሴቭ የተደረገውን ጥያቄ መጫን አለበት
    currentExamData = sampleQuestions; 
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 3600; // ታይመሩን አድስ
    
    document.getElementById('total-q-num').innerText = currentExamData.length;
    showQuestion(0);
    startTimer();
    navigateTo('exam-page');
}

function showQuestion(index) {
    if (index < 0 || index >= currentExamData.length) return;
    
    currentQuestionIndex = index;
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

    // የ Back ቁልፍ መቆጣጠሪያ (ከ 3ኛው ጥያቄ ወደኋላ መመለስ አይቻልም - እንደ ህጉ)
    document.getElementById('prev-btn').disabled = (index === 0);

    // የ Next/Submit ቁልፍ መቆጣጠሪያ
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
    showQuestion(qIndex); // ለማሳየት (Highlight)
}

function moveNext() {
    // ህግ 2፡ መልስ ሳይነኩ Next ማለት አይቻልም
    if (!userAnswers[currentQuestionIndex]) {
        alert("እባክዎ መጀመሪያ መልስ ይምረጡ!");
        return;
    }
    showQuestion(currentQuestionIndex + 1);
}

function movePrev() {
    showQuestion(currentQuestionIndex - 1);
}

// --- 6. ታይመር እና ፈተና ማብቂያ ---
function startTimer() {
    examTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(examTimer);
            alert("ጊዜው አልቋል! ፈተናው ይቆለፋል።");
            finishExam(); // ሰዓት ሲያልቅ በግድ ሰብሚት ያድርግ
        } else {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer-display').innerText = 
                `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        }
    }, 1000);
}

function finishExam() {
    clearInterval(examTimer);
    let score = 0;
    const correctionList = document.getElementById('correction-list');
    correctionList.innerHTML = '';

    currentExamData.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
            score++;
        } else {
            // የተሳሳቱትን ዘርዝር
            const item = document.createElement('p');
            item.innerHTML = `ጥያቄ ${index+1}: ያንተ መልስ (${userAnswers[index] || 'ያልተመለሰ'})፣ ትክክለኛ መልስ (${q.correct})`;
            correctionList.appendChild(item);
        }
    });

    document.getElementById('final-score').innerText = `${score} / ${currentExamData.length}`;
    navigateTo('result-page');
}

// --- 7. የአድሚን ጥያቄ መጫኛ (PDF Parser) ---
function parsePDFText() {
    const text = document.getElementById('pdf-input').value;
    // ይህ በጣም መሠረታዊ ፓርሰር ነው (Regex ይፈልጋል)
    // ለአሁኑ በናሙና ጥያቄዎች እንተካው
    alert("ጽሁፉ ወደ ጥያቄነት ተቀይሯል! (በተግባር Regex ይፈልጋል)");
    console.log(text);
}

// QR Scanner/Generator (ይህ ተጨማሪ ላይብረሪ ይፈልጋል)
function openScanner() { alert("QR ኮድ ስካነር ይከፈታል..."); }
function handleImageUpload() { alert("ፎቶው ወደ ጥያቄነት ይቀየራል (OCR)..."); }
