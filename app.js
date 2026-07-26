const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ======================
// Canvas
// ======================

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();


window.addEventListener(
    "resize",
    resize
);



// ======================
// 粒子系统
// ======================

class Particle{


    constructor(){

        this.x =
        Math.random()*canvas.width;


        this.y =
        Math.random()*canvas.height;


        this.vx =
        (Math.random()-0.5)*2;


        this.vy =
        (Math.random()-0.5)*2;


        this.radius = 2;


    }



    update(){


        this.x += this.vx;

        this.y += this.vy;



        // 边界反弹

        if(
            this.x < 0 ||
            this.x > canvas.width
        ){

            this.vx *= -1;

        }


        if(
            this.y < 0 ||
            this.y > canvas.height
        ){

            this.vy *= -1;

        }



    }



    draw(){


        ctx.fillStyle="white";


        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI*2

        );


        ctx.fill();



    }


}



// ======================
// 创建宇宙物质
// ======================


let particles=[];


for(
    let i=0;
    i<100;
    i++
){

    particles.push(
        new Particle()
    );

}



// ======================
// 更新
// ======================

function update(){


    for(let p of particles){

        p.update();

    }


}



// ======================
// 绘制
// ======================

function draw(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    for(let p of particles){

        p.draw();

    }


}



// ======================
// 宇宙循环
// ======================

function animate(){


    update();


    draw();


    requestAnimationFrame(
        animate
    );


}


animate();