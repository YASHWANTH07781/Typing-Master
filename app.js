const displayTextEl = document.getElementById("displayText");
const themeSelector = document.getElementById("themeSelector");
const difficultySelector = document.getElementById("difficultySelector");
const accuracyEl = document.getElementById("accuracy");
const cpsEl = document.getElementById("cps");
const timerEl = document.getElementById("timer");

const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

let currentIndex = 0;
let currentSentence = "";
let correct = 0;
let totalTyped = 0;
let startTime = null;
let timerPaused = true;
let typingStarted = false;
let timerInterval = null;

const easyTexts = [
  "hello world",
  "type faster",
  "keep going",
  "coding rocks",
  "stay sharp",
  "practice makes perfect",
  "typing is fun and helpful",
  "stay consistent and improve",
  "learning every single day",
  "the quick brown fox jumps over the lazy dog"
];

const mediumTexts = [
  "Hello World",
  "Type Faster",
  "Keep Going",
  "Coding Rocks",
  "Stay Sharp",
  "Practice makes perfect",
  "Focus on accuracy and speed",
  "JavaScript powers the web",
  "Consistency is the key to success",
  "Never stop learning new things"
];

const hardTexts = [
  "Hello@World#123!",
  "Typing_is$fun!",
  "Are_you_ready?",
  "Fast&Accurate%",
  "Practice&Perform",
  "Complexity: O(n^2) vs O(n log n)",
  "ReactJS, VueJS, and Angular are popular",
  "Use Ctrl+Shift+Esc to open Task Manager",
  "Optimize algorithms for better performance",
  "Debugging is an essential skill for developers"
];

function renderTextSpans(text) {
  displayTextEl.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    let span = document.createElement("span");
    span.textContent = text[i];
    span.classList.add("char");
    displayTextEl.appendChild(span);
  }
}

function getRandomText(level) {
  if (level === "easy") {
    let txt = easyTexts[Math.floor(Math.random() * easyTexts.length)];
    return Math.random() < 0.5 ? txt.toLowerCase() : txt.toUpperCase();
  }
  if (level === "medium") {
    let txt = mediumTexts[Math.floor(Math.random() * mediumTexts.length)];
    return txt
      .split("")
      .map((c) => (Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()))
      .join("");
  }
  if (level === "hard") {
    return hardTexts[Math.floor(Math.random() * hardTexts.length)];
  }
}

function setupTextForDifficulty(level) {
  currentSentence = getRandomText(level);
  renderTextSpans(currentSentence);
  currentIndex = 0;
  correct = 0;
  totalTyped = 0;
  startTime = null;
  timerPaused = true;
  typingStarted = false;
  clearInterval(timerInterval);
  timerInterval = null;
  timerEl.textContent = "Time: 0.000 s";
  updateStats();
}

function updateStats() {
  let acc = totalTyped === 0 ? 100 : Math.round((correct / totalTyped) * 100);
  accuracyEl.textContent = "Accuracy: " + acc + "%";
  let elapsed =
    startTime && typingStarted ? (Date.now() - startTime) / 1000 : 0;
  let cps = totalTyped && elapsed > 0 ? (totalTyped / elapsed).toFixed(2) : 0;
  cpsEl.textContent = "CPS: " + cps;
}

function startTimer() {
  if (timerInterval || startTime) return;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    if (typingStarted && !timerPaused) {
      let elapsed = (Date.now() - startTime) / 1000;
      timerEl.textContent = "Time: " + elapsed.toFixed(3) + " s";
      updateStats();
    }
  }, 50);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function handleKeyInput(char) {
  if (!typingStarted) {
    typingStarted = true;
    timerPaused = false;
    startTimer();
  }

  if (timerPaused) return;
  if (char === "Backspace" || char.length !== 1) return;
  if (currentIndex >= currentSentence.length) return;

  const expected = currentSentence[currentIndex];
  totalTyped++;

  const span = displayTextEl.children[currentIndex];
  if (!span) return;

  if (char === expected) {
    span.classList.add("correct");
    span.classList.remove("wrong");
    correct++;
  } else {
    span.classList.add("wrong");
    span.classList.remove("correct");
  }

  currentIndex++;
  updateStats();

  if (currentIndex === currentSentence.length) {
    timerPaused = true;
    stopTimer();
  }
}

function flashKey(char) {
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    if (
      key.dataset.key.toLowerCase() === char.toLowerCase() ||
      (char === " " && key.classList.contains("space"))
    ) {
      key.classList.add("active");
      setTimeout(() => key.classList.remove("active"), 150);
    }
  });
}

function onCharClick(e) {
  if (!e.target.classList.contains("char")) return;
  let span = e.target;

  if (span.classList.contains("correct")) {
    span.classList.remove("correct");
    correct--;
    totalTyped--;
    if (currentIndex > 0) currentIndex--;
  } else if (span.classList.contains("wrong")) {
    span.classList.remove("wrong");
    totalTyped--;
    if (currentIndex > 0) currentIndex--;
  }

  updateStats();
}

document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    if (key.disabled) return;
    let char = key.dataset.key;
    if (char === "Backspace") return;
    flashKey(char);
    handleKeyInput(char);
  });
});

document.addEventListener("keydown", (e) => {
  if (["Backspace", "Tab", "CapsLock", "Enter", "Shift"].includes(e.key)) return;
  flashKey(e.key);
  handleKeyInput(e.key);
});

displayTextEl.addEventListener("click", onCharClick);

themeSelector.addEventListener("change", () => {
  document.body.className = themeSelector.value;
});

difficultySelector.addEventListener("change", (e) => {
  setupTextForDifficulty(e.target.value);
});

pauseBtn.addEventListener("click", () => {
  timerPaused = true;
});

stopBtn.addEventListener("click", () => {
  typingStarted = false;
  timerPaused = true;
  clearInterval(timerInterval);
  timerInterval = null;
  for (let span of displayTextEl.children) {
    span.classList.remove("correct", "wrong");
  }
  currentIndex = 0;
  correct = 0;
  totalTyped = 0;
  startTime = null;
  timerEl.textContent = "Time: 0.000 s";
  updateStats();
});

resetBtn.addEventListener("click", () => {
  setupTextForDifficulty(difficultySelector.value);
});

setupTextForDifficulty(difficultySelector.value);
