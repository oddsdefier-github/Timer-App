const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let draw;

// Get all the DOM elements on the page
const elements = document.getElementsByTagName('*');




$(function () {
    let isClick = true;
    $(".debug").on("click", function () {
        if (!isClick) {
            $("#canvas").css("display", "none")
            clearInterval(draw)
        } else {
            $("#canvas").css("display", "flex")
            draw = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const elements = document.getElementsByTagName('*');
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const rect = element.getBoundingClientRect();
                    const color = "#da9c14"
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
                }
            }, 0);
        }
        isClick = !isClick;
    })


})

