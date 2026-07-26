const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// =====================
// Canvas
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
// 宇宙参数
// =====================

const universe = {

    G:0.08,

    particles:[]

};



// =====================
// 粒子类
// =====================

class Particle{


    constructor(x,y,mass){


        this.x=x;

        this.y=y;


        this.vx=
        (Math.random()-0.5)*1.5;


        this.vy=
        (Math.random()-0.5)*1.5;



        this.mass=mass;


        this.radius =
        Math.sqrt(this.mass)*2;


    }



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



        this.vx +=
        force *
        dx /
        distance;



        this.vy +=
        force *
        dy /
        distance;


    }



    update(){


        this.x += this.vx;

        this.y += this.vy;



        this.vx*=0.995;

        this.vy*=0.995;



        // 环绕空间

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


        // 质量越大越亮

        if(this.mass>20){

            ctx.fillStyle="#ffaa00";

        }
        else{

            ctx.fillStyle="white";

        }



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



// =====================
// 创建宇宙
// =====================

function createUniverse(){


    for(let i=0;i<200;i++){


        universe.particles.push(

            new Particle(

                canvas.width/2+
                (Math.random()-0.5)*500,


                canvas.height/2+
                (Math.random()-0.5)*500,


                Math.random()*3+1

            )

        );


    }


}


createUniverse();



// =====================
// 碰撞合并
// =====================

function mergeParticles(){


    let particles =
    universe.particles;



    for(let i=0;i<particles.length;i++){


        for(let j=i+1;j<particles.length;j++){


            let a=particles[i];

            let b=particles[j];



            let dx =
            b.x-a.x;


            let dy =
            b.y-a.y;



            let distance =
            Math.sqrt(
                dx*dx+
                dy*dy
            );



            if(
                distance <
                a.radius+b.radius
            ){


                // 质量合并

                let totalMass =
                a.mass+b.mass;



                a.mass =
                totalMass;



                a.radius =
                Math.sqrt(
                    a.mass
                )*2;



                // 速度守恒简化

                a.vx =
                (
                    a.vx*a.mass+
                    b.vx*b.mass
                )
                /
                totalMass;



                a.vy =
                (
                    a.vy*a.mass+
                    b.vy*b.mass
                )
                /
                totalMass;



                // 删除b

                particles.splice(j,1);


                j--;


            }


        }


    }


}



// =====================
// 更新
// =====================

function update(){


    let particles =
    universe.particles;



    for(let a of particles){


        for(let b of particles){


            if(a!==b){

                a.attract(b);

            }


        }


    }



    mergeParticles();



    for(let p of particles){

        p.update();

    }


}



// =====================
// 绘制
// =====================

function draw(){


    ctx.fillStyle=
    "rgba(0,0,0,0.25)";


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



// =====================
// 循环
// =====================

function animate(){


    update();


    draw();


    requestAnimationFrame(
        animate
    );


}


animate();