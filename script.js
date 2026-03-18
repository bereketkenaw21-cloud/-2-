const ADMIN_PASS = "Mertule Mariyam@2026";
let questions = [];
let currentIdx = 0;
let userAnswers = {};
let timer;
let timeLeft = 3600;

// ናሙና ጥያቄዎች
const database = {
    natural: [
        { q: "የኢትዮጵያ ረጅሙ ወንዝ የትኛው ነው?", a: "አባይ", b: "ዋቢ ሸበሌ", c: "አዋሽ", d: "ገናሌ", r: "A" },
        { q: "ብርሃን በሰከንድ ስንት ኪሎሜትር ይጓዛል?", a: "300,000", b: "150,000", c: "500,000", d: "1,000,000", r: "A" }
    ],
    social: [
        { q: "የኢትዮጵያ ዋና ከተማ ማን ናት?", a: "ጎንደር", b: "አክሱም", c: "አዲስ አበባ", d: "ሀዋሳ", r: "C" }
    ]
};

function navigateTo(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function askAdminPassword() {
    let p = prompt("Password ያስገቡ:");
    if (p === ADMIN_PASS) navigateTo('admin-page');
    else alert("ስህተት!");
}

function showSubjects(field) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = "";
    document.getElementById('field-title').innerText = field.toUpperCase();
    
    const subs = field === 'natural' ? 
        ['English', 'Maths', 'Physics', 'Chemistry', 'Biology'] : 
        ['English', 'Maths', 'History', 'Geography', 'Economics'];

    subs.forEach(s => {
        const div = document.createElement('div');
        div.className = "card";
        div.innerText = s;
        div.onclick = () => startExam(field);
        container.appendChild(div);
    });
    navigateTo('subject-page');
}

function startExam(field) {
    questions = database[field];
    currentIdx = 0;
    userAnswers = {};
    timeLeft = 3600;
    showQuestion();
    startTimer();
    navigateTo('exam-page');
}

function showQuestion() {
    const q = questions[currentIdx];
    document.getElementById('q-text').innerText = q.q;
    document.getElementById('q-count').innerText = `ጥያቄ ${currentIdx + 1}/${questions.length}`;
    
    const container = document.getElementById('options-list');
    container.innerHTML = `
        <button class="option-btn ${userAnswers[currentIdx]=='A'?'selected':''}" onclick="select('A')">A. ${q.a}</button>
        <button class="option-btn ${userAnswers[currentIdx]=='B'?'selected':''}" onclick="select('B')">B. ${q.b}</button>
        <button class="option-btn ${userAnswers[currentIdx]=='C'?'selected':''}" onclick="select('C')">C. ${q.c}</button>
        <button class="option-btn ${userAnswers[currentIdx]=='D'?'selected':''}" onclick="select('D')">D. ${q.d}</button>
    `;

    document.getElementById('prev-btn').style.visibility = (currentIdx === 0) ? "hidden" : "visible";
    
    if (currentIdx === questions.length - 1) {
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        document.getElementById('next-btn').classList.remove('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }
}

function select(ans) {
    userAnswers[currentIdx] = ans;
    showQuestion();
}

function moveNext() {
    if (!userAnswers[currentIdx]) return alert("እባክዎ መልስ ይምረጡ!");
    currentIdx++;
    showQuestion();
}

function movePrev() {
    if (currentIdx > 0) {
        currentIdx--;
        showQuestion();
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        document.getElementById('timer').innerText = `ጊዜ: ${m}:${s < 10 ? '0'+s : s}`;
        if (timeLeft <= 0) finishExam();
    }, 1000);
}

function finishExam() {
    clearInterval(timer);
    let score = 0;
    questions.forEach((q, i) => { if (userAnswers[i] === q.r) score++; });
    document.getElementById('final-score').innerText = `${score}/${questions.length}`;
    navigateTo('result-page');
}
