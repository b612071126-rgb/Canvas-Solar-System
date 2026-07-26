const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ========================
// Canvas
// ========================

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener(
    "resize",
    resize
);



// ========================
// 宇宙参数
// ========================

const universe = {

    G:0.05,

    particles:[]

};



// ========================
// 粒子类
// ========================

class Particle{


    constructor(x,y,mass){


        this.x=x;

        this.y=y;


        this.vx=
        (Math.random()-0.5)*2;


        this.vy=
        (Math.random()-0.5)*2;



        this.mass=mass;


        this.radius =
        Math.sqrt(mass)*2;


        this.color =
        "white";


    }



    // 引力计算

    attract(other){


        let dx =
        other.x-this.x;


        let dy =
        other.y-this.y;



        let distance =
        Math.sqrt(
            dx*dx+
            dy*dy
        );



        if(distance<10){

            return;

        }



        let force =
        universe.G *
        this.mass *
        other.mass /
        (distance*distance);



        let ax =
        force *
        dx /
        distance;


        let ay =
        force *
        dy /
        distance;



        this.vx += ax;

        this.vy += ay;


    }



    update(){


        this.x += this.vx;

        this.y += this.vy;



        // 简单阻尼

        this.vx *=0.995;

        this.vy *=0.995;



        // 边界循环

        if(this.x<0)
            this.x=canvas.width;


        if(this.x>canvas.width)
            this.x=0;


        if(this.y<0)
            this.y=canvas.height;


        if(this.y>canvas.height)
            this.y=0;



    }



    draw(){


        ctx.fillStyle=this.color;


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



// ========================
// 初始化宇宙
// ========================

function createUniverse(){


    for(let i=0;i<150;i++){


        let p =
        new Particle(

            Math.random()*canvas.width,

            Math.random()*canvas.height,

            Math.random()*3+1

        );


        universe.particles.push(p);


    }



}


createUniverse();



// ========================
// 更新宇宙
// ========================

function update(){


    let particles =
    universe.particles;



    // 引力

    for(let i=0;i<particles.length;i++){


        for(let j=0;j<particles.length;j++){


            if(i!==j){

                particles[i]
                .attract(
                    particles[j]
                );

            }


        }


    }



    // 运动

    for(let p of particles){

        p.update();

    }


}



// ========================
// 绘制宇宙
// ========================

function draw(){


    ctx.fillStyle="rgba(0,0,0,0.2)";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    for(let p of universe.particles){

        p.draw();

    }


}



// ========================
// 主循环
// ========================

function animate(){


    update();


    draw();


    requestAnimationFrame(
        animate
    );


}


animate();