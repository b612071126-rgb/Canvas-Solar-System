const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");


// ========================
// Canvas
// ========================

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



// ========================
// 宇宙核心
// ========================

const Universe = {

    age:0,

    G:0.08,

    bodies:[],

    particles:[],

    stars:[],

    blackHole:null

};



// ========================
// 基础天体
// ========================

class Body{


    constructor(
        x,
        y,
        mass,
        type="dust"
    ){


        this.x=x;

        this.y=y;


        this.vx=
        (Math.random()-0.5)*2;


        this.vy=
        (Math.random()-0.5)*2;



        this.mass=mass;


        this.type=type;


        this.radius=
        Math.sqrt(mass)*2;



        this.age=0;


        this.life=
        10000+
        Math.random()*10000;


    }



    gravity(other){


        let dx =
        other.x-this.x;


        let dy =
        other.y-this.y;



        let distance =
        Math.sqrt(
            dx*dx+
            dy*dy
        );



        if(distance<20)
        return;



        let force =

        Universe.G*
        this.mass*
        other.mass/
        (distance*distance);



        this.vx +=
        force*
        dx/
        distance;



        this.vy +=
        force*
        dy/
        distance;


    }





    move(){


        this.x+=this.vx;

        this.y+=this.vy;



        this.vx*=0.995;

        this.vy*=0.995;



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






// ========================
// 恒星
// ========================

class Star extends Body{


    constructor(x,y,mass){


        super(
            x,
            y,
            mass,
            "star"
        );


        this.radius=
        20+
        Math.sqrt(mass);


        this.color="orange";


    }



    draw(){


        let glow =
        ctx.createRadialGradient(

            this.x,
            this.y,
            5,

            this.x,
            this.y,
            80

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

            this.x,

            this.y,

            80,

            0,

            Math.PI*2

        );


        ctx.fill();



        ctx.fillStyle="orange";


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
// 行星
// ========================

class Planet extends Body{


    constructor(
        star,
        distance,
        size
    ){


        super(

            star.x+distance,

            star.y,

            size,

            "planet"

        );


        this.star=star;


        this.distance=distance;


        this.angle=
        Math.random()*Math.PI*2;



        this.speed=
        0.02+
        Math.random()*0.02;



        this.radius=
        size*2;


    }




    move(){


        this.angle+=
        this.speed;



        this.x =
        this.star.x+
        Math.cos(this.angle)
        *
        this.distance;



        this.y =
        this.star.y+
        Math.sin(this.angle)
        *
        this.distance;


    }




    draw(){


        ctx.fillStyle=
        "#3399ff";


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
// 黑洞
// ========================

class BlackHole extends Body{


    constructor(x,y){


        super(

            x,

            y,

            800,

            "blackhole"

        );


        this.radius=35;


    }



    eat(){


        for(
            let i=
            Universe.bodies.length-1;

            i>=0;

            i--
        ){


            let body =
            Universe.bodies[i];


            if(body===this)
            continue;



            let dx =
            body.x-this.x;


            let dy =
            body.y-this.y;



            let distance =
            Math.sqrt(
                dx*dx+
                dy*dy
            );



            if(
                distance <
                this.radius+
                body.radius
            ){


                this.mass +=
                body.mass;



                this.radius =
                Math.sqrt(
                    this.mass
                );


                createExplosion(

                    body.x,

                    body.y

                );



                Universe.bodies.splice(
                    i,
                    1
                );



            }



        }


    }




    draw(){



        // 引力光晕

        let gradient =
        ctx.createRadialGradient(

            this.x,

            this.y,

            10,

            this.x,

            this.y,

            120

        );



        gradient.addColorStop(
            0,
            "purple"
        );


        gradient.addColorStop(
            1,
            "transparent"
        );



        ctx.fillStyle=
        gradient;



        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            120,

            0,

            Math.PI*2

        );


        ctx.fill();




        // 黑洞

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





// ========================
// 能量粒子
// ========================

class Particle{


    constructor(x,y){


        this.x=x;

        this.y=y;



        let angle =
        Math.random()
        *
        Math.PI
        *
        2;



        let speed =
        Math.random()*5+1;



        this.vx =
        Math.cos(angle)
        *
        speed;



        this.vy =
        Math.sin(angle)
        *
        speed;



        this.life=100;


    }





    update(){


        this.x+=this.vx;

        this.y+=this.vy;



        this.vx*=0.98;

        this.vy*=0.98;



        this.life--;


    }




    draw(){


        ctx.fillStyle=
        "orange";


        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            2,

            0,

            Math.PI*2

        );


        ctx.fill();


    }


}






// ========================
// 爆炸
// ========================

function createExplosion(x,y){



    for(
        let i=0;

        i<50;

        i++
    ){


        Universe.particles.push(

            new Particle(
                x,
                y
            )

        );


    }


}



// ========================
// 创建宇宙
// ========================


// 创建中心恒星

let sun =
new Star(

    canvas.width/2,

    canvas.height/2,

    500

);



Universe.bodies.push(
    sun
);


Universe.stars.push(
    sun
);




// 创建行星

Universe.bodies.push(

    new Planet(
        sun,
        120,
        5
    )

);


Universe.bodies.push(

    new Planet(
        sun,
        220,
        8
    )

);


Universe.bodies.push(

    new Planet(
        sun,
        330,
        12
    )

);





// 创建一些宇宙尘埃

for(
    let i=0;

    i<100;

    i++
){


    Universe.bodies.push(

        new Body(

            Math.random()
            *
            canvas.width,


            Math.random()
            *
            canvas.height,


            Math.random()*3+1,

            "dust"

        )

    );


}





// 创建黑洞

Universe.blackHole =

new BlackHole(

    canvas.width*0.75,

    canvas.height/2

);



Universe.bodies.push(

    Universe.blackHole

);






// ========================
// 物理更新
// ========================

function update(){



    Universe.age++;



    let bodies =
    Universe.bodies;



    // 引力计算

    for(
        let a of bodies
    ){


        for(
            let b of bodies
        ){


            if(a!==b
            &&
            a.type!=="planet"
            ){


                a.gravity(b);


            }


        }


    }





    // 黑洞吞噬

    if(
        Universe.blackHole
    ){

        Universe.blackHole.eat();

    }






    // 天体移动

    for(
        let body of bodies
    ){


        body.move();


    }






    // 粒子更新

    for(
        let i=
        Universe.particles.length-1;

        i>=0;

        i--
    ){



        let p =
        Universe.particles[i];


        p.update();



        if(
            p.life<=0
        ){


            Universe.particles.splice(
                i,
                1
            );


        }



    }



}








// ========================
// 绘制
// ========================

function draw(){



    // 留下运动轨迹

    ctx.fillStyle =

    "rgba(0,0,0,0.2)";



    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );





    // 绘制天体

    for(
        let body of Universe.bodies
    ){


        body.draw();


    }





    // 绘制粒子

    for(
        let p of Universe.particles
    ){


        p.draw();


    }





    // 信息

    ctx.fillStyle="white";


    ctx.font="16px Arial";


    ctx.fillText(

        "Universe Age: "
        +
        Universe.age,


        20,

        30

    );


    ctx.fillText(

        "Bodies: "
        +
        Universe.bodies.length,


        20,

        55

    );



}







// ========================
// 游戏循环
// ========================

function animate(){



    update();


    draw();



    requestAnimationFrame(
        animate
    );


}



animate();