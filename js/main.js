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
let isDone = false;
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

const emptyTime = () => {
    isDone = true;
    if (remainingTime < 0) {
        task++;
        finishedTask.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${task}</span>`;
        clearInterval(timer);
        clearInterval(titleInterval);
        clearInterval(estimateInterval);
        remainingTime = parseInt(sliderDuration.value) * 60 * 1000;
        timerElement.innerHTML = "Done!";
        pauseBtn.style.display = "none";
        startAgain.style.display = "block";
        title.innerHTML = `<span class="text-blue-600">Congratulations!</span> <br> You're one task ahead.`;
        timeEstimate.innerHTML = "Begin new task.";
        minElement.style.display = "none";
        canvas.style.display = "flex";
        initConfetti();
        render();
    } else if (remainingTime < 59000) {
        minElement.innerHTML = "sec";
    } else if (remainingTime == 59000) {
        minElement.innerHTML = "min";
    } else {
        minElement.innerHTML = "mins";
    }
}

function startTimer() {
    isDone = false;
    paused = false;
    startAgain.style.display = "none";
    minElement.style.display = "flex";

    if (!paused) {
        clearInterval(timer)
        title.style.display = "block";
        const duration = parseInt(sliderDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
        remainingTime = duration;

        timer = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= 1000;

            emptyTime();

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

function pauseTimer() {
    paused = true;
    clearInterval(timer);
    clearInterval(titleInterval);
    clearInterval(estimateInterval);
    box.classList.add("shake");
    title.innerHTML = `<span class="text-red-500 text-4xl">Paused</span>`;
    slider.style.display = "none";
    timeEstimate.style.display = "none";
    startBtn.style.display = "none";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "block";
    reset.style.display = "block";
    timerElement.classList.add("text-gray-400");
    minElement.classList.add("text-gray-300");
}

function resumeTimer() {
    paused = false;
    if (!paused) {
        clearInterval(timer)
        title.style.display = "block";
        const duration = parseInt(sliderDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
        remainingTime = duration;

        timer = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= 1000;

            emptyTime();

        }, 1000)
    }
}

function checkMin() {
    if (remainingTime < 59000) {
        minElement.innerHTML = "sec";
    } else if (remainingTime == 60000) {
        minElement.innerHTML = "min";
    } else {
        minElement.innerHTML = "mins";
    }
    if (sliderDuration.value == 1) {
        minElement.innerHTML = "min";
    } else if (sliderDuration.value < 1) {
        minElement.innerHTML = "sec";
    } else {
        minElement.innerHTML = "mins";
    }
}
function titleDisplay() {
    titleInterval = setInterval(() => {
        title.innerHTML = `<span class="text-2xl text-gray-600">You're <span class="text-blue-500">${Math.round(remainingTime / 60 / 1000)} ${Math.floor(remainingTime / 60 / 1000) <= 1 ? 'min' : 'mins'} </span> closer <br> in finishing your <span class="font-extrabold text-gray-900">Capstone</span>!</span>`
    }, 0);
}

function startAgainTimer() {
    paused = true;
    checkMin();
    clearInterval(timer);
    clearInterval(titleInterval);
    title.innerHTML = `Begin <span class="text-blue-600 font-extrabold">new task</span>.`;
    sliderDuration.value = 5;
    sliderValue.innerHTML = sliderDuration.value;
    slider.style.display = "flex";
    timerElement.innerHTML = `<span class="text-7xl">${sliderDuration.value}</span>`;
    minElement.style.display = "flex";
    startBtn.style.display = "block";
    startAgain.style.display = "none";
}
//start
startBtn.addEventListener("click", function () {
    startTimer();
    estimateTime();
    checkMin();
    titleDisplay();
    slider.style.display = "none";
    startBtn.style.display = "none"
    pauseBtn.style.display = "block";
    timerElement.style.display = "block";
    reset.style.display = "none";


});
//pause
pauseBtn.addEventListener("click", function () {
    pauseTimer();
    checkMin();
});
//resume
resumeBtn.addEventListener("click", function () {
    resumeTimer();
    titleDisplay();
    checkMin();
    reset.style.display = "none";
    slider.style.display = "none";
    resumeBtn.style.display = "none";
    timeEstimate.style.display = "block";
    pauseBtn.style.display = "block";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    box.classList.remove("shake");
});

startAgain.addEventListener("click", function () {
    startAgainTimer();
    //reset all function before proceeding
});


sliderDuration.oninput = function () {
    clearInterval(timer);
    clearInterval(titleInterval);
    paused = true;
    timerElement.style.display = "block";
    minElement.style.display = "flex";
    startBtn.style.display = "block";
    title.style.display = "block";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    title.innerHTML = `<span class="text-2xl">Set the <span class="font-extrabold text-blue-600">timer</span>.</span>`;
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    sliderValue.innerHTML = this.value;
    timerElement.innerHTML = this.value;
    timeEstimate.innerHTML = "Begin new task.";
    if (this.value == 1) {
        minElement.innerHTML = "min"
    } else {
        minElement.innerHTML = "mins"
    }
}


function resetTimer() {
    paused = true;
    clearInterval(timer);
    clearInterval(estimateInterval);
    clearInterval(titleInterval);
    checkMin();
    box.classList.remove("shake");
    title.innerHTML = `<span class="text-2xl text-gray-600"><span class="text-blue-600 font-extrabold">Adjust the slider</span><br> to reset the timer.</span>`;
    timeEstimate.style.display = "block";
    timeEstimate.innerHTML = "Begin new task.";
    slider.style.display = "flex";
    sliderDuration.value = 5;
    sliderValue.innerHTML = sliderDuration.value;
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    timerElement.innerHTML = sliderDuration.value;
    minElement.style.display = "flex";
    resumeBtn.style.display = "none";
    reset.style.display = "none";
    startBtn.style.display = "block";
}
reset.addEventListener("click", function () {
    resetTimer();

});


//function to identify the remaining time if its a sec, min, or minutes
//fix the reset, pause, resume function, much better if you define the repetitive code in a function instead
//fix the minElement
