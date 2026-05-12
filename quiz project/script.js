/* ═══════════════════════════════════════════════════════════
   PROCTORX — ONLINE EXAM SYSTEM  |  script.js  v2.0

   ANTI-CHEAT EVENTS (each = 1 violation):
   ─ Tab switch  (visibilitychange → hidden)
   ─ Window blur (switch to another app/window)
   ─ Fullscreen exit

   LOGIC:
   ─ 1st  → Orange warning, student dismisses
   ─ 2nd  → FULL BLOCK + continuous alarm (examiner PIN needed)
   ─ 3rd+ → Auto-submit immediately
═══════════════════════════════════════════════════════════ */
"use strict";

/* ══ 1. DEFAULT QUESTION BANK ══════════════════════════════ */
let examQuestions = [
  {id:1, question:"What does HTML stand for?",options:["Hyper Text Markup Language","High Text Machine Language","Hyper Tool Multi Language","None of these"],correct:0},
  {id:2, question:"Which CSS property changes text color?",options:["font-color","text-color","color","foreground-color"],correct:2},
  {id:3, question:"Which language is called 'language of the web'?",options:["Python","Java","JavaScript","C++"],correct:2},
  {id:4, question:"What does CSS stand for?",options:["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"],correct:1},
  {id:5, question:"Which data structure follows FIFO principle?",options:["Stack","Array","Queue","Linked List"],correct:2},
  {id:6, question:"Correct way to declare variable in JavaScript (ES6+)?",options:["variable x = 5;","var x = 5;","let x = 5;","v x = 5;"],correct:2},
  {id:7, question:"Which is NOT a valid HTTP method?",options:["GET","POST","FETCH","DELETE"],correct:2},
  {id:8, question:"Binary 1010 equals decimal?",options:["8","10","12","14"],correct:1},
  {id:9, question:"What does API stand for?",options:["Application Program Interface","Application Programming Interface","Applied Programming Interface","Automated Program Interface"],correct:1},
  {id:10,question:"Which HTML tag links an external CSS file?",options:["<style>","<css>","<link>","<stylesheet>"],correct:2}
];

/* ══ 2. EXAM CONFIG ═════════════════════════════════════════ */
let EXAM_CONFIG = {
  title:        "Computer Science Fundamentals",
  totalTime:    30 * 60,
  passPercent:  60,
  examinerPin:  "1234",
  instructions: "Do not switch tabs or windows. Stay in fullscreen. Any violation triggers alarm & examiner unlock."
};

/* ══ 3. EXAMINER PANEL STATE ════════════════════════════════ */
let examinerQuestions = [...examQuestions];

/* ══ 4. EXAM STATE ══════════════════════════════════════════ */
let state = {
  currentQ:0, answers:[], timeLeft:0, timerInterval:null,
  violationCount:0, examActive:false, examSubmitted:false,
  examBlocked:false, alarmInterval:null, blurCooldown:false
};

/* ══ 5. ALARM SYSTEM ════════════════════════════════════════ */
let alarmCtx = null;

function startContinuousAlarm() {
  stopContinuousAlarm();
  function playOnce() {
    try {
      if (!alarmCtx || alarmCtx.state === 'closed')
        alarmCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (alarmCtx.state === 'suspended') alarmCtx.resume();
      const freqs = [1047,784,1047,784,1319,784];
      let t = alarmCtx.currentTime;
      freqs.forEach(freq => {
        const osc = alarmCtx.createOscillator(), gain = alarmCtx.createGain();
        osc.connect(gain); gain.connect(alarmCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t); osc.stop(t + 0.25); t += 0.27;
      });
    } catch(e){}
  }
  playOnce();
  state.alarmInterval = setInterval(playOnce, 2200);
}

function stopContinuousAlarm() {
  if (state.alarmInterval) { clearInterval(state.alarmInterval); state.alarmInterval = null; }
}

/* ══ 6. ANTI-CHEAT CORE ════════════════════════════════════ */
function handleViolation(type) {
  if (!state.examActive || state.examSubmitted || state.examBlocked) return;
  state.violationCount++;
  updateViolationPips();
  if (state.violationCount === 1) showWarning(type);
  else if (state.violationCount === 2) blockExamWithAlarm(type);
  else submitExam(true, 'cheat');
}

