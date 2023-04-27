const finishedTaskCounterDisplay = document.getElementById("finished-task-display");
const finishedTaskStatement = document.getElementById("finished-task-statement");
const clockElement = document.getElementById("clock");
const boxElement = document.getElementById("box");
const boxTitle = document.getElementById("box-title");
const sliderComponent = document.getElementById("slider-component");
const sliderInput = document.getElementById("duration");
const sliderValueDisplay = document.getElementById("slider-value");
const timerElement = document.getElementById("timer");
const minElement = document.getElementById("min");
const startButton = document.getElementById("start");
const resumeButton = document.getElementById("resume");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const restartButton = document.getElementById("start-again");
const estimatedTimeContext = document.getElementById("time-estimate");
const taskHistoryComponent = document.getElementById("task-history");
const header = document.querySelector("header");
const taskHistoryButton = document.getElementById("history-button");
const audioElement = new Audio("achievement-completed.wav");
const breakTimeButton = document.getElementById("start-break");
const lockIcon = document.getElementById("lock");
const buttonChildElement = document.querySelector("#floating-break-time > *")
const floatingDoTaskButton = document.getElementById("do-task");
const floatingBreakTimeButton = document.getElementById("floating-break-time");

let decrementValue = 1000;
let finishedTaskCounter = 0;
let totalBreak = 0;
let remainingTime;

//intervalId
let timerIntervalId;
let boxTitleIntervalId;
let estimatedTimeIntervalId;



//confetti
let count = 270;
let defaults = {
    origin: { y: 0.8 }
};
//confetti
sliderValueDisplay.innerHTML = sliderInput.value;
timerElement.innerHTML = sliderInput.value;
floatingBreakTimeButton.style.display = "none";
taskHistoryComponent.style.display = "block";
audioElement.setAttribute("preload", "auto");
finishedTaskCounterDisplay.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${finishedTaskCounter}</span>`;


// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     e.returnValue = "";
// });


let timeInputValueArr = [];
let totalTimeSpent = () => {
    let sum = 0;
    for (let x of timeInputValueArr) {
        sum += x;
    };
    if (sum >= 1 && sum < 15) {
        floatingBreakTimeButton.style.display = "flex";
    } else if (sum >= 15) {
        showFloatingBreakTimeBtn();
    }
    return sum;
}

let checkHistory = () => {
    setInterval(() => {
        if (finishedTaskCounter == 0) {
            taskHistoryButton.style.display = "none";
        } else {
            taskHistoryButton.style.display = "flex";
        }
    }, 0)
}
checkHistory();


let currentTime = () => { //current time
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let time = `${hours}:${minutes} ${amOrPm}`;
    return time;
}

setInterval(() => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let time = `${hours}:${minutes} ${amOrPm}`;
    clockElement.textContent = time;
}, 0)


let displayFinished = () => {
    let data = `<span class="block text-gray-600 my-2">Finished <span class="font-bold text-blue-600">${sliderInput.value} ${sliderInput.value == 1 ? 'minute' : 'minutes'}</span> task at ${currentTime()}.</span>`
    finishedTaskStatement.innerHTML += data;
}

let displayBreak = () => {
    let data = `<span class="block text-gray-600 my-2">Took a <span class="font-bold text-blue-600">${sliderInput.value} minutes</span> break at ${currentTime()}.</span>`
    finishedTaskStatement.innerHTML += data;
}

let boxTitleDisplay = () => {
    boxTitleIntervalId = setInterval(() => {
        boxTitle.innerHTML = `<span class="text-2xl text-gray-600">You're <span class="text-blue-500">${Math.round(remainingTime / 60 / 1000)} ${Math.floor(remainingTime / 60 / 1000) <= 1 ? 'min' : 'mins'} </span> closer <br> in finishing <span class="font-extrabold text-gray-900">Capstone</span>!</span>`
    }, 0);
}

