let startTime, timerInterval, elapsedTime = 0; // Declare elapsedTime globally
let isRunning = false;
let achievements = [];

function startStop() {
  if (!isRunning) {
    startTimer();
    // document.getElementById("startStopBtn").textContent = "Stop";
    document.getElementById("pauseBtn").textContent = " ";
  } else {
    stopTimer();
    // document.getElementById("startStopBtn").textContent = "Start";
    document.getElementById("pauseBtn").textContent = " ";
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

function pauseResume() {
  if (isRunning) {
    pauseTimer();
    // document.getElementById("pauseBtn").textContent = "Resume";
    document.getElementById("pauseBtn").textContent = " ";
  } else {
    resumeTimer();
    // document.getElementById("pauseBtn").textContent = "Pause";
    document.getElementById("pauseBtn").textContent = " ";
  }
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = (Date.now() - startTime) / 1000; // Update elapsedTime when pausing
}

function resumeTimer() {
  isRunning = true;
  startTime = Date.now() - elapsedTime * 1000; // Subtract elapsed time from current time to resume from the same point
  timerInterval = setInterval(updateTimer, 10); // Restart the timer
}

function updateTimer() {
  elapsedTime = (Date.now() - startTime) / 1000; // Update elapsedTime
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
    var articleTitle1 = document.getElementById("articleTitle1").value;
    var articleTitle2 = document.getElementById("articleTitle2").value;
    var findCommandUsed = document.getElementById("findCommandUsed").checked;
    var tabsUsed = document.getElementById("tabsUsed").checked;
    var messageHTML = "<strong>Total Time: </strong> " + elapsedTime + "s" + "<br>" + "<br>" +
                      "<strong>Starting Article:</strong> " + articleTitle1 + "<br>" +
                      "<strong>Target Article:</strong> " + articleTitle2 + "<br>" +
                      "<strong>Backtracking/Tabs Used:</strong> " + (tabsUsed ? "Yes" : "No") + "<br>" +
                      "<strong>Find Command Used:</strong> " + (findCommandUsed ? "Yes" : "No") + "<br>" +
                      "<strong>Play the game and get a time!</strong>";
    var messagePlain = "**Total Time:** " + elapsedTime + "s" + "\n" + "\n" +
                       "**Starting Article:** " + articleTitle1 + "\n" +
                       "**Target Article:** " + articleTitle2 + "\n" +
                       "**Find Command Used:** " + (findCommandUsed ? "Yes" : "No") + "\n" +
                       "**Backtracking/Tabs Used:** " + (findCommandUsed ? "Yes" : "No") + "\n" +
                       "**Play the game and get a time!**" + "\n" +
                       "**https://sammygames.vercel.app/pages/WikiHunt**";
    var messageEmail = "**Total%20Time:**%20" + elapsedTime + "s" + "\n" + "\n" +
       "**Starting%20Article:**%20" + articleTitle1 + "\n" +
       "**Target%20Article:**%20" + articleTitle2 + "\n" +
       "**Find%20Command%20Used:** " + (findCommandUsed ? "Yes" : "No") + "\n" +
       "**Backtracking/Tabs%20Used:** " + (findCommandUsed ? "Yes" : "No") + "\n" +
       "**Play%20the%20game%20and%20get%20a%20time!**" + "\n" +
       "**https://sammygames.vercel.app/pages/WikiHunt**";

    // Update the HTML content of the element
    document.getElementById("copyResultsText").innerHTML = messageHTML;
    document.getElementById("emailBtn").innerHTML = messageEmail;

    // Copy the plain text to clipboard
    await navigator.clipboard.writeText(messagePlain);
    console.log("Text copied to clipboard!");

    // Display toast
    var toast = new bootstrap.Toast(document.getElementById('toast'));
    toast.show();
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Optional: Display an error message to the user
  }
};


document.getElementById("copyResultsBtn").addEventListener("click", copyToClipboard);
document.getElementById("startStopBtn").addEventListener("click", startStop);
document.getElementById("pauseBtn").addEventListener("click", pauseResume);