const clockEl  = document.getElementById('clock');
const inputEl  = document.getElementById('alarm-time');
const setBtn   = document.getElementById('set-btn');
const stopBtn  = document.getElementById('stop-btn');
const statusEl = document.getElementById('status');

let alarmTime   = null;
let beepInterval = null;
let audioCtx    = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

function tick() {
  const now = new Date();
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  if (alarmTime && `${hh}:${mm}` === alarmTime && ss === '00') {
    triggerAlarm();
  }
}

function beep() {
  if (!audioCtx) audioCtx = new AudioContext();
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}

function triggerAlarm() {
  document.body.classList.add('ringing');
  statusEl.textContent = '⏰ アラーム！';
  statusEl.className = 'ringing';
  stopBtn.disabled = false;
  setBtn.disabled  = true;
  beepInterval = setInterval(beep, 600);
}

function stopAlarm() {
  clearInterval(beepInterval);
  beepInterval = null;
  alarmTime = null;
  document.body.classList.remove('ringing');
  statusEl.textContent = 'アラーム未設定';
  statusEl.className = '';
  setBtn.disabled  = false;
  stopBtn.disabled = true;
  inputEl.value = '';
}

setBtn.addEventListener('click', () => {
  const val = inputEl.value;
  if (!val) return;
  alarmTime = val;
  statusEl.textContent = `${val} にアラームをセット`;
  statusEl.className = 'active';
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', stopAlarm);

setInterval(tick, 1000);
tick();