const endOfTimer = () => {
    if (remainingTime == 0) {
        clearInterval(timerIntervalId);
        clearInterval(boxTitleIntervalId);
        clearInterval(estimatedTimeIntervalId);
        finishedTaskCounter++;
        timeInputValueArr.push(parseInt(sliderInput.value));
        remainingTime = parseInt(sliderInput.value) * 60 * 1000;
        finishedTaskCounterDisplay.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${finishedTaskCounter}</span>`;
        boxTitle.innerHTML = `<span class="text-blue-600">Congratulations!</span> <br> You're ${finishedTaskCounter} ${finishedTaskCounter == 1 ? 'task' : 'tasks'} ahead.`;
        audioElement.play();
        timerElement.innerHTML = "Done!";
        pauseButton.style.display = "none";
        minElement.style.display = "none";
        restartButton.style.display = "block";
        finishedTaskStatement.classList.add("snap-end")
        estimatedTimeContext.innerHTML = "Begin new task.";
        updateHeaderWrapperDisplay();
        displayFinished();
        totalTimeSpent();
        //confetti
        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
        //confetti
    }
}

//start
function startTimer() {
    paused = false;
    restartButton.style.display = "none";
    minElement.style.display = "flex";

    if (!paused) {
        clearInterval(timerIntervalId)
        boxTitle.style.display = "block";
        const duration = parseInt(sliderInput.value) * 60 * 1000; //convert minutes t0 milliseconds
        remainingTime = duration;

        timerIntervalId = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= decrementValue;

            checkMinElement();
            endOfTimer();


        }, 1000)
    }
}
startButton.addEventListener("click", function () {
    clearInterval(estimatedTimeIntervalId);
    startTimer();
    boxTitleDisplay();
    estimatedTimeDisplay();
    sliderComponent.style.display = "none";
    startButton.style.display = "none"
    resetButton.style.display = "none";
    pauseButton.style.display = "block";
    timerElement.style.display = "block";
});


//pause
function pauseTimer() {
    paused = true;
    clearInterval(timerIntervalId);
    clearInterval(boxTitleIntervalId);
    clearInterval(estimatedTimeIntervalId);
    checkMinElement();
    boxElement.classList.add("shake");
    boxTitle.innerHTML = `<span class="text-red-500 text-4xl">Paused</span>`;
    sliderComponent.style.display = "none";
    estimatedTimeContext.style.display = "block";
    estimatedTimeContext.innerHTML = `<span class="text-gray-400">Total of <span class="font-bold text-gray-600">${sliderInput.value} ${sliderInput.value == 1 ? 'min' : 'mins'}</span>.</span>`
    startButton.style.display = "none";
    pauseButton.style.display = "none";
    resumeButton.style.display = "block";
    resetButton.style.display = "block";
    timerElement.classList.add("text-gray-400");
    minElement.classList.add("text-gray-300");
}
pauseButton.addEventListener("click", function () {
    pauseTimer();
});

//resume
function resumeTimer() {
    paused = false;
    estimatedTimeDisplay();
    if (!paused) {
        clearInterval(timerIntervalId)
        boxTitle.style.display = "block";

        timerIntervalId = setInterval(() => {
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            remainingTime -= decrementValue;

            endOfTimer();

        }, 1000)
    }
}
resumeButton.addEventListener("click", function () {
    resumeTimer();
    boxTitleDisplay();
    checkMinElement();
    resetButton.style.display = "none";
    sliderComponent.style.display = "none";
    resumeButton.style.display = "none";
    estimatedTimeContext.style.display = "block";
    pauseButton.style.display = "block";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    boxElement.classList.remove("shake");
});

//restart
function restartTimer() {
    paused = true;
    checkMinElement();
    clearInterval(timerIntervalId);
    clearInterval(estimatedTimeIntervalId);
    clearInterval(boxTitleIntervalId);
    boxTitle.innerHTML = `Begin <span class="text-blue-600 font-extrabold">new task</span>.`;
    sliderInput.value = 15;
    sliderValueDisplay.innerHTML = sliderInput.value;
    sliderComponent.style.display = "flex";
    timerElement.innerHTML = `<span class="text-7xl">${sliderInput.value}</span>`;
    minElement.style.display = "flex";
    startButton.style.display = "block";
    restartButton.style.display = "none";
}
restartButton.addEventListener("click", function () {
    restartTimer();
});

