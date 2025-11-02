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
  "Typing is an important skill that helps us in school and work. It makes writing faster and more fun. Practice every day to get better and more confident with your keyboard.",
  "When you learn to type, your hands get used to the keys. Soon, you won’t have to look down at your keyboard. Keep calm and enjoy improving your typing speed.",
  "Typing helps you share your thoughts quickly and clearly. It’s okay to make mistakes, because each one helps you learn. With patience and focus, you can type like a pro in no time."
];

const mediumTexts = [
  "Typing efficiently is about balancing speed and accuracy. It’s better to type slowly and correctly at first, then gradually increase your speed. Consistent practice every day builds muscle memory. Proper finger placement helps reduce errors and hand fatigue. With time, typing will start to feel natural and effortless.",
  "Many people underestimate the value of typing skills in modern life. Whether it’s for writing assignments, chatting online, or coding, typing plays a crucial role. The faster you type, the more productive you can be. Regular exercises, such as retyping articles, can help improve both precision and speed. Remember, even experts once started as beginners.",
  "Developing typing skills is like learning to play a musical instrument. It takes rhythm, consistency, and awareness of your movements. Focusing on form and posture helps prevent strain and boosts efficiency. Typing different types of content—stories, essays, or code—keeps your learning diverse. Over time, you’ll notice how natural typing feels in daily activities."
];

const hardTexts = [
  "Professional typists understand that typing is both an art and a science. They train their fingers to move instinctively, minimizing hesitation between keystrokes. Beyond mere speed, they focus on precision, rhythm, and endurance. Typing complex material such as code, reports, or technical writing challenges their adaptability. A true master typist maintains accuracy under pressure, using mental focus to stay composed. They view each error as feedback rather than failure, continually refining their technique. Regular breaks and ergonomic posture are vital to long-term performance. Ultimately, mastery in typing reflects discipline, patience, and a continuous drive to improve.",
  "As typing evolves into a digital-era essential, professionals seek to optimize not only speed but also efficiency of motion. They learn advanced techniques like touch typing without glancing at the keys. Strategic hand placement reduces movement distance and prevents repetitive stress. High-level typists use peripheral vision to anticipate upcoming words, maintaining fluid rhythm. The challenge increases when switching between languages, symbols, and programming syntax. In such cases, muscle memory alone isn’t enough—mental adaptability becomes key. A typist’s focus resembles a musician’s flow, tuned to cadence and balance. Precision and endurance, cultivated over time, transform typing into a true craft.",
  "Typing at an expert level involves merging technical control with mental composure. The task may seem mechanical, but the underlying process is highly cognitive. Each keystroke reflects an interaction between thought, coordination, and anticipation. Advanced users often train by shadowing difficult passages to boost resilience. Maintaining steady breathing helps reduce tension during long sessions. Overcoming fatigue requires mindfulness and ergonomic awareness. The greatest typists achieve near-symbiotic unity between mind and machine. What begins as practice eventually evolves into instinctive, rhythmic mastery of language and motion."
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
