const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");


// =====================
// Canvas
// =====================

function resize(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}

resize();


window.addEventListener(
    "resize",
    resize
);



// =====================
// 宇宙核心
// =====================

const universe={

    G:0.05,

    bodies:[],

    particles:[],

    blackHole:null

};




// =====================
// 基础物体
// =====================

class Body{


    constructor(
        x,
        y,
        mass,
        type="star"
    ){

        this.x=x;

        this.y=y;


        this.vx=
        (Math.random()-0.5);


        this.vy=
        (Math.random()-0.5);



        this.mass=mass;


        this.type=type;


        this.radius=
        Math.sqrt(mass)*2;


        this.life=1000;


    }




    gravity(other){


        let dx=
        other.x-this.x;


        let dy=
        other.y-this.y;



        let d=
        Math.sqrt(
            dx*dx+
            dy*dy
        );


        if(d<20)
        return;



        let force=
        universe.G*
        this.mass*
        other.mass/
        (d*d);



        this.vx +=
        force*
        dx/d;


        this.vy +=
        force*
        dy/d;



    }




    update(){


        this.x+=this.vx;

        this.y+=this.vy;



        this.vx*=0.995;

        this.vy*=0.995;


    }




    draw(){


        if(this.type==="star"){

            ctx.fillStyle=
            "orange";

        }
        else{

            ctx.fillStyle=
            "white";

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
// 黑洞
// =====================

class BlackHole extends Body{


    constructor(x,y){


        super(
            x,
            y,
            800,
            "blackhole"
        );


        this.radius=30;

        this.diskAngle=0;


    }




    update(){


        this.diskAngle+=0.03;


    }





    consume(){


        for(
            let i=
            universe.bodies.length-1;
            i>=0;
            i--
        ){


            let b=
            universe.bodies[i];


            if(b===this)
            continue;



            let dx=
            b.x-this.x;


            let dy=
            b.y-this.y;



            let d=
            Math.sqrt(
                dx*dx+
                dy*dy
            );



            if(
                d <
                this.radius+b.radius
            ){


                this.mass+=b.mass;



                this.radius=
                Math.sqrt(
                    this.mass
                );


                universe.bodies.splice(
                    i,
                    1
                );



                createExplosion(
                    b.x,
                    b.y
                );


            }



        }



    }



    draw(){


        // 吸积盘

        ctx.strokeStyle=
        "rgba(255,120,0,0.5)";


        ctx.lineWidth=5;


        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            this.radius*2,

            this.diskAngle,

            this.diskAngle+Math.PI*2

        );


        ctx.stroke();




        // 黑洞本体

        ctx.fillStyle=
        "black";


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
// 能量粒子系统
// =====================

class EnergyParticle{


    constructor(x,y,type="explosion"){


        this.x=x;

        this.y=y;


        let angle=
        Math.random()*Math.PI*2;


        let speed=
        Math.random()*5+1;



        this.vx=
        Math.cos(angle)*speed;


        this.vy=
        Math.sin(angle)*speed;



        this.life=100;


        this.size=
        Math.random()*3+1;


        this.type=type;


    }




    update(){


        this.x+=this.vx;

        this.y+=this.vy;



        this.vx*=0.98;

        this.vy*=0.98;



        this.life--;


    }



    draw(){


        if(this.type==="jet"){

            ctx.fillStyle="cyan";

        }
        else{

            ctx.fillStyle="orange";

        }



        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            this.size,

            0,

            Math.PI*2

        );


        ctx.fill();


    }


}




// =====================
// 爆炸
// =====================

function createExplosion(x,y){


    for(
        let i=0;
        i<80;
        i++
    ){


        universe.particles.push(

            new EnergyParticle(
                x,
                y
            )

        );


    }


}




// =====================
// 黑洞喷流
// =====================

function createJet(){


    let bh =
    universe.blackHole;



    if(!bh)
    return;



    // 上下两个方向

    for(
        let i=0;
        i<3;
        i++
    ){


        let p =
        new EnergyParticle(
            bh.x,
            bh.y,
            "jet"
        );



        p.vx =
        (Math.random()-0.5);


        p.vy =
        -Math.random()*8;



        universe.particles.push(p);



    }



}






// =====================
// 创建初始宇宙
// =====================


for(
    let i=0;
    i<100;
    i++
){


    universe.bodies.push(

        new Body(

            Math.random()*canvas.width,

            Math.random()*canvas.height,

            Math.random()*5+1,

            "star"

        )

    );


}




// 创建黑洞

universe.blackHole =
new BlackHole(

    canvas.width/2,

    canvas.height/2

);



universe.bodies.push(
    universe.blackHole
);






// =====================
// 更新宇宙
// =====================

function update(){



    let bodies =
    universe.bodies;



    // 引力

    for(
        let a of bodies
    ){


        for(
            let b of bodies
        ){


            if(a!==b){

                a.gravity(b);

            }


        }


    }



    // 黑洞吞噬

    universe.blackHole.consume();



    // 黑洞更新

    universe.blackHole.update();



    // 随机喷流

    if(
        Math.random()<0.05
    ){

        createJet();

    }




    // 更新粒子

    for(
        let i=
        universe.particles.length-1;

        i>=0;

        i--
    ){


        let p =
        universe.particles[i];


        p.update();



        if(
            p.life<=0
        ){

            universe.particles.splice(
                i,
                1
            );

        }


    }



    // 更新天体

    for(
        let b of bodies
    ){

        if(
            b!==universe.blackHole
        ){

            b.update();

        }

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



    // 天体

    for(
        let b of universe.bodies
    ){

        b.draw();

    }




    // 能量粒子

    for(
        let p of universe.particles
    ){

        p.draw();

    }



}



// =====================
// 主循环
// =====================

function animate(){


    update();


    draw();



    requestAnimationFrame(
        animate
    );


}