//reset
function resetTimer() {
    paused = true;
    clearInterval(timerIntervalId);
    clearInterval(estimatedTimeIntervalId);
    clearInterval(boxTitleIntervalId);
    checkMinElement();
    boxElement.classList.remove("shake");
    boxTitle.innerHTML = `<span class="text-2xl text-gray-600">Adjust the slider<br> to <span class="text-red-600 font-extrabold">reset</span> the timer.</span>`;
    estimatedTimeContext.style.display = "block";
    estimatedTimeContext.innerHTML = "Reset the timer.";
    sliderComponent.style.display = "flex";
    sliderInput.value = 15;
    sliderValueDisplay.innerHTML = sliderInput.value;
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    timerElement.innerHTML = sliderInput.value;
    minElement.style.display = "flex";
    resumeButton.style.display = "none";
    resetButton.style.display = "none";
    startButton.style.display = "block";
    if (sliderInput.value == 1) {
        minElement.innerHTML = "min";
    } else {
        minElement.innerHTML = "mins";
    }
}
resetButton.addEventListener("click", function () {
    resetTimer();
});


function estimatedTimeDisplay() {
    estimatedTimeContext.style.display = "block";
    paused = false;
    if (!paused) {
        clearInterval(estimatedTimeIntervalId);
        estimatedTimeIntervalId = setInterval(() => {
            const date = new Date();
            const minToAdd = parseInt(remainingTime);
            const newTime = new Date(date.getTime() + minToAdd);
            let newHours = newTime.getHours().toString().padStart(2, "0");
            const newMins = newTime.getMinutes().toString().padStart(2, "0");
            const amOrPm = newHours >= 12 ? 'pm' : 'am';
            newHours = (newHours % 12) || 12;
            const timeEstimated = `${newHours}:${newMins} ${amOrPm}`;
            estimatedTimeContext.innerHTML = `Timer will end at <span class="font-bold">${timeEstimated}</span>`;
        }, 0)
    }
}

let checkMinElement = () => {
    if (remainingTime <= 60000 && remainingTime >= 59000) {
        minElement.innerHTML = "min";
    } else if (remainingTime < 60000) {
        minElement.innerHTML = "sec";
    } else {
        minElement.innerHTML = "mins";
    }
}



sliderInput.oninput = function () {
    paused = true;
    clearInterval(timerIntervalId);
    clearInterval(boxTitleIntervalId);
    calcTimeEstimate();
    sliderValueDisplay.innerHTML = this.value;
    timerElement.innerHTML = this.value;
    pauseButton.style.display = "none";
    resumeButton.style.display = "none";
    boxTitle.style.display = "block";
    boxTitle.innerHTML = `<span class="text-2xl">Set the <span class="font-extrabold text-blue-600">timer</span>.</span>`;
    timerElement.style.display = "block";
    startButton.style.display = "block";
    minElement.style.display = "flex";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");

    if (this.value == 1) {
        minElement.innerHTML = "min"
    } else {
        minElement.innerHTML = "mins"
    }
}

const calcTimeEstimate = () => {
    let x = parseInt(sliderInput.value);
    let xInMs = x * (60 * 1000);
    let today = new Date();
    let todayInMs = today.getTime();
    let sumOfTime = todayInMs + xInMs;
    let newTime = new Date(sumOfTime)
    let hours = newTime.getHours().toString().padStart(2, "0");
    let minutes = newTime.getMinutes().toString().padStart(2, "0");
    let amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let time = `${hours}:${minutes} ${amOrPm}`;
    estimatedTimeContext.innerHTML = `Timer will end at ${time}`;
    return time;
}


function showHistory() {
    if (taskHistoryComponent.style.display === "none") {
        taskHistoryComponent.style.display = "block";

    } else {
        taskHistoryComponent.style.display = "none";
    }
};
taskHistoryButton.addEventListener("click", showHistory);


