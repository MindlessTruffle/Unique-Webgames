let startTime, timerInterval;
let isRunning = false;
let achievements = [];

function startStop() {
  if (!isRunning) {
    startTimer();
    document.getElementById("startStopBtn").textContent = "Stop";
  } else {
    stopTimer();
    document.getElementById("startStopBtn").textContent = "Start";
    checkAchievements();
  }
}

function startTimer() {
  isRunning = true;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10); // Update every 10 milliseconds for milliseconds display
}

function stopTimer() {
  isRunning = false;
  clearInterval(timerInterval);
}

function updateTimer() {
  let elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
  let seconds = Math.floor(elapsedTime);
  let milliseconds = Math.floor((elapsedTime - seconds) * 100);
  document.getElementById("stopwatch").textContent = seconds + "." + milliseconds.toString().padStart(2, "0") + "s";
}

function checkAchievements() {
  let elapsedTime = (Date.now() - startTime) / 1000;

  const targetTimes = {
    "0.01": "THE FORBIDDEN GYATT",
    "0.10": "lv 1 gyatt",
    "0.20": "lv 2 gyatt",
    "0.30": "lv3 gyatt",
    "1.00": "Rizzler",
    "2.00": "Sigma",
    "3.00": "Super Sigma",
    "3.05": "Level Sam",
    "4.00": "Diddler Tickler",
    "5.00": "Alpha",
    "10.00": "Hacks",
    "15.00": "Kai Cenat",
    "20.00": "Tik Tok Rizz Party Leader",
    "30.00": "Elon Musk",
    "40.00": "Level 100 Gyatt",
    "50.00": "Mr Beast",
    "60.00": "Juan.",
    "69.00": "lmao",
    "3600.00": "😈🤑😈🗣🫄🐺🥵🤓"
  };

  Object.entries(targetTimes).forEach(([time, title]) => {
    const achivedTime = time + "s"
    const targetTime = document.getElementById("stopwatch").textContent
    if (achivedTime === targetTime) {
      unlockAchievement(`${title}`, `Achieve a time of ${targetTime}`);
    }
  });
}

function unlockAchievement(name, description) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    displayAchievement(name, description);
  }
}

function displayAchievement(name, description) {
  let achievementsDiv = document.getElementById("achievements");
  let achievementItem = document.createElement("div");
  achievementItem.classList.add("card", "mb-3");
  achievementItem.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">${description}</p>
    </div>
  `;
  achievementsDiv.appendChild(achievementItem);
}

document.getElementById("startStopBtn").addEventListener("click", startStop);