/* Tab switch */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  state.blurCooldown = true;
  setTimeout(() => { state.blurCooldown = false; }, 600);
  handleViolation('tab');
});

/* Window blur — switch to another app or window */
window.addEventListener('blur', () => {
  if (!state.examActive || state.examSubmitted || state.examBlocked) return;
  if (state.blurCooldown || document.hidden) return;
  handleViolation('window');
});

/* Fullscreen exit */
document.addEventListener('fullscreenchange', () => {
  if (!state.examActive || state.examSubmitted || state.examBlocked) return;
  if (!document.fullscreenElement) handleViolation('fullscreen');
});

/* Keyboard blocking */
document.addEventListener('keydown', e => {
  if (!state.examActive) return;
  if (e.key === 'F12') { e.preventDefault(); return; }
  if ((e.ctrlKey||e.metaKey) && ['c','v','x','a','u','s','p'].includes(e.key.toLowerCase())) e.preventDefault();
  if (e.altKey) e.preventDefault();
});
document.addEventListener('contextmenu', e => { if (state.examActive) e.preventDefault(); });
['copy','paste','cut'].forEach(ev =>
  document.addEventListener(ev, e => { if (state.examActive) e.preventDefault(); })
);

function updateViolationPips() {
  [document.getElementById('pip1'), document.getElementById('pip2')].forEach((p,i) => {
    if (p) p.classList.toggle('active', i < state.violationCount);
  });
}

/* ══ 7. WARNING & BLOCK ═════════════════════════════════════ */
const WARNING_COPY = {
  tab:        { title:'Tab Switch Detected',    msg:'You navigated away from the exam tab. This is your first and only warning. A second violation will lock your exam.' },
  window:     { title:'Window Switch Detected', msg:'You switched to another application window. This is your first and only warning. A second violation will lock your exam.' },
  fullscreen: { title:'Fullscreen Exited',      msg:'You exited fullscreen mode. Exams must remain in fullscreen. Another violation will lock your exam immediately.' }
};

function showWarning(type) {
  const copy = WARNING_COPY[type] || WARNING_COPY.tab;
  document.getElementById('warningTitle').textContent   = copy.title;
  document.getElementById('warningMessage').textContent = copy.msg;
  document.getElementById('warningBadge').textContent   = 'Warning 1 of 2 — Last Chance';
  document.getElementById('warningOverlay').classList.remove('hidden');
}

document.getElementById('warningDismiss').addEventListener('click', () => {
  document.getElementById('warningOverlay').classList.add('hidden');
});

const BLOCK_COPY = {
  tab:        'You switched tabs a second time. The exam is now locked.',
  window:     'You switched to another window a second time. The exam is now locked.',
  fullscreen: 'You exited fullscreen a second time. The exam is now locked.'
};

function blockExamWithAlarm(type) {
  state.examBlocked = true;
  document.getElementById('cheatMsg').textContent   = BLOCK_COPY[type] || BLOCK_COPY.tab;
  document.getElementById('cheatBadge').textContent = type === 'tab' ? '2nd Violation — Tab Switch'
    : type === 'window' ? '2nd Violation — Window Switch' : '2nd Violation — Fullscreen Exit';
  document.getElementById('examinerPinInput').value = '';
  document.getElementById('pinError').classList.add('hidden');
  document.getElementById('cheatBlockOverlay').classList.remove('hidden');
  startContinuousAlarm();
}