let updateHeaderWrapperDisplay = () => {
    const headerWrapper = document.getElementById("header-wrapper");
    let total = finishedTaskCounter + totalBreak;
    if (total >= 4 && total < 10) {
        console.log()
        headerWrapper.classList.add("lg:flex");
        taskHistoryComponent.classList.add("h-[7rem]", "overflow-y-scroll", "lg:h-auto", "lg:overflow-hidden", "snap-mandatory", "snap-y");
        finishedTaskStatement.classList.add("snap-end")
    } else if (total >= 10) {
        taskHistoryComponent.classList.add("h-[7rem]", "overflow-y-scroll", "lg:h-[25rem]", "lg:overflow-y-scroll", "snap-mandatory", "snap-y");
    } else {
        headerWrapper.classList.remove("lg:flex");
        taskHistoryComponent.classList.remove("h-[5rem]", "overflow-y-scroll", "lg:h-auto", "lg:overflow-hidden", "snap-mandatory", "snap-y");
        taskHistoryComponent.classList.remove("h-[7rem]", "overflow-y-scroll", "lg:h-[25rem]", "lg:overflow-y-scroll", "snap-mandatory", "snap-y");
        finishedTaskStatement.classList.remove("snap-end")
    }
}

let showFloatingBreakTimeBtn = () => {
    floatingBreakTimeButton.style.display = "flex";
    floatingBreakTimeButton.classList.add("group", "hover:border-gray-600", "cursor-pointer");
    floatingBreakTimeButton.classList.remove("cursor-help");
    floatingBreakTimeButton.removeAttribute("disabled");
    floatingBreakTimeButton.removeAttribute("title");
    buttonChildElement.classList.add("group-hover:text-gray-600");
    lockIcon.style.display = "none";
}

let startBreak = () => {
    clearInterval(timerIntervalId);
    clearInterval(boxTitleIntervalId);
    boxTitle.style.display = "block";
    boxTitle.innerHTML = `<span class="text-2xl">You ${totalBreak <= 1 ? 'only' : 'already'} did <span class="font-extrabold text-blue-600">${totalBreak} Break</span>.</span>`;
    restartButton.style.display = "none";
    estimatedTimeContext.innerHTML = "Sharpen your axe by resting.";
    sliderInput.value = 5;
    const breakDuration = parseInt(sliderInput.value) * 60 * 1000; //convert minutes t0 milliseconds
    remainingTime = breakDuration;

    timerIntervalId = setInterval(() => {
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        remainingTime -= decrementValue;

        checkMinElement();
        doneBreak();


    }, 1000);
}

//fix the minELement in Break Time

let doneBreak = () => {
    if (remainingTime < 0) {
        totalBreak++
        clearInterval(timerIntervalId);
        clearInterval(boxTitleIntervalId);
        clearInterval(estimatedTimeIntervalId);
        displayBreak();
        audioElement.play();
        restartButton.style.display = "block";
        restartButton.innerHTML = "Do the Task";
        floatingDoTaskButton.style.display = "none";
        breakTimeButton.style.display = "none";
        minElement.style.display = "none";
        boxTitle.innerHTML = `<span class="text-blue-600">Times up!</span>`;
        timerElement.innerHTML = "Done!";
        estimatedTimeContext.innerHTML = "Begin your task.";

        //confetti
        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
        //confetti

    }
}

breakTimeButton.addEventListener("click", function () {
    clearInterval(timerIntervalId);
    startBreak();
    checkMinElement();
    breakTimeButton.style.display = "none";
})
floatingBreakTimeButton.addEventListener("click", function () {
    clearInterval(timerIntervalId);
    clearInterval(boxTitleIntervalId);
    clearInterval(estimatedTimeIntervalId);
    paused = true;
    floatingDoTaskButton.style.display = "flex";
    resetButton.style.display = "none";
    boxTitle.innerHTML = `<span class="text-2xl">Start <span class="font-extrabold text-blue-600">Break</span>.</span>`;
    startButton.style.display = "none";
    pauseButton.style.display = "none";
    resumeButton.style.display = "none";
    restartButton.style.display = "none";
    sliderComponent.style.display = "none";
    boxTitle.style.display = "block";
    timerElement.style.display = "block";
    breakTimeButton.style.display = "block";
    minElement.style.display = "flex";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    sliderInput.value = 5;
    timerElement.innerHTML = sliderInput.value;
    estimatedTimeContext.innerHTML = "Begin your break time.";

    if (this.value == 1) {
        minElement.innerHTML = "min"
    } else {
        minElement.innerHTML = "mins"
    }
})

floatingDoTaskButton.addEventListener("click", function () {
    restartTimer();
    floatingDoTaskButton.style.display = "none";
    breakTimeButton.style.display = "none";
    clearInterval(timerIntervalId);
}) 