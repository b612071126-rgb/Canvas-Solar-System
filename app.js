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
// Vector 向量系统
// ========================

class Vector{


constructor(x=0,y=0){

    this.x=x;

    this.y=y;

}




add(v){

    this.x+=v.x;

    this.y+=v.y;

}





sub(v){

    this.x-=v.x;

    this.y-=v.y;

}





multiply(n){

    this.x*=n;

    this.y*=n;

}





clone(){

    return new Vector(
        this.x,
        this.y
    );

}




length(){

    return Math.sqrt(

        this.x*this.x+

        this.y*this.y

    );

}




normalize(){

    let l=
    this.length();


    if(l===0)
    return;



    this.x/=l;

    this.y/=l;


}



}









// ========================
// Camera
// ========================

const Camera={


x:0,

y:0,

zoom:1,



worldToScreen(x,y){


return {


x:
(x-this.x)
*
this.zoom
+
canvas.width/2,



y:
(y-this.y)
*
this.zoom
+
canvas.height/2


};



}


};








// ========================
// Universe
// ========================

const Universe={



age:0,



// 万有引力常数

G:0.05,



bodies:[],


galaxies:[],


particles:[]



};









// ========================
// Physics Body
// ========================

class Body{


constructor(

x,

y,

mass,

type="body"

){



this.position =
new Vector(

x,

y

);



this.velocity =
new Vector(

0,

0

);



this.acceleration =
new Vector(

0,

0

);



this.mass =
mass;



this.type =
type;



this.radius =
Math.sqrt(mass)*2;



}





// 受到力

applyForce(force){



let acceleration =
force.clone();



acceleration.multiply(

1/
this.mass

);



this.acceleration.add(

acceleration

);



}






// 引力计算

gravity(other){



let direction =
other.position.clone();



direction.sub(

this.position

);



let distance =
direction.length();



if(
distance<10
)
return;



direction.normalize();



let force =

Universe.G *

this.mass *

other.mass /

(
distance*
distance
);



direction.multiply(
force
);



this.applyForce(

direction

);



}








// 物理更新

updatePhysics(){



this.velocity.add(

this.acceleration

);



this.position.add(

this.velocity

);



this.acceleration.multiply(

0

);



}








draw(){



let p =
Camera.worldToScreen(

this.position.x,

this.position.y

);



ctx.fillStyle =
"white";



ctx.beginPath();



ctx.arc(

p.x,

p.y,

this.radius*
Camera.zoom,

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


constructor(
x,
y,
mass
){


super(

x,

y,

mass,

"star"

);



this.radius =
Math.random()*2+2;



this.color =
Math.random()>0.5
?
"#ffffff"
:
"#ffe9a0";



}





draw(){



let p =
Camera.worldToScreen(

this.position.x,

this.position.y

);



ctx.fillStyle =
this.color;



ctx.beginPath();



ctx.arc(

p.x,

p.y,

this.radius*
Camera.zoom,

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


constructor(
x,
y,
mass
){


super(

x,

y,

mass,

"blackhole"

);



this.radius=40;



}




draw(){



let p =
Camera.worldToScreen(

this.position.x,

this.position.y

);





// 吸积盘

ctx.strokeStyle=
"purple";

ctx.lineWidth=4;



ctx.beginPath();



ctx.arc(

p.x,

p.y,

80*
Camera.zoom,

0,

Math.PI*2

);



ctx.stroke();






// 黑洞主体


ctx.fillStyle=
"black";



ctx.beginPath();



ctx.arc(

p.x,

p.y,

this.radius*
Camera.zoom,

0,

Math.PI*2

);



ctx.fill();



}



}








// ========================
// 暗物质晕
// ========================

class DarkMatter{


constructor(

x,

y,

radius,

mass

){


this.x=x;

this.y=y;


this.radius=radius;


this.mass=mass;



}







applyGravity(body){



let dx =
this.x-
body.position.x;


let dy =
this.y-
body.position.y;



let distance =
Math.sqrt(
dx*dx+
dy*dy
);



if(
distance>this.radius
)
return;



let direction =
new Vector(
dx,
dy
);



direction.normalize();



let force =

Universe.G *

this.mass *

body.mass /

(
distance*
distance
);



direction.multiply(
force
);



body.applyForce(
direction
);



}



}


// ========================
// Galaxy
// ========================

class Galaxy{


constructor(

x,

y,

size

){



this.x=x;

this.y=y;


this.size=size;



this.darkMatter =

new DarkMatter(

x,

y,

size,

50000

);





this.blackHole =

new BlackHole(

x,

y,

10000

);



Universe.bodies.push(

this.blackHole

);



this.generateStars();



}





generateStars(){



let count=600;



for(
let i=0;

i<count;

i++

){



let distance =

Math.random()
*
this.size;




let angle =

Math.random()
*
Math.PI*
2;



let star =

new Star(

this.x+
Math.cos(angle)
*
distance,


this.y+
Math.sin(angle)
*
distance,


Math.random()*5+1

);




// 设置初始轨道速度


let speed =

Math.sqrt(

Universe.G*
this.blackHole.mass/
distance

);



star.velocity.x =

-Math.sin(angle)
*
speed;



star.velocity.y =

Math.cos(angle)
*
speed;





Universe.bodies.push(

star

);



}



}





update(){



for(
let body of Universe.bodies
){


this.darkMatter.applyGravity(
body
);



}



}




}



// ========================
// 创建银河
// ========================


let galaxy =

new Galaxy(

    0,

    0,

    1500

);



Universe.galaxies.push(
    galaxy
);







// ========================
// Camera 手机控制
// ========================


let touching=false;


let lastX=0;


let lastY=0;




canvas.addEventListener(

"touchstart",

e=>{


touching=true;


lastX=
e.touches[0].clientX;


lastY=
e.touches[0].clientY;



}

);






canvas.addEventListener(

"touchmove",

e=>{


if(!touching)
return;



let x =
e.touches[0].clientX;



let y =
e.touches[0].clientY;




let dx =
x-lastX;



let dy =
y-lastY;




Camera.x -=

dx/
Camera.zoom;



Camera.y -=

dy/
Camera.zoom;




lastX=x;


lastY=y;



}

);






canvas.addEventListener(

"touchend",

()=>{


touching=false;


}

);









// ========================
// 鼠标缩放测试
// ========================


canvas.addEventListener(

"wheel",

e=>{


if(
e.deltaY<0
){

Camera.zoom*=1.1;


}

else{


Camera.zoom*=0.9;


}




if(
Camera.zoom<0.1
)

Camera.zoom=0.1;



if(
Camera.zoom>5
)

Camera.zoom=5;



}

);








// ========================
// 物理更新
// ========================

function update(){



Universe.age++;





// 银河影响

for(
let galaxy of Universe.galaxies
){


galaxy.update();



}





let bodies =
Universe.bodies;






// 简化引力

for(
let i=0;

i<bodies.length;

i++

){



let a =
bodies[i];



for(
let j=i+1;

j<bodies.length;

j++

){



let b =
bodies[j];



a.gravity(b);


b.gravity(a);



}



}





// 更新位置


for(
let body of bodies
){


body.updatePhysics();



}




}









// ========================
// 绘制
// ========================

function draw(){



ctx.fillStyle=

"rgba(0,0,0,0.35)";



ctx.fillRect(

0,

0,

canvas.width,

canvas.height

);






for(
let body of Universe.bodies
){


body.draw();



}







// 信息


ctx.fillStyle=
"white";


ctx.font=
"16px Arial";



ctx.fillText(

"Galaxy Simulation",

20,

30

);



ctx.fillText(

"Stars: "
+
Universe.bodies.length,

20,

55

);



ctx.fillText(

"Time: "
+
Universe.age,

20,

80

);



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
