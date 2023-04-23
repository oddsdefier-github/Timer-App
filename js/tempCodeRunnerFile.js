let timeDisplay = document.getElementById("time");
let startBtn = document.getElementById("start");
let resumeBtn = document.getElementById("resume");
let pauseBtn = document.getElementById("pause");
let slider = document.getElementById("slider");
let sliderDuration = document.getElementById("duration");
let sliderValue = document.getElementById("slider-value");
let timerElement = document.getElementById("timer");
let minElement = document.getElementById("min");
let timeEstimate = document.getElementById("time-estimate");
let clockElement = document.getElementById("clock");
sliderValue.innerHTML = sliderDuration.value;
timerElement.innerHTML = sliderDuration.value;

setInterval(() => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    const time = `${hours}:${minutes} ${amOrPm}`;
    console.log(time)
    clockElement.textContent = time;
}, 0)


let paused = false;
let timer;
let remainingTime;

function startTimer() {
    if (!paused) {
        clearInterval(timer)
        const duration = parseInt(sliderDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
        remainingTime = duration;
        timer = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= 1000;

            if (remainingTime < 0) {
                clearInterval(timer);
                timerElement.innerHTML = "0:00";
                timerElement.innerHTML = "Break time!";

            }
        }, 1000)
    }
}
function estimateTime() {
    timeEstimate.style.display = "block";
    const now = new Date();
    const minToAdd = parseInt(remainingTime);
    const newTime = new Date(now.getTime() + minToAdd);
    console.log(newTime)
    let newHours = newTime.getHours().toString().padStart(2, "0");
    const newMins = newTime.getHours().toString().padStart(2, "0");
    const amOrPm = newHours >= 12 ? 'pm' : 'am';
    newHours = (newHours % 12) || 12;
    const displayTime = `${newHours}:${newMins} ${amOrPm}`;
    console.log(displayTime)
    timeEstimate.innerHTML = `Timer will end at ${displayTime}`;
}

function pauseInterval() {
    clearInterval(timer)
    paused = true;

}

function resumeInterval() {
    paused = false;
    timer = setInterval(() => {
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        remainingTime -= 1000;

        if (remainingTime < 0) {
            clearInterval(timer);
            timerElement.innerHTML = "0:00";
        }
    }, 1000);
}

startBtn.addEventListener("click", function () {
    startTimer();
    estimateTime();
    slider.style.display = "none";
    startBtn.style.display = "none"
    pauseBtn.style.display = "block";
});
resumeBtn.addEventListener("click", function () {
    resumeInterval();
    slider.style.display = "none";
    resumeBtn.style.display = "none";
    pauseBtn.style.display = "block";
    timerElement.classList.remove("text-gray-400")
    minElement.classList.remove("text-gray-300");
});
pauseBtn.addEventListener("click", function () {
    pauseInterval();
    resumeBtn.style.display = "block";
    startBtn.style.display = "none";
    pauseBtn.style.display = "none";
    timerElement.classList.add("text-gray-400");
    minElement.classList.add("text-gray-300");
    slider.style.display = "flex";

});

sliderDuration.oninput = function () {
    clearInterval(timer);
    paused = false;
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    sliderValue.innerHTML = this.value;
    timerElement.innerHTML = this.value;
    if (this.value == 1) {
        minElement.innerHTML = "min"
    } else {
        minElement.innerHTML = "mins"
    }
    timeEstimate.style.display = "none"
}






