let startTime, timerInterval;
let isRunning = false;
let achievements = [];
let amtAchievements = 0;
let previousStopwatch = null;
let consecutiveStreak = 0;

const targetTimes = {
  "0.00":
    "Use the contact button in the top bar and tell me how you tell this LOL",
  "0.01": "Singularity",
  "0.05": "Probably an autoclicker",
  "0.10": "Carpel Tunnel",
  "0.20": "Super Speedy",
  "0.30": "Speedy",
  "0.50": "Quick",
  "0.69": "Magoogoo",
  "0.99": "Sucker",
  "1.00": "You can read instructions",
  "2.00": "The more the merrier",
  "3.00": "tree",
  "3.05": "SAM | Surface-to-air missile",
  "4.00": "Silly Billy",
  "4.04": "Error",
  "5.00": "Thats a big number",
  "5.05": "going back",
  "9.11": "nyyyyrommm",
  "9.99": "loser",
  "10.00": "rizz",
  "13.00": "thir tree",
  "15.00": "pirates",
  "20.00": "lead poisening",
  "21.50": "Amount of grams in half a Hersheys Bar",
  "25.00": "Good Job",
  "30.00": "thir tree",
  "40.00": "sponge",
  "42.00": "angry",
  "50.00": "The Goat?",
  "60.00": "Go to the home page and find a new game",
  "69.00": "ararararar",
  "120.00": "WikiHunt is also fun...",
  "420.00": "stellar stuff dude",
  "3600.00": "ok buddy",
};

const consecutiveTargetTimes = {
  "0.25": [2, 3, 4, 5],
  "0.50": [2, 3, 4, 5],
  "1.00": [2, 3, 4, 5],
  "3.00": [2, 3, 4, 5],
  "5.00": [2, 3, 4, 5],
};


function checkConsecutiveAchievements(stopwatch) {
  if (previousStopwatch === stopwatch) {
    consecutiveStreak++;
  } else {
    consecutiveStreak = 1;
    previousStopwatch = stopwatch;
  }

  console.log(consecutiveStreak)
  console.log(previousStopwatch)

  if (consecutiveTargetTimes.hasOwnProperty(stopwatch)) {
    const thresholds = consecutiveTargetTimes[stopwatch];
    thresholds.forEach((threshold) => {
      if (consecutiveStreak === threshold) {
        unlockAchievement(
          `Consecutive Master of ${stopwatch} x${threshold}`,
          `Achieve ${threshold} consecutive times of ${stopwatch}s`
        );
      }
    });
  }
}

function startStop() {
  if (!isRunning) {
    startTimer();
    document.getElementById("startStopBtn").textContent = "Stop";
  } else {
    stopTimer();
    document.getElementById("startStopBtn").textContent = "Start";
    checkAchievements();

    let stopwatch = document.getElementById("stopwatch").textContent;
    checkConsecutiveAchievements(stopwatch.replace("s", ""));
  }

  const restartCheckbox = document.getElementById("restartCheckbox");
  if (restartCheckbox.checked) {
    restartTimer();
  }
}

function restartTimer() {
  stopTimer();
  startTimer();
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
  let stopwatch =
    seconds + "." + milliseconds.toString().padStart(2, "0") + "s";
  document.getElementById("stopwatch").textContent = stopwatch;
}

function checkAchievements() {
  Object.entries(targetTimes).forEach(([time, title]) => {
    const achivedTime = time + "s";
    const targetTime = document.getElementById("stopwatch").textContent;
    if (achivedTime === targetTime) {
      unlockAchievement(`${title}`, `Achieve a time of ${targetTime}`);
    }
  });
}

function loadAchievementCount(amtAchievements) {
  let totalAchievementAmt = Object.keys(targetTimes).length

  console.log(consecutiveTargetTimes);
  for (const [key, value] of Object.entries(consecutiveTargetTimes)) { 
    totalAchievementAmt += value.length
  }

  document.getElementById("achievementCount").innerHTML =
    `<strong>${amtAchievements}/${totalAchievementAmt} Achievements Unlocked</strong>`;
}

function unlockAchievement(name, description) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    displayAchievement(name, description);
    amtAchievements++;
    
    loadAchievementCount(amtAchievements)
  }
}

function displayAchievement(name, description) {
  let achievementsDiv = document.getElementById("achievements");
  let achievementItem = document.createElement("div");
  achievementItem.classList.add("card", "mb-3");
  achievementItem.innerHTML = `
    <div class="card-body">
      <h5 class="card-title"><strong>${name}</strong></h5>
      <p class="card-text">${description}</p>
    </div>
  `;

  // Add the new item to the top
  achievementsDiv.prepend(achievementItem);

  // Add the bounce animation class
  achievementItem.classList.add("bounce");

  // Remove the animation class after it completes
  setTimeout(() => {
    achievementItem.classList.remove("bounce");
  }, 500); // Match the duration of the bounce animation
}

document.getElementById("startStopBtn").addEventListener("click", startStop);

loadAchievementCount(0)

