const canvas =
document.getElementById("canvas");


const ctx =
canvas.getContext("2d");


canvas.width =
window.innerWidth;


canvas.height =
window.innerHeight;



let x = 0;



function draw(){

    // 清空画布
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // 设置颜色
    ctx.fillStyle = "yellow";


    // 开始绘制
    ctx.beginPath();


    ctx.arc(
        x,
        canvas.height / 2,
        50,
        0,
        Math.PI * 2
    );


    ctx.fill();



    // 改变位置
    x += 2;



    // 下一帧继续
    requestAnimationFrame(draw);

}



draw();