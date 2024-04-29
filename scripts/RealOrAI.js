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

let previousTime = 0;

function checkAchievements() {
  let elapsedTime = (Date.now() - startTime) / 1000;

  const targetTimes = {
    1: "Rizzler",
    2: "Sigma",
    3: "Super Sigma",
    5: "Alpha",
    10: "Hacks",
    15: "Kai Cenat",
    60: "Juan."
  };

  // Note: proably better if this is based off the text (or what it should be using a var), to stop not getting achievement when you should
  Object.entries(targetTimes).forEach(([time, title]) => {
    const targetTime = parseFloat(time);
    if (Math.abs(elapsedTime - targetTime) < 0.017 && elapsedTime > previousTime) {
      document.getElementById("stopwatch").textContent = `${targetTime}.00s`
      unlockAchievement(`${title}`, `Achieve a time of ${targetTime}.00s`);
      previousTime = elapsedTime;
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
