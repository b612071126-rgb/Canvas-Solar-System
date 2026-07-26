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
// Vector
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


G:0.05,


bodies:[],


galaxies:[]


};








// ========================
// 基础实体
// ========================

class Body{


constructor(
x,
y,
mass,
type="body"
){


this.x=x;

this.y=y;


this.mass=mass;


this.type=type;



this.radius=
Math.sqrt(mass)*2;



this.angle=0;



}




draw(){


let p=
Camera.worldToScreen(
this.x,
this.y
);



ctx.fillStyle=
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



this.radius=
2+
Math.random()*3;



this.brightness=
Math.random();



}





draw(){


let p=
Camera.worldToScreen(
this.x,
this.y
);



ctx.fillStyle=
this.brightness>0.5
?
"white"
:
"#aaa";



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


this.radius=30;


}




draw(){


let p =
Camera.worldToScreen(
this.x,
this.y
);



ctx.fillStyle="black";


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




ctx.strokeStyle="purple";


ctx.lineWidth=3;



ctx.beginPath();



ctx.arc(

p.x,

p.y,

60*
Camera.zoom,

0,

Math.PI*2

);



ctx.stroke();



}



}








// ========================
// 银河
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



this.rotation=0;



this.speed=0.002;



this.stars=[];



// 中心黑洞

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



let count=800;



for(
let i=0;

i<count;

i++

){



// 距离中心

let distance =
Math.random()
*
this.size;



// 旋臂角度

let arm =
Math.floor(
Math.random()*3
);



let angle =

arm*
(
Math.PI*2/3
)

+

distance*
0.004

+

Math.random()*0.5;






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




// 保存银河信息

star.galaxy=this;


star.distance=
distance;


star.angle=
angle;




this.stars.push(
star
);



Universe.bodies.push(
star
);



}



}








update(){



this.rotation+=
this.speed;



for(
let star of this.stars
){



star.angle +=
this.speed;



star.x =

this.x +

Math.cos(
star.angle
)
*
star.distance;




star.y =

this.y +

Math.sin(
star.angle
)
*
star.distance;




}



}





draw(){



// 银河范围提示


let p =
Camera.worldToScreen(

this.x,

this.y

);



ctx.strokeStyle=
"rgba(100,100,255,0.15)";



ctx.beginPath();



ctx.arc(

p.x,

p.y,

this.size*
Camera.zoom,

0,

Math.PI*2

);



ctx.stroke();



}



}



// ========================
// 创建银河
// ========================


let galaxy =

new Galaxy(

    0,

    0,

    1200

);



Universe.galaxies.push(
    galaxy
);







// ========================
// 摄像机控制
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



let x=
e.touches[0].clientX;


let y=
e.touches[0].clientY;




let dx=
x-lastX;


let dy=
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
// 缩放
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
// 更新宇宙
// ========================


function update(){



Universe.age++;




// 银河旋转

for(
let galaxy of Universe.galaxies
){


galaxy.update();



}





}








// ========================
// 绘制
// ========================


function draw(){



// 星空背景


ctx.fillStyle=

"rgba(0,0,0,0.25)";



ctx.fillRect(

0,

0,

canvas.width,

canvas.height

);






// 银河结构


for(
let galaxy of Universe.galaxies
){


galaxy.draw();



}





// 所有天体


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

"Galaxy Age: "
+
Universe.age,

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

"Zoom: "
+
Camera.zoom.toFixed(2),

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