/* Examiner unlock */
document.getElementById('examinerUnlockBtn').addEventListener('click', () => {
  const pin = document.getElementById('examinerPinInput').value.trim();
  if (pin === EXAM_CONFIG.examinerPin) {
    stopContinuousAlarm();
    document.getElementById('cheatBlockOverlay').classList.add('hidden');
    state.examBlocked = false;
    document.getElementById('pinError').classList.add('hidden');
    document.getElementById('warningTitle').textContent   = 'Exam Unlocked by Examiner';
    document.getElementById('warningMessage').textContent = 'The examiner has reviewed the violation and unlocked your exam. Any further violation will auto-submit your paper immediately.';
    document.getElementById('warningBadge').textContent   = 'Final Warning — Next Violation = Auto-Submit';
    document.getElementById('warningOverlay').classList.remove('hidden');
  } else {
    document.getElementById('pinError').classList.remove('hidden');
    document.getElementById('examinerPinInput').value = '';
    document.getElementById('examinerPinInput').focus();
    const box = document.querySelector('.pin-row');
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    setTimeout(() => box.classList.remove('shake'), 500);
  }
});
document.getElementById('examinerPinInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('examinerUnlockBtn').click();
});

/* ══ 8. TIMER ═══════════════════════════════════════════════ */
function startTimer() {
  state.timeLeft = EXAM_CONFIG.totalTime;
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    if (state.examBlocked) return;
    state.timeLeft--;
    updateTimerDisplay();
    updateTimerBar();
    const pct = state.timeLeft / EXAM_CONFIG.totalTime;
    const td  = document.getElementById('timerDisplay');
    td.classList.remove('warning','danger');
    if (pct <= 0.1) td.classList.add('danger');
    else if (pct <= 0.25) td.classList.add('warning');
    if (state.timeLeft <= 0) { clearInterval(state.timerInterval); submitExam(false,'timeout'); }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timeLeft/60).toString().padStart(2,'0');
  const s = (state.timeLeft%60).toString().padStart(2,'0');
  const el = document.getElementById('timerDisplay');
  if (el) el.textContent = `${m}:${s}`;
}

function updateTimerBar() {
  const pct = (state.timeLeft / EXAM_CONFIG.totalTime) * 100;
  const bar = document.getElementById('timerBar');
  if (!bar) return;
  bar.style.width = `${pct}%`;
  if (pct <= 10) bar.style.background = 'linear-gradient(90deg,#ff3d71,#ff6b9d)';
  else if (pct <= 25) bar.style.background = 'linear-gradient(90deg,#ff9f00,#ffcc00)';
  else bar.style.background = 'linear-gradient(90deg,var(--accent),var(--accent2))';
}

/* ══ 9-11. QUESTION RENDERING + PALETTE + NAV ═══════════════ */
const LETTERS = ['A','B','C','D'];

