const box = document.getElementById("box");
const title = document.getElementById("title");
const timeDisplay = document.getElementById("time"); //actual time
const slider = document.getElementById("slider");
const sliderDuration = document.getElementById("duration");
const sliderValue = document.getElementById("slider-value");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resumeBtn = document.getElementById("resume");
const pauseBtn = document.getElementById("pause");
const reset = document.getElementById("reset");
const startAgain = document.getElementById("start-again");
const minElement = document.getElementById("min");
const timeEstimate = document.getElementById("time-estimate");
const clockElement = document.getElementById("clock");
const finishedTask = document.getElementById("finished-task");
const sentence = document.getElementById("sentence");
const taskHistory = document.getElementById("task-history");
const header = document.querySelector("header");
const noHistoryMsg = document.getElementById("no-history");
const history = document.getElementById("history");
const audioElement = new Audio("achievement-completed.wav");
const breakTime = document.getElementById("break-time");
const breakInit = document.getElementById("start-break");

const lock = document.getElementById("lock");
let btnChild = document.querySelector("#break-time > *")
let doTask = document.getElementById("do-task");
let timer;
let remainingTime;
let titleInterval;
let estimateInterval;
let task = 0;
let num = 1000;
//confetti
let count = 270;
let defaults = {
    origin: { y: 0.8 }
};
//confetti
sliderValue.innerHTML = sliderDuration.value;
timerElement.innerHTML = sliderDuration.value;
finishedTask.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${task}</span>`;
breakTime.style.display = "none";

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     e.returnValue = "";
// });
let timeData = [];

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
    let data = `<span class="block text-gray-600 my-2">Finished <span class="font-bold text-blue-600">${sliderDuration.value} ${sliderDuration.value == 1 ? 'minute' : 'minutes'}</span> task at ${currentTime()}.</span>`
    sentence.innerHTML += data;
}

let displayBreak = () => {
    let data = `<span class="block text-gray-600 my-2">Took a <span class="font-bold text-blue-600">${sliderDuration.value} minutes</span> break at ${currentTime()}.</span>`
    sentence.innerHTML += data;
}

const emptyTime = () => {
    if (remainingTime < 0) {
        task++;
        finishedTask.innerHTML = `<span class="p-2 px-3 rounded-md bg-gray-700 text-gray-100 font-extrabold">${task}</span>`;
        audioElement.play();
        timeData.push(parseInt(sliderDuration.value));
        clearInterval(timer);
        clearInterval(titleInterval);
        clearInterval(estimateInterval);
        remainingTime = parseInt(sliderDuration.value) * 60 * 1000;
        timerElement.innerHTML = "Done!";
        pauseBtn.style.display = "none";
        startAgain.style.display = "block";
        title.innerHTML = `<span class="text-blue-600">Congratulations!</span> <br> You're ${task} ${task == 1 ? 'task' : 'tasks'} ahead.`;
        noHistoryMsg.style.display = "none"
        sentence.classList.add("snap-end")
        timeEstimate.innerHTML = "Begin new task.";
        minElement.style.display = "none";
        displayFinished();
        wrapper();
        checkSum();
        console.log(timeData);
        console.log(checkSum());
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

    } else if (remainingTime < 59000) {
        minElement.innerHTML = "sec";
    } else if (remainingTime == 59000) {
        minElement.innerHTML = "min";
    } else {
        minElement.innerHTML = "mins";
    }
}

function startTimer() {
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
            remainingTime -= num;

            emptyTime();

        }, 1000)
    }
}


