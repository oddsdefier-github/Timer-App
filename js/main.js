let title = document.getElementById("title");
let timeDisplay = document.getElementById("time");
let startBtn = document.getElementById("start");
let resumeBtn = document.getElementById("resume");
let pauseBtn = document.getElementById("pause");
let startAgain = document.getElementById("start-again");
let slider = document.getElementById("slider");
let sliderDuration = document.getElementById("duration");
let sliderValue = document.getElementById("slider-value");
let box = document.getElementById("box");
let reset = document.getElementById("reset");
let timerElement = document.getElementById("timer");
let minElement = document.getElementById("min");
let timeEstimate = document.getElementById("time-estimate");
let clockElement = document.getElementById("clock");
let finishedTask = document.getElementById("finished-task");

let paused = false;
let timer;
let remainingTime;
let titleInterval;
let estimateInterval;
let task = 0;
sliderValue.innerHTML = sliderDuration.value;
timerElement.innerHTML = sliderDuration.value;

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     e.returnValue = "";
// });


setInterval(() => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    const time = `${hours}:${minutes} ${amOrPm}`;
    clockElement.textContent = time;
}, 0)


function startTimer() {
    paused = false;
    startAgain.style.display = "none";

    if (!paused) {
        clearInterval(timer)
        title.style.display = "block";
        const duration = parseInt(sliderDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
        remainingTime = duration;

        timer = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= 20000;

            if (remainingTime < 0) {
                task++;
                finishedTask.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${task}</span>`;
                console.log(task)
                clearInterval(timer);
                clearInterval(titleInterval)
                timerElement.innerHTML = "Done!";
                pauseBtn.style.display = "none";
                startAgain.style.display = "block";
                title.innerHTML = `<span class="text-blue-600">Congratulations!</span> <br> You're one task ahead.`;
                clearInterval(estimateInterval);
                timeEstimate.innerHTML = "Begin a new task again?";
                minElement.style.display = "none";
            } else if (remainingTime < 59000) {
                minElement.innerHTML = "sec";
            }

        }, 1000)
    }
}


function estimateTime() {
    timeEstimate.style.display = "block";
    paused = false;
    if (!paused) {
        estimateInterval = setInterval(() => {
            const date = new Date();
            const minToAdd = parseInt(remainingTime);
            const newTime = new Date(date.getTime() + minToAdd);
            let newHours = newTime.getHours().toString().padStart(2, "0");
            const newMins = newTime.getMinutes().toString().padStart(2, "0");
            const amOrPm = newHours >= 12 ? 'pm' : 'am';
            newHours = (newHours % 12) || 12;
            const timeEstimated = `${newHours}:${newMins} ${amOrPm}`;
            timeEstimate.innerHTML = `Timer will end at <span class="font-bold">${timeEstimated}</span>`;
        }, 0)
    }
}

function pauseInterval() {
    clearInterval(timer)
    paused = true;
}

function resumeInterval() {
    paused = false;
    title.style.display = "block";
    timer = setInterval(() => {
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        remainingTime -= 20000;

        if (remainingTime < 0) {
            task++;
                finishedTask.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${task}</span>`;
            clearInterval(timer);
            clearInterval(titleInterval)
            timerElement.innerHTML = "Done!";
            pauseBtn.style.display = "none";
            startAgain.style.display = "block";
            title.innerHTML = `<span class="text-blue-600">Congratulations!</span> <br> You're one task ahead.`;
            clearInterval(estimateInterval);
            timeEstimate.innerHTML = "Begin a new task again?";
            minElement.style.display = "none";
        } else if (remainingTime < 60000) {
            minElement.innerHTML = "sec";
        }
    }, 1000);
}

startBtn.addEventListener("click", function () {
    startTimer();
    estimateTime();
    minElement.style.display = "flex";
    slider.style.display = "none";
    startBtn.style.display = "none"
    pauseBtn.style.display = "block";
    reset.style.display = "none";
    titleInterval = setInterval(() => {
        title.innerHTML = `<span class="text-2xl text-gray-600">You're <span class="text-blue-500">${Math.floor(remainingTime / 60 / 1000)} ${Math.floor(remainingTime / 60 / 1000) <= 1 ? 'min' : 'mins'} </span> closer <br> in finishing your <span class="font-extrabold text-gray-900">Capstone</span>!</span>`
    }, 0)
});

pauseBtn.addEventListener("click", function () {
    pauseInterval();
    box.classList.add("shake");
    reset.style.display = "block";
    clearInterval(titleInterval);
    title.innerHTML = `<span class="text-red-500 text-4xl">Paused</span>`;
    slider.style.display = "none";
    resumeBtn.style.display = "block";
    startBtn.style.display = "none";
    pauseBtn.style.display = "none";
    timerElement.classList.add("text-gray-400");
    minElement.classList.add("text-gray-300");
    clearInterval(estimateInterval);
    timeEstimate.style.display = "none";
});

resumeBtn.addEventListener("click", function () {
    resumeInterval();
    reset.style.display = "none";
    box.classList.remove("shake");
    slider.style.display = "none";
    timeEstimate.style.display = "block";
    resumeBtn.style.display = "none";
    pauseBtn.style.display = "block";
    timerElement.classList.remove("text-gray-400")
    minElement.classList.remove("text-gray-300");
    titleInterval = setInterval(() => {
        title.innerHTML = `<span class="text-2xl text-gray-600">You're <span class="text-blue-500">${Math.floor(remainingTime / 60 / 1000)} ${Math.floor(remainingTime / 60 / 1000) <= 1 ? 'min' : 'mins'} </span> closer <br> in finishing your <span class="font-extrabold text-gray-900">Capstone</span>!</span>`
    }, 0)
});
startAgain.addEventListener("click", function () {
    paused = true;
    clearInterval(timer);
    clearInterval(titleInterval);
    title.innerHTML = `Begin <span class="text-blue-600 font-extrabold">new task</span>.`;
    sliderDuration.value = 5;
    sliderValue.innerHTML = sliderDuration.value;
    slider.style.display = "flex";
    timerElement.innerHTML = sliderDuration.value;
    minElement.style.display = "none";
    startBtn.style.display = "none";
    startAgain.style.display = "none";
});


sliderDuration.oninput = function () {
    clearInterval(timer);
    clearInterval(titleInterval);
    paused = true;
    minElement.style.display = "flex";
    startBtn.style.display = "block";
    title.style.display = "block";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    title.innerHTML = `<span class="text-2xl">Setting the timer...</span>`;
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


function resetTimer() {
    slider.style.display = "flex";
    timerElement.innerHTML = "0:00";
    resumeBtn.style.display = "none";
}

reset.addEventListener("click", function () {
    paused = true;
    box.classList.remove("shake");
    resetTimer();
    clearInterval(timer);
    reset.style.display = "none";
    clearInterval(estimateInterval);
    clearInterval(titleInterval);
    title.innerHTML = `<span class="text-2xl text-gray-600"><span class="text-blue-600 font-extrabold">Adjust the slider</span><br> to reset the timer!</span>`;
    timeEstimate.style.display = "none"
});




