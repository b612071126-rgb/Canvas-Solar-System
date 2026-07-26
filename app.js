alert("太阳系启动");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// =====================
// Canvas 初始化
// =====================

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener(
    "resize",
    resize
);



// =====================
// 工具函数
// =====================

function random(min,max){

    return Math.random()*(max-min)+min;

}



// =====================
// 星空背景
// =====================

let stars = [];


for(let i=0;i<120;i++){

    stars.push({

        x:random(0,canvas.width),

        y:random(0,canvas.height),

        size:random(1,3)

    });

}



function drawStars(){

    ctx.fillStyle="white";


    for(let star of stars){

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

}



// =====================
// 太阳对象
// =====================

const sun = {

    x:0,

    y:0,

    radius:50,

    color:"#ffaa00"


};



// =====================
// 地球对象
// =====================

const earth = {


    angle:0,


    distance:170,


    speed:0.02,


    radius:12,


    color:"#3399ff",


    x:0,


    y:0


};




// =====================
// 更新逻辑
// =====================

function update(){


    // 太阳保持中心

    sun.x =
    canvas.width/2;


    sun.y =
    canvas.height/2;



    // 地球角度变化

    earth.angle += earth.speed;



    // 根据角度计算位置

    earth.x =
    sun.x +
    Math.cos(earth.angle)
    *
    earth.distance;


    earth.y =
    sun.y +
    Math.sin(earth.angle)
    *
    earth.distance;


}





// =====================
// 绘制太阳
// =====================

function drawSun(){


    // 光晕

    let gradient =
    ctx.createRadialGradient(

        sun.x,
        sun.y,
        10,

        sun.x,
        sun.y,
        80

    );


    gradient.addColorStop(
        0,
        "yellow"
    );


    gradient.addColorStop(
        1,
        "transparent"
    );


    ctx.fillStyle =
    gradient;


    ctx.beginPath();


    ctx.arc(

        sun.x,

        sun.y,

        80,

        0,

        Math.PI*2

    );


    ctx.fill();





    // 太阳主体

    ctx.fillStyle =
    sun.color;


    ctx.beginPath();


    ctx.arc(

        sun.x,

        sun.y,

        sun.radius,

        0,

        Math.PI*2

    );


    ctx.fill();


}



// =====================
// 绘制轨道
// =====================

function drawOrbit(){


    ctx.strokeStyle =
    "rgba(255,255,255,0.3)";


    ctx.lineWidth=1;


    ctx.beginPath();


    ctx.arc(

        sun.x,

        sun.y,

        earth.distance,

        0,

        Math.PI*2

    );


    ctx.stroke();


}



// =====================
// 绘制地球
// =====================

function drawEarth(){


    ctx.fillStyle =
    earth.color;


    ctx.beginPath();


    ctx.arc(

        earth.x,

        earth.y,

        earth.radius,

        0,

        Math.PI*2

    );


    ctx.fill();



    // 地球小高光

    ctx.fillStyle="white";


    ctx.beginPath();


    ctx.arc(

        earth.x-4,

        earth.y-4,

        3,

        0,

        Math.PI*2

    );


    ctx.fill();



}




// =====================
// 总绘制
// =====================

function draw(){


    // 清屏

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    drawStars();


    drawOrbit();


    drawSun();


    drawEarth();



}



// =====================
// 动画循环
// =====================

function animate(){


    update();


    draw();


    requestAnimationFrame(
        animate
    );


}



animate();