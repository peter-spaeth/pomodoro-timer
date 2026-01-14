// =========================================
// Global Config & Elements
// =========================================

// SVGCircleElement for the progress ring
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

// Initialize the ring stroke properties
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0; // Start with a full ring

// DOM Elements
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesInput = document.getElementById('minutes-input');
const timerSound = document.getElementById('timer-sound');

// Timer State Variables
let interval;
let totalTime = 25 * 60; // Default time in seconds (25 mins)
let currentTime = totalTime;
let isRunning = false;

/**
 * Updates the SVG ring's stroke-dashoffset to represent progress.
 * @param {number} percent - The percentage of time remaining (0-100).
 */
function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

/**
 * Formats a time in seconds to "MM:SS" string.
 * @param {number} seconds - Time to format.
 * @returns {string} Formatted, zero-padded time string.
 */
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Core loop function called every second.
 * Decrements time, updates UI, checks for completion.
 */
function updateTimer() {
    currentTime--;
    timeDisplay.textContent = formatTime(currentTime);

    // Calculate progress percentage
    const percent = (currentTime / totalTime) * 100;
    setProgress(percent);

    // Check if timer has finished
    if (currentTime <= 0) {
        clearInterval(interval);
        isRunning = false;

        // Update UI logic
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        minutesInput.disabled = false;

        // Ensure visual completion
        currentTime = 0;
        timeDisplay.textContent = "00:00";
        setProgress(0);

        // Trigger completion sound
        timerSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

/**
 * Starts or Resumes the timer.
 */
function startTimer() {
    if (isRunning) return;

    // If starting from 0, reset first
    if (currentTime === 0) {
        resetTimer();
        return;
    }

    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    minutesInput.disabled = true; // Lock input while running

    interval = setInterval(updateTimer, 1000);
}

/**
 * Pauses the timer without resetting.
 */
function pauseTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(interval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

/**
 * Resets the timer to the value defined in the input field.
 */
function resetTimer() {
    pauseTimer();
    // Read user input for duration
    let mins = parseInt(minutesInput.value);
    if (isNaN(mins) || mins < 1) mins = 25;

    // Reset state
    totalTime = mins * 60;
    currentTime = totalTime;

    // Update UI
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
