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