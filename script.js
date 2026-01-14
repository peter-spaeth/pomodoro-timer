const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0; // Start full

const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesInput = document.getElementById('minutes-input');
const timerSound = document.getElementById('timer-sound');

let interval;
let totalTime = 25 * 60; // default
let currentTime = totalTime;
let isRunning = false;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimer() {
    currentTime--;
    timeDisplay.textContent = formatTime(currentTime);

    // Calculate progress percentage
    const percent = (currentTime / totalTime) * 100;
    setProgress(percent);

    if (currentTime <= 0) {
        clearInterval(interval);
        isRunning = false;

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        minutesInput.disabled = false;

        currentTime = 0;
        timeDisplay.textContent = "00:00";
        setProgress(0);

        // Play sound
        timerSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function startTimer() {
    if (isRunning) return;

    // Check if we need to start from a fresh state or resume
    if (currentTime === 0) {
        // Reset to input value if it finished
        resetTimer();
        return;
    }

    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    minutesInput.disabled = true;

    interval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(interval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    pauseTimer();
    // Read input
    let mins = parseInt(minutesInput.value);
    if (isNaN(mins) || mins < 1) mins = 25;

    totalTime = mins * 60;
    currentTime = totalTime;

    timeDisplay.textContent = formatTime(currentTime);
    setProgress(100);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
}

// Input change listener
minutesInput.addEventListener('change', () => {
    if (!isRunning) {
        let mins = parseInt(minutesInput.value);
        if (mins < 1) mins = 1;
        if (mins > 999) mins = 999;
        minutesInput.value = mins;

        totalTime = mins * 60;
        currentTime = totalTime;
        timeDisplay.textContent = formatTime(currentTime);
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial set
resetTimer();