function renderQuestion(index) {
  const q = examQuestions[index];
  state.currentQ = index;
  document.getElementById('qBadge').textContent          = `Q${index+1}`;
  document.getElementById('questionCounter').textContent = `Question ${index+1} of ${examQuestions.length}`;
  document.getElementById('questionText').textContent    = q.question;

  const answered = state.answers.filter(a=>a!==null).length;
  const pct = Math.round((answered/examQuestions.length)*100);
  document.getElementById('progressBar').style.width     = `${pct}%`;
  document.getElementById('progressPercent').textContent = `${pct}%`;

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const lbl = document.createElement('label');
    lbl.className = 'option-label'; lbl.dataset.idx = i;
    if (state.answers[index] === i) lbl.classList.add('selected');
    lbl.innerHTML = `<input type="radio" name="opt_${index}" value="${i}" ${state.answers[index]===i?'checked':''}>
      <span class="option-letter">${LETTERS[i]}</span>
      <span class="option-text">${opt}</span>`;
    lbl.addEventListener('click', () => selectAnswer(index, i));
    grid.appendChild(lbl);
  });

  document.getElementById('prevBtn').disabled = (index===0);
  const isLast = index === examQuestions.length-1;
  document.getElementById('nextBtn').innerHTML = isLast
    ? `Review <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`
    : `Next <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  updatePalette();
}

function selectAnswer(qIndex, optIndex) {
  state.answers[qIndex] = optIndex;
  document.querySelectorAll('.option-label').forEach(l=>l.classList.remove('selected'));
  document.querySelector(`.option-label[data-idx="${optIndex}"]`)?.classList.add('selected');
  const answered = state.answers.filter(a=>a!==null).length;
  const pct = Math.round((answered/examQuestions.length)*100);
  document.getElementById('progressBar').style.width     = `${pct}%`;
  document.getElementById('progressPercent').textContent = `${pct}%`;
  updatePalette();
}

function buildPalette() {
  const grid = document.getElementById('paletteGrid');
  grid.innerHTML = '';
  examQuestions.forEach((_,i) => {
    const btn = document.createElement('button');
    btn.className='palette-btn'; btn.textContent=i+1; btn.dataset.idx=i;
    btn.addEventListener('click', () => renderQuestion(i));
    grid.appendChild(btn);
  });
}

function updatePalette() {
  document.querySelectorAll('.palette-btn').forEach((btn,i) => {
    btn.classList.remove('answered','current');
    if (i===state.currentQ) btn.classList.add('current');
    else if (state.answers[i]!==null) btn.classList.add('answered');
  });
}

document.getElementById('prevBtn').addEventListener('click', () => {
  if (state.currentQ>0) renderQuestion(state.currentQ-1);
});
document.getElementById('nextBtn').addEventListener('click', () => {
  if (state.currentQ<examQuestions.length-1) renderQuestion(state.currentQ+1);
});

/* ══ 12. SUBMIT ══════════════════════════════════════════════ */
document.getElementById('submitBtn').addEventListener('click', () => {
  const unanswered = state.answers.filter(a=>a===null).length;
  if (unanswered>0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
  submitExam(false,'manual');
});

function submitExam(forced, reason) {
  if (state.examSubmitted) return;
  state.examSubmitted=true; state.examActive=false;
  clearInterval(state.timerInterval);
  stopContinuousAlarm();
  try { if(document.fullscreenElement) document.exitFullscreen(); } catch(e){}
  document.getElementById('warningOverlay').classList.add('hidden');
  document.getElementById('cheatBlockOverlay').classList.add('hidden');
  const results = calculateResults();
  showScreen('resultScreen');
  renderResults(results, forced, reason);
}

/* ══ 13. RESULTS ════════════════════════════════════════════ */
function calculateResults() {
  let correct=0,wrong=0,skipped=0;
  examQuestions.forEach((q,i)=>{
    if(state.answers[i]===null) skipped++;
    else if(state.answers[i]===q.correct) correct++;
    else wrong++;
  });
  const percentage = Math.round((correct/examQuestions.length)*100);
  return { correct, wrong, skipped, percentage, passed: percentage>=EXAM_CONFIG.passPercent };
}

function renderResults(results, forced) {
  const {correct,wrong,skipped,percentage,passed} = results;
  document.getElementById('resultIcon').textContent    = forced?'🚨':(passed?'🏆':'📋');
  document.getElementById('resultStatus').textContent  = forced?'AUTO-SUBMITTED':(passed?'PASS':'FAIL');
  document.getElementById('resultStatus').className    = `result-status ${passed?'pass':'fail'}`;
  document.getElementById('resultScore').textContent   = `${percentage}%`;
  document.getElementById('statTotal').textContent     = examQuestions.length;
  document.getElementById('statCorrect').textContent   = correct;
  document.getElementById('statWrong').textContent     = wrong;
  document.getElementById('statSkipped').textContent   = skipped;
  document.getElementById('vsText').textContent        =
    `${state.violationCount} integrity ${state.violationCount===1?'violation':'violations'} recorded`;

  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  examQuestions.forEach((q,i)=>{
    const userAns=state.answers[i], isCorrect=userAns===q.correct, isSkipped=userAns===null;
    const div = document.createElement('div');
    div.className=`review-item ${isSkipped?'skip-item':isCorrect?'correct-item':'wrong-item'}`;
    div.innerHTML=`
      <span class="review-num">Q${i+1}</span>
      <div class="review-content">
        <div class="review-q">${q.question}</div>
        <div class="review-answers">
          <span class="review-correct">✓ ${q.options[q.correct]}</span>
          ${!isSkipped&&!isCorrect?`<span class="review-yours">✗ Your answer: ${q.options[userAns]}</span>`:''}
          ${isSkipped?`<span style="color:var(--orange)">⊘ Not answered</span>`:''}
        </div>
      </div>
      <span class="review-result">${isSkipped?'⊘':isCorrect?'✅':'❌'}</span>`;
    list.appendChild(div);
  });
}

/* ══ 14. START EXAM ═════════════════════════════════════════ */
document.getElementById('startBtn').addEventListener('click', () => {
  try { const el=document.documentElement; (el.requestFullscreen||el.webkitRequestFullscreen).call(el); } catch(e){}
  setTimeout(startExam, 350);
});

function startExam() {
  state = {
    currentQ:0, answers:new Array(examQuestions.length).fill(null),
    timeLeft:EXAM_CONFIG.totalTime, timerInterval:null,
    violationCount:0, examActive:true, examSubmitted:false,
    examBlocked:false, alarmInterval:null, blurCooldown:false
  };
  updateViolationPips(); buildPalette(); renderQuestion(0);
  showScreen('examScreen');
  const tb = document.getElementById('timerBar');
  if(tb) tb.style.width='100%';
  startTimer();
}

/* ══ 15. RETAKE / HOME ════════════════════════════════════════ */
document.getElementById('retakeBtn').addEventListener('click', ()=>showScreen('startScreen'));
document.getElementById('backHomeFromResult').addEventListener('click', ()=>showScreen('homeScreen'));
document.getElementById('backToHomeFromStart').addEventListener('click', ()=>showScreen('homeScreen'));

/* ══ 16. EXAMINER PANEL ════════════════════════════════════════ */
document.getElementById('roleExaminer').addEventListener('click', ()=>{showScreen('examinerScreen');refreshPreview();});
document.getElementById('roleStudent').addEventListener('click', ()=>{populateStartScreen();showScreen('startScreen');});
document.getElementById('backToHomeBtn').addEventListener('click', ()=>showScreen('homeScreen'));

document.querySelectorAll('.ex-nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.ex-nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.ex-tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    if(tabId==='preview') refreshPreview();
  });
});

document.getElementById('saveSettingsBtn').addEventListener('click', ()=>{
  const title=document.getElementById('examTitle').value.trim();
  const pin=document.getElementById('examPin').value.trim();
  if(!title){alert('Please enter an exam title.');return;}
  if(!pin||pin.length<3){alert('PIN must be at least 3 characters.');return;}
  EXAM_CONFIG.title       = title;
  EXAM_CONFIG.totalTime   = (parseInt(document.getElementById('examDuration').value)||30)*60;
  EXAM_CONFIG.passPercent = parseInt(document.getElementById('examPass').value)||60;
  EXAM_CONFIG.examinerPin = pin;
  EXAM_CONFIG.instructions= document.getElementById('examInstructions').value.trim();
  const msg=document.getElementById('settingsSaved');
  msg.classList.remove('hidden');
  setTimeout(()=>msg.classList.add('hidden'),2500);
});

document.getElementById('addQBtn').addEventListener('click', ()=>{
  const qText=document.getElementById('newQText').value.trim();
  const optA=document.getElementById('optA').value.trim();
  const optB=document.getElementById('optB').value.trim();
  const optC=document.getElementById('optC').value.trim();
  const optD=document.getElementById('optD').value.trim();
  const corr=parseInt(document.getElementById('correctAns').value);
  if(!qText||!optA||!optB||!optC||!optD){alert('Please fill in question and all 4 options.');return;}
  examinerQuestions.push({id:examinerQuestions.length+1,question:qText,options:[optA,optB,optC,optD],correct:corr});
  ['newQText','optA','optB','optC','optD'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('correctAns').value='0';
  renderQuestionsList();
});

document.getElementById('clearAllQBtn').addEventListener('click', ()=>{
  if(confirm('Remove all questions? This cannot be undone.')){examinerQuestions=[];renderQuestionsList();}
});

function renderQuestionsList() {
  const list=document.getElementById('questionsList');
  const counter=document.getElementById('qListCount');
  list.innerHTML='';
  counter.textContent=`${examinerQuestions.length} question${examinerQuestions.length!==1?'s':''}`;
  if(examinerQuestions.length===0){
    list.innerHTML=`<div class="q-list-empty">No questions yet. Add your first question above.</div>`;
    return;
  }
  examinerQuestions.forEach((q,i)=>{
    const div=document.createElement('div');
    div.className='q-item';
    div.innerHTML=`
      <div class="q-item-content">
        <div class="q-item-num">Q${i+1}</div>
        <div class="q-item-text">${q.question}</div>
        <div class="q-item-opts">
          ${q.options.map((o,oi)=>`<span class="q-item-opt ${oi===q.correct?'correct':''}">${LETTERS[oi]}: ${o}${oi===q.correct?' ✓':''}</span>`).join('')}
        </div>
      </div>
      <button class="btn-del-q" data-idx="${i}" title="Delete">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>`;
    list.appendChild(div);
  });
  list.querySelectorAll('.btn-del-q').forEach(btn=>{
    btn.addEventListener('click',()=>{examinerQuestions.splice(parseInt(btn.dataset.idx),1);renderQuestionsList();});
  });
}

function refreshPreview() {
  document.getElementById('pvTitle').textContent    = EXAM_CONFIG.title||'—';
  document.getElementById('pvDuration').textContent = `${Math.round(EXAM_CONFIG.totalTime/60)} min`;
  document.getElementById('pvQCount').textContent   = examinerQuestions.length;
  document.getElementById('pvPass').textContent     = `${EXAM_CONFIG.passPercent}%`;
  document.getElementById('pvPin').textContent      = '•'.repeat(EXAM_CONFIG.examinerPin.length);
  const pList=document.getElementById('previewQList');
  pList.innerHTML='';
  examinerQuestions.forEach((q,i)=>{
    const div=document.createElement('div');
    div.className='preview-q-item';
    div.innerHTML=`<strong>Q${i+1}</strong> ${q.question} <span class="pq-ans">${LETTERS[q.correct]}</span>`;
    pList.appendChild(div);
  });
}

document.getElementById('launchExamBtn').addEventListener('click', ()=>{
  if(examinerQuestions.length===0){document.getElementById('previewWarning').classList.remove('hidden');return;}
  document.getElementById('previewWarning').classList.add('hidden');
  examQuestions=[...examinerQuestions];
  populateStartScreen();
  showScreen('startScreen');
});

function populateStartScreen() {
  const titleEl=document.getElementById('startTitleEl');
  if(titleEl){
    const parts=EXAM_CONFIG.title.split(' '), half=Math.ceil(parts.length/2);
    titleEl.innerHTML=`${parts.slice(0,half).join(' ')}<br/><span>${parts.slice(half).join(' ')}</span>`;
  }
  const qEl=document.getElementById('infoQCount');
  const dEl=document.getElementById('infoDuration');
  const pEl=document.getElementById('infoPass');
  if(qEl) qEl.textContent=examQuestions.length;
  if(dEl) dEl.textContent=`${Math.round(EXAM_CONFIG.totalTime/60)} Min`;
  if(pEl) pEl.textContent=`${EXAM_CONFIG.passPercent}%`;
  const instrEl=document.getElementById('instructionsContent');
  if(instrEl){
    const lines=EXAM_CONFIG.instructions.split('\n').filter(l=>l.trim());
    instrEl.innerHTML=`<ul>${lines.map(l=>`<li>${l}</li>`).join('')}</ul>`;
  }
}

/* ══ 17. SCREEN SWITCHER ════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.style.display='none';});
  const target=document.getElementById(id);
  target.style.display='flex'; void target.offsetWidth; target.classList.add('active');
}

/* ══ 18. INIT ════════════════════════════════════════════════ */
(function init(){
  document.querySelectorAll('.screen').forEach(s=>{s.style.display='none';});
  const home=document.getElementById('homeScreen');
  home.style.display='flex'; home.classList.add('active');
  renderQuestionsList();
  console.log('%c🔒 ProctorX v2.0','color:#00e5ff;font-weight:bold;font-size:14px');
  console.log('%cMonitors: Tab Switch + Window Blur + Fullscreen Exit','color:#00d68f');
  console.log('%cExaminer PIN: 1234  |  Change in Settings','color:#ff9f00');
})();