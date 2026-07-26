// ========================
// Canvas 初始化
// ========================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ========================
// Vector 向量系统 (保持不变)
// ========================
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) { this.x += v.x; this.y += v.y; }
    sub(v) { this.x -= v.x; this.y -= v.y; }
    multiply(n) { this.x *= n; this.y *= n; }
    clone() { return new Vector(this.x, this.y); }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() {
        const l = this.length();
        if (l === 0) return;
        this.x /= l;
        this.y /= l;
    }
}

// ========================
// Camera (增强：触摸状态收进内部)
// ========================
const Camera = {
    x: 0,
    y: 0,
    zoom: 1,

    // 移动端拖拽状态
    _touching: false,
    _lastX: 0,
    _lastY: 0,

    worldToScreen(wx, wy) {
        return {
            x: (wx - this.x) * this.zoom + canvas.width / 2,
            y: (wy - this.y) * this.zoom + canvas.height / 2
        };
    },

    // 事件绑定（内部统一处理）
    bindEvents(canvas) {
        canvas.addEventListener("touchstart", e => {
            e.preventDefault();
            this._touching = true;
            this._lastX = e.touches[0].clientX;
            this._lastY = e.touches[0].clientY;
        });

        canvas.addEventListener("touchmove", e => {
            e.preventDefault();
            if (!this._touching) return;
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            const dx = x - this._lastX;
            const dy = y - this._lastY;
            this.x -= dx / this.zoom;
            this.y -= dy / this.zoom;
            this._lastX = x;
            this._lastY = y;
        });

        canvas.addEventListener("touchend", e => {
            e.preventDefault();
            this._touching = false;
        });

        canvas.addEventListener("wheel", e => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoom *= 1.1;
            } else {
                this.zoom *= 0.9;
            }
            this.zoom = Math.min(Math.max(this.zoom, 0.1), 5);
        });
    }
};
Camera.bindEvents(canvas);

// ========================
// Universe (增加安全方法和数据管理)
// ========================
const Universe = {
    age: 0,
    G: 0.05,                // 万有引力常数
    bodies: [],
    galaxies: [],
    particles: [],

    addBody(body) {
        this.bodies.push(body);
    },

    addGalaxy(galaxy) {
        this.galaxies.push(galaxy);
    }
};

// ========================
// Physics Body (改进引力计算)
// ========================
class Body {
    constructor(x, y, mass, type = "body") {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.mass = mass;
        this.type = type;
        this.radius = Math.sqrt(mass) * 2;
    }

    applyForce(force) {
        const acc = force.clone();
        acc.multiply(1 / this.mass);
        this.acceleration.add(acc);
    }

    gravity(other) {
        const direction = other.position.clone();
        direction.sub(this.position);
        const dist = direction.length();
        
        // 防止零距离导致 NaN
        if (dist < 0.001) return;

        direction.normalize();

        // 软化因子：避免极小距离下力趋向无穷，平滑过渡
        const softening = 5;
        const forceMagnitude = Universe.G * this.mass * other.mass / (dist * dist + softening * softening);
        
        direction.multiply(forceMagnitude);
        this.applyForce(direction);
    }

    updatePhysics() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.multiply(0); // 每帧清零加速度
    }

    draw() {
        const p = Camera.worldToScreen(this.position.x, this.position.y);
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.radius * Camera.zoom, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ========================
// 恒星
// ========================
class Star extends Body {
    constructor(x, y, mass) {
        super(x, y, mass, "star");
        this.radius = Math.random() * 2 + 2;
        this.color = Math.random() > 0.5 ? "#ffffff" : "#ffe9a0";
    }
    draw() {
        const p = Camera.worldToScreen(this.position.x, this.position.y);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.radius * Camera.zoom, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ========================
// 黑洞
// ========================
class BlackHole extends Body {
    constructor(x, y, mass) {
        super(x, y, mass, "blackhole");
        this.radius = 40;
    }
    draw() {
        const p = Camera.worldToScreen(this.position.x, this.position.y);
        // 吸积盘
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 80 * Camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
        // 黑洞主体
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.radius * Camera.zoom, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ========================
// 暗物质晕 (修复 NaN 炸弹)
// ========================
class DarkMatter {
    constructor(x, y, radius, mass) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
    }

    applyGravity(body) {
        const dx = this.x - body.position.x;
        const dy = this.y - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 超出范围或位于中心极小距离时跳过
        if (distance > this.radius || distance < 0.001) return;

        const direction = new Vector(dx, dy);
        direction.normalize();
        const force = Universe.G * this.mass * body.mass / (distance * distance + 100); // 加入软化
        direction.multiply(force);
        body.applyForce(direction);
    }
}

// ========================
// 银河系 (解除对全局的直接操作)
// ========================
class Galaxy {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.darkMatter = new DarkMatter(x, y, size, 50000);
        this.blackHole = new BlackHole(x, y, 10000);
    }

    // 初始化：向宇宙注册天体 (由外部调用)
    init(universe) {
        universe.addBody(this.blackHole);
        this._generateStars(universe);
    }

    _generateStars(universe) {
        const count = 600;
        for (let i = 0; i < count; i++) {
            const distance = Math.random() * this.size;
            const angle = Math.random() * Math.PI * 2;

            const star = new Star(
                this.x + Math.cos(angle) * distance,
                this.y + Math.sin(angle) * distance,
                Math.random() * 5 + 1
            );

            // 轨道速度基于黑洞质量，并加入软化避免近距离无限大
            const softenDist = Math.max(distance, 10);
            const speed = Math.sqrt(universe.G * this.blackHole.mass / softenDist);
            star.velocity.x = -Math.sin(angle) * speed;
            star.velocity.y = Math.cos(angle) * speed;

            universe.addBody(star);
        }
    }

    // 施加暗物质引力 (作用于全宇宙天体，但可通过传入天体列表解耦，这里保持简单)
    update(universe) {
        for (let body of universe.bodies) {
            this.darkMatter.applyGravity(body);
        }
    }
}

// ========================
// 创建银河系
// ========================
const galaxy = new Galaxy(0, 0, 1500);
galaxy.init(Universe);          // 注册天体
Universe.addGalaxy(galaxy);     // 注册星系

// ========================
// 物理更新
// ========================
function update() {
    Universe.age++;

    // 暗物质影响
    for (let g of Universe.galaxies) {
        g.update(Universe);
    }

    // 天体间引力 (O(n²) 但已足够)
    const bodies = Universe.bodies;
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            bodies[i].gravity(bodies[j]);
            bodies[j].gravity(bodies[i]);
        }
    }

    // 运动积分
    for (let body of bodies) {
        body.updatePhysics();
    }
}

// ========================
// 绘制
// ========================
function draw() {
    // 拖尾效果
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let body of Universe.bodies) {
        body.draw();
    }

    // UI 信息
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Galaxy Simulation", 20, 30);
    ctx.fillText("Stars: " + Universe.bodies.length, 20, 55);
    ctx.fillText("Time: " + Universe.age, 20, 80);
}

// ========================
// 主循环
// ========================
function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();