const canvas =
document.getElementById("canvas");


const ctx =
canvas.getContext("2d");


canvas.width =
window.innerWidth;


canvas.height =
window.innerHeight;


console.log(canvas.width);
console.log(canvas.height);


ctx.fillStyle = "yellow";

ctx.beginPath();

ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    50,
    0,
    Math.PI * 2
);

ctx.fill();