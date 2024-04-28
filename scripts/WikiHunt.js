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

// Function to generate random Wikipedia page URLs
function getRandomWikiURL() {
  return "https://en.wikipedia.org/wiki/Special:Random";
}

// Assign random Wikipedia page URLs to the links
document.getElementById("randomLink").href = getRandomWikiURL();

const copyToClipboard = async () => {
  try {
    const element = document.querySelector(".user-select-all");
    await navigator.clipboard.writeText(element.textContent);
    console.log("Text copied to clipboard!");
    // Optional: Display a success message to the user
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Optional: Display an error message to the user
  }
};


document.getElementById("startStopBtn").addEventListener("click", startStop);
