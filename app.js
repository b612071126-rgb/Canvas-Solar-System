alert("太阳系启动");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// =================
// Canvas
// =================

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener(
    "resize",
    resize
);


// =================
// 星空
// =================

let stars = [];

for(let i=0;i<200;i++){

    stars.push({

        x:Math.random()*canvas.width,

        y:Math.random()*canvas.height,

        size:Math.random()*2+1

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



// =================
// 太阳
// =================

const sun={

    radius:55,

    color:"#ffaa00",

    rotation:0,

};



// =================
// 行星系统
// =================

const planets=[


    {

        name:"Earth",

        distance:170,

        angle:0,

        speed:0.02,

        radius:12,

        color:"#3399ff"

    },


    {

        name:"Mars",

        distance:240,

        angle:2,

        speed:0.012,

        radius:9,

        color:"#ff5533"

    },


    {

        name:"Jupiter",

        distance:340,

        angle:4,

        speed:0.006,

        radius:25,

        color:"#d9a066"

    }


];



// =================
// 月球
// =================

const moon={

    distance:25,

    angle:0,

    speed:0.08,

    radius:4,

    color:"white",

};




// =================
// 更新
// =================

function update(){


    sun.x =
    canvas.width/2;


    sun.y =
    canvas.height/2;



    // 行星更新

    for(let planet of planets){


        planet.angle += planet.speed;


        planet.x =
        sun.x +
        Math.cos(planet.angle)
        *
        planet.distance;


        planet.y =
        sun.y +
        Math.sin(planet.angle)
        *
        planet.distance;


    }



    // 月球绕地球

    let earth = planets[0];


    moon.angle += moon.speed;


    moon.x =
    earth.x +
    Math.cos(moon.angle)
    *
    moon.distance;


    moon.y =
    earth.y +
    Math.sin(moon.angle)
    *
    moon.distance;



}



// =================
// 绘制轨道
// =================

function drawOrbit(planet){

    ctx.strokeStyle =
    "rgba(255,255,255,0.25)";


    ctx.beginPath();


    ctx.arc(

        sun.x,

        sun.y,

        planet.distance,

        0,

        Math.PI*2

    );


    ctx.stroke();


}



// =================
// 绘制太阳
// =================

function drawSun(){


    let glow =
    ctx.createRadialGradient(

        sun.x,
        sun.y,
        20,

        sun.x,
        sun.y,
        100

    );


    glow.addColorStop(
        0,
        "yellow"
    );


    glow.addColorStop(
        1,
        "transparent"
    );


    ctx.fillStyle=glow;


    ctx.beginPath();


    ctx.arc(

        sun.x,

        sun.y,

        100,

        0,

        Math.PI*2

    );


    ctx.fill();



    ctx.fillStyle=sun.color;


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



// =================
// 绘制行星
// =================

function drawPlanet(planet){


    ctx.fillStyle =
    planet.color;


    ctx.beginPath();


    ctx.arc(

        planet.x,

        planet.y,

        planet.radius,

        0,

        Math.PI*2

    );


    ctx.fill();


}



// =================
// 绘制月球
// =================

function drawMoon(){


    ctx.fillStyle =
    moon.color;


    ctx.beginPath();


    ctx.arc(

        moon.x,

        moon.y,

        moon.radius,

        0,

        Math.PI*2

    );


    ctx.fill();

}



// =================
// 总绘制
// =================

function draw(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    drawStars();


    for(let planet of planets){

        drawOrbit(planet);

    }



    drawSun();



    for(let planet of planets){

        drawPlanet(planet);

    }


    drawMoon();



}



// =================
// 动画循环
// =================

function animate(){

    update();

    draw();

    requestAnimationFrame(
        animate
    );

}


animate();