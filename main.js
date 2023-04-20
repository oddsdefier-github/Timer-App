let timeDisplay = document.getElementById("time");
let startBtn = document.getElementById("start");
let inputDuration = document.getElementById("duration");
let timerElement = document.getElementById("timer")
let clockElement = document.getElementById("clock");

function displayCurrentTime() {
    const now = new Date();

    // Format the time as HH:MM:SS
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // Update the clock display
    clockElement.textContent = time;
}
setInterval(displayCurrentTime, 1000)


let timer;


function startTimer() {
    clearInterval(timer)
    const duration = parseInt(inputDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
    let remainingTime = duration;

    timer = setInterval(() => {

        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        remainingTime -= 1000;

        if (remainingTime < 0) {
            clearInterval(timer);
            timerElement.innerHTML = "0:00";
        }

    }, 1000)

}
startBtn.addEventListener("click", startTimer);