function estimateTime() {
    timeEstimate.style.display = "block";
    paused = false;
    if (!paused) {
        clearInterval(estimateInterval);
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
    timeEstimate.style.display = "block";
    timeEstimate.innerHTML = `<span class="text-gray-400">Total of <span class="font-bold text-gray-600">${sliderDuration.value} minutes</span>.</span>`
    startBtn.style.display = "none";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "block";
    reset.style.display = "block";
    timerElement.classList.add("text-gray-400");
    minElement.classList.add("text-gray-300");
}

function resumeTimer() {
    paused = false;
    clearInterval(estimateInterval);
    estimateTime();
    if (!paused) {
        clearInterval(timer)
        title.style.display = "block";

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

let titleDisplay = () => {
    titleInterval = setInterval(() => {
        title.innerHTML = `<span class="text-2xl text-gray-600">You're <span class="text-blue-500">${Math.round(remainingTime / 60 / 1000)} ${Math.floor(remainingTime / 60 / 1000) <= 1 ? 'min' : 'mins'} </span> closer <br> in finishing <span class="font-extrabold text-gray-900">Capstone</span>!</span>`
    }, 0);
}

function startAgainTimer() {
    paused = true;
    checkMin();
    clearInterval(timer);
    clearInterval(estimateInterval);
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
    clearInterval(estimateInterval);
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
});


sliderDuration.oninput = function () {
    clearInterval(timer);
    clearInterval(titleInterval);
    clearInterval(estimateInterval);
    paused = true;
    title.innerHTML = `<span class="text-2xl">Set the <span class="font-extrabold text-blue-600">timer</span>.</span>`;
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    timerElement.style.display = "block";
    startBtn.style.display = "block";
    title.style.display = "block";
    minElement.style.display = "flex";
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
    title.innerHTML = `<span class="text-2xl text-gray-600">Adjust the slider<br> to <span class="text-red-600 font-extrabold">reset</span> the timer.</span>`;
    timeEstimate.style.display = "block";
    timeEstimate.innerHTML = "Reset the timer.";
    slider.style.display = "flex";
    sliderDuration.value = 15;
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


taskHistory.style.display = "block";
function showHistory() {
    if (taskHistory.style.display === "none") {
        taskHistory.style.display = "block";
        if (task == 0) {
            noHistoryMsg.style.display = "inline-block"
        } else {
            noHistoryMsg.style.display = "none"
        }
    } else {
        taskHistory.style.display = "none";
        noHistoryMsg.style.display = "none"
    }
};
history.addEventListener("click", showHistory);


let wrapper = () => {
    const headerWrapper = document.getElementById("header-wrapper");
    const body = document.querySelector("body")
    if (task >= 4) {
        headerWrapper.classList.add("lg:flex");
        taskHistory.classList.add("h-[7rem]", "overflow-y-scroll", "lg:h-auto", "lg:overflow-hidden", "snap-mandatory", "snap-y");
        sentence.classList.add("snap-end")
    } else {
        headerWrapper.classList.remove("lg:flex");
        taskHistory.classList.remove("h-[5rem]", "overflow-y-scroll", "lg:h-auto", "lg:overflow-hidden", "snap-mandatory", "snap-y");
        sentence.classList.remove("snap-end")
    }
}

let checkSum = () => {
    let sum = 0;
    for (let x of timeData) {
        sum += x;
    };
    if (sum >= 1 && sum < 15) {
        breakTime.style.display = "flex";
    } else if (sum >= 15) {
        breakTimeShow();
    }
    return sum;
}
let breakTimeShow = () => {
    breakTime.style.display = "flex";
    breakTime.classList.add("group", "hover:border-gray-600", "cursor-pointer");
    breakTime.classList.remove("cursor-help");
    breakTime.removeAttribute("disabled");
    breakTime.removeAttribute("title");
    btnChild.classList.add("group-hover:text-gray-600");
    lock.style.display = "none";

}
let totalBreak = 0;
let breakTimeInit;
let startBreak = () => {
    let remainingBreak;
    clearInterval(breakTimeInit);
    title.style.display = "block";
    title.innerHTML = `<span class="text-2xl">You ${totalBreak <= 1 ? 'only' : 'already'} did <span class="font-extrabold text-blue-600">${totalBreak} Break</span>.</span>`;
    startAgain.style.display = "none";
    timeEstimate.innerHTML = "Sharpen your axe by resting.";
    const breakDuration = parseInt(sliderDuration.value) * 60 * 1000; //convert minutes t0 milliseconds
    remainingBreak = breakDuration;

    breakTimeInit = setInterval(() => {
        const minutes = Math.floor((remainingBreak / 1000 / 60) % 60);
        const seconds = Math.floor((remainingBreak / 1000) % 60);
        timerElement.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        remainingBreak -= 20000;

        doneBreak();
        checkMin();

    }, 1000);

    let doneBreak = () => {
        if (remainingBreak < 0) {
            totalBreak++
            clearInterval(breakTimeInit);
            clearInterval(titleInterval);
            clearInterval(estimateInterval);
            displayBreak();
            audioElement.play();
            startAgain.style.display = "block";
            startAgain.innerHTML = "Do the Task";
            breakInit.style.display = "none";
            title.innerHTML = `<span class="text-blue-600">Times up!</span>`;
            timerElement.innerHTML = "Done!";
            timeEstimate.innerHTML = "Begin your task.";
            minElement.style.display = "none";

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

        } else if (remainingTime < 59000) {
            minElement.innerHTML = "sec";
        } else if (remainingTime == 59000) {
            minElement.innerHTML = "min";
        } else {
            minElement.innerHTML = "mins";
        }
    }
}
breakInit.addEventListener("click", function () {
    clearInterval(breakTimeInit);
    startBreak();
    checkMin();
    breakInit.style.display = "none";
})
breakTime.addEventListener("click", function () {
    clearInterval(timer);
    clearInterval(titleInterval);
    clearInterval(estimateInterval);
    clearInterval(breakTimeInit);
    paused = true;
    doTask.style.display = "flex";
    reset.style.display = "none";
    title.innerHTML = `<span class="text-2xl">Start <span class="font-extrabold text-blue-600">Break</span>.</span>`;
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    timerElement.style.display = "block";
    startBtn.style.display = "none";
    breakInit.style.display = "block";
    title.style.display = "block";
    slider.style.display = "none";
    minElement.style.display = "flex";
    startAgain.style.display = "none";
    timerElement.classList.remove("text-gray-400");
    minElement.classList.remove("text-gray-300");
    sliderDuration.value = 5;
    timerElement.innerHTML = sliderDuration.value;
    timeEstimate.innerHTML = "Begin your break time.";
    if (this.value == 1) {
        minElement.innerHTML = "min"
    } else {
        minElement.innerHTML = "mins"
    }
})

doTask.addEventListener("click", function () {
    startAgainTimer();
    doTask.style.display = "none";
    breakInit.style.display = "none";
    clearInterval(breakTimeInit);
})