const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const winScreen = document.getElementById('winScreen');

const playerWidth = 50;
const playerHeight = 50;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let backgroundOffset = 0;
let animationFrameId;
let particles = [];
let fireballs = [];

const lastKeydownTimes = {};
const fireballCooldown = 1000;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() * 2 - 1) * 4;
        this.speedY = (Math.random() * 2 - 1) * 4;
        this.life = 100;
        // this.gravity = 0;
        this.friction = 0.99;
    }

    update() {
        // this.speedY += this.gravity;
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = playerWidth;
        this.height = playerHeight;
        this.color = color;
        this.controls = controls;
        this.speed = 5;
        this.isPunching = false;
        this.punchTimer = 0;
        this.isShooting = false;
        this.isThrowingFireball = false;
        this.health = 100;
        this.lastDirection = 'up';
        this.lastFireballTime = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        if (this.controls.up && this.y > 0) {
            this.y -= this.speed;
            this.lastDirection = 'up';
        }
        if (this.controls.down && this.y < canvasHeight - this.height) {
            this.y += this.speed;
            this.lastDirection = 'down';
        }
        if (this.controls.left && this.x > 0) {
            this.x -= this.speed;
            this.lastDirection = 'left';
        }
        if (this.controls.right && this.x < canvasWidth - this.width) {
            this.x += this.speed;
            this.lastDirection = 'right';
        }
    }

    punch() {
        if (this.isPunching) {
            ctx.fillStyle = "#fff";
            let punchWidth = 20, punchHeight = 10;
            let punchX = this.x + this.width, punchY = this.y + 20;
            if (this.lastDirection === 'up') {
                punchX = this.x + 20;
                punchY = this.y - 20;
                punchWidth = 10;
                punchHeight = 20;
            } else if (this.lastDirection === 'down') {
                punchX = this.x + 20;
                punchY = this.y + this.height;
                punchWidth = 10;
                punchHeight = 20;
            } else if (this.lastDirection === 'left') {
                punchX = this.x - 20;
                punchY = this.y + 20;
                punchWidth = 20;
                punchHeight = 10;
            }
            ctx.fillRect(punchX, punchY, punchWidth, punchHeight);
            this.punchTimer--;
            if (this.punchTimer <= 0) {
                this.isPunching = false;
            }
        }
    }

    shoot() {
        if (this.isShooting) {
            let bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.lastDirection, this.color, this);
            bullets.push(bullet);
            this.isShooting = false;
        }
    }

    throwFireball() {
        if (this.isThrowingFireball) {
            let now = Date.now();
            if (now - this.lastFireballTime >= fireballCooldown) {
                let fireball = new Fireball(this.x + this.width / 2, this.y + this.height / 2, this.lastDirection, 'orange', this);
                fireballs.push(fireball);
                this.lastFireballTime = now;
            }
            this.isThrowingFireball = false;
        }
    }

    displayHealth() {
        ctx.fillStyle = "#00ff00";
        ctx.font = "25px Verdana";
        if (this.health >= 100) {
            ctx.fillText(`~${this.health}~`, this.x-19, this.y - 10);
        }
        else if (this.health >= 10) {
            ctx.fillText(`~${this.health}~`, this.x-10, this.y - 10);
        } 
        else {
            ctx.fillText(`~${this.health}~`, this.x-3, this.y - 10)
        }
    }

    takeDamage(amt, direction) {
        this.health -= amt;
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(this.x + this.width / 2, this.y + this.height / 2, this.color));
        }
        this.applyKnockback(direction);
    }

    applyKnockback(direction) {
        const knockbackSpeed = 60;
        // const knockbackFriction = 0.35;
        if (direction === 'up' && this.y > 0) {
            this.y -= knockbackSpeed;
            this.speedY = -knockbackSpeed;
        }
        if (direction === 'down' && this.y < canvasHeight - this.height) {
            this.y += knockbackSpeed;
            this.speedY = knockbackSpeed;
        }
        if (direction === 'left' && this.x > 0) {
            this.x -= knockbackSpeed;
            this.speedX = -knockbackSpeed;
        }
        if (direction === 'right' && this.x < canvasWidth - this.width) {
            this.x += knockbackSpeed;
            this.speedX = knockbackSpeed;
        }
    }
}

class Bullet {
    constructor(x, y, direction, color, owner) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        this.size = 5;
        this.speed = 10;
        this.owner = owner;
    }

    update() {
        if (this.direction === 'up') this.y -= this.speed;
        if (this.direction === 'down') this.y += this.speed;
        if (this.direction === 'left') this.x -= this.speed;
        if (this.direction === 'right') this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Fireball {
    constructor(x, y, direction, color, owner) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        this.size = 10;
        this.speed = 7;
        this.owner = owner;
    }

    update() {
        if (this.direction === 'up') this.y -= this.speed;
        if (this.direction === 'down') this.y += this.speed;
        if (this.direction === 'left') this.x -= this.speed;
        if (this.direction === 'right') this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let player1, player2;
let bullets = [];

function init() {
    player1 = new Player(100, canvasHeight / 2 - playerHeight / 2, 'red', {
        up: false,
        down: false,
        left: false,
        right: false,
        punch: false,
        shoot: false,
        fireball: false
    });

    player2 = new Player(650, canvasHeight / 2 - playerHeight / 2, 'blue', {
        up: false,
        down: false,
        left: false,
        right: false,
        punch: false,
        shoot: false,
        fireball: false
    });
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            player1.controls.up = true;
            lastKeydownTimes['w'] = +new Date();
            break;
        case 's':
            player1.controls.down = true;
            lastKeydownTimes['s'] = +new Date();
            break;
        case 'a':
            player1.controls.left = true;
            lastKeydownTimes['a'] = +new Date();
            break;
        case 'd':
            player1.controls.right = true;
            lastKeydownTimes['d'] = +new Date();
            break;
        case 'f':
            player1.isPunching = true;
            player1.punchTimer = 10;
            break;
        case 'g':
            player1.isShooting = true;
            break;
        case 'h':
            player1.isThrowingFireball = true;
            break;
        case 'ArrowUp':
            player2.controls.up = true;
            lastKeydownTimes['ArrowUp'] = +new Date();
            break;
        case 'ArrowDown':
            player2.controls.down = true;
            lastKeydownTimes['ArrowDown'] = +new Date();
            break;
        case 'ArrowLeft':
            player2.controls.left = true;
            lastKeydownTimes['ArrowLeft'] = +new Date();
            break;
        case 'ArrowRight':
            player2.controls.right = true;
            lastKeydownTimes['ArrowRight'] = +new Date();
            break;
        case ']':
            player2.isPunching = true;
            player2.punchTimer = 10;
            break;
        case '\\':
            player2.isShooting = true;
            break;
        case '\'':
            player2.isThrowingFireball = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            player1.controls.up = false;
            break;
        case 's':
            player1.controls.down = false;
            break;
        case 'a':
            player1.controls.left = false;
            break;
        case 'd':
            player1.controls.right = false;
            break;
        case 'ArrowUp':
            player2.controls.up = false;
            break;
        case 'ArrowDown':
            player2.controls.down = false;
            break;
        case 'ArrowLeft':
            player2.controls.left = false;
            break;
        case 'ArrowRight':
            player2.controls.right = false;
            break;
        case 'r':
            cancelAnimationFrame(animationFrameId);
            init();
            canvas.style.filter = 'none';
            blurEnabled = false;
            winScreen.style.display = 'none';
            update();
            break;
    }
});

setInterval(() => {
    const now = +new Date();
    for (let key in lastKeydownTimes) {
        if (now - lastKeydownTimes[key] >= 1000) {
            switch (key) {
                case 'w':
                    player1.controls.up = false;
                    break;
                case 's':
                    player1.controls.down = false;
                    break;
                case 'a':
                    player1.controls.left = false;
                    break;
                case 'd':
                    player1.controls.right = false;
                    break;
                case 'ArrowUp':
                    player2.controls.up = false;
                    break;
                case 'ArrowDown':
                    player2.controls.down = false;
                    break;
                case 'ArrowLeft':
                    player2.controls.left = false;
                    break;
                case 'ArrowRight':
                    player2.controls.right = false;
                    break;
            }
        }
    }
}, 1000);

function checkCollision(player1, player2) {
    let punchWidth = 20, punchHeight = 10;
    let punchX = player1.x + player1.width, punchY = player1.y + 20;
    if (player1.lastDirection === 'up') {
        punchX = player1.x + 20;
        punchY = player1.y - 20;
        punchWidth = 10;
        punchHeight = 20;
    } else if (player1.lastDirection === 'down') {
        punchX = player1.x + 20;
        punchY = player1.y + player1.height;
        punchWidth = 10;
        punchHeight = 20;
    } else if (player1.lastDirection === 'left') {
        punchX = player1.x - 20;
        punchY = player1.y + 20;
        punchWidth = 20;
        punchHeight = 10;
    }
    if (player1.isPunching && punchX < player2.x + player2.width &&
        punchX + punchWidth > player2.x &&
        punchY < player2.y + player2.height &&
        punchY + punchHeight > player2.y) {
        player2.takeDamage(10, player1.lastDirection);
        player1.isPunching = false;
    }

    punchWidth = 20;
    punchHeight = 10;
    punchX = player2.x + player2.width;
    punchY = player2.y + 20;
    if (player2.lastDirection === 'up') {
        punchX = player2.x + 20;
        punchY = player2.y - 20;
        punchWidth = 10;
        punchHeight = 20;
    } else if (player2.lastDirection === 'down') {
        punchX = player2.x + 20;
        punchY = player2.y + player2.height;
        punchWidth = 10;
        punchHeight = 20;
    } else if (player2.lastDirection === 'left') {
        punchX = player2.x - 20;
        punchY = player2.y + 20;
        punchWidth = 20;
        punchHeight = 10;
    }
    if (player2.isPunching && punchX < player1.x + player1.width &&
        punchX + punchWidth > player1.x &&
        punchY < player1.y + player1.height &&
        punchY + punchHeight > player1.y) {
        player1.takeDamage(10, player2.lastDirection);
        player2.isPunching = false;
    }

    bullets.forEach((bullet, index) => {
        if (bullet.owner !== player1 && bullet.x < player1.x + player1.width &&
            bullet.x + bullet.size > player1.x &&
            bullet.y < player1.y + player1.height &&
            bullet.y + bullet.size > player1.y) {
            player1.takeDamage(5, bullet.direction);
            bullets.splice(index, 1);
        }

        if (bullet.owner !== player2 && bullet.x < player2.x + player2.width &&
            bullet.x + bullet.size > player2.x &&
            bullet.y < player2.y + player2.height &&
            bullet.y + bullet.size > player2.y) {
            player2.takeDamage(5, bullet.direction);
            bullets.splice(index, 1);
        }
    });

    fireballs.forEach((fireball, index) => {
        if (fireball.owner !== player1 && fireball.x < player1.x + player1.width &&
            fireball.x + fireball.size > player1.x &&
            fireball.y < player1.y + player1.height &&
            fireball.y + fireball.size > player1.y) {
            player1.takeDamage(15, fireball.direction);
            fireballs.splice(index, 1);
        }

        if (fireball.owner !== player2 && fireball.x < player2.x + player2.width &&
            fireball.x + fireball.size > player2.x &&
            fireball.y < player2.y + player2.height &&
            fireball.y + fireball.size > player2.y) {
            player2.takeDamage(15, fireball.direction);
            fireballs.splice(index, 1);
        }
    });
}

function drawBackground() {
    const backgroundSpeed = 0.6;
    const initialOffset = -40;
    backgroundOffset += backgroundSpeed;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#333';
    for (let i = initialOffset - (backgroundOffset % 40); i < canvasWidth; i += 40) {
        ctx.fillRect(i, 0, 20, canvasHeight);
    }
}

function update() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBackground();

    player1.move();
    player1.draw();
    player1.punch();
    player1.shoot();
    player1.throwFireball();
    player1.displayHealth();

    player2.move();
    player2.draw();
    player2.punch();
    player2.shoot();
    player2.throwFireball();
    player2.displayHealth();

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.x < 0 || bullet.x > canvasWidth || bullet.y < 0 || bullet.y > canvasHeight) {
            bullets.splice(index, 1);
        }
    });

    fireballs.forEach((fireball, index) => {
        fireball.update();
        fireball.draw();
        if (fireball.x < 0 || fireball.x > canvasWidth || fireball.y < 0 || fireball.y > canvasHeight) {
            fireballs.splice(index, 1);
        }
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });

    checkCollision(player1, player2);

    if (player1.health <= 0 || player2.health <= 0) {
        if (!blurEnabled) {
            canvas.style.filter = 'blur(5px)';
            blurEnabled = true;
        }
        winScreen.style.display = 'block';
        winScreen.textContent = player1.health <= 0 ? 'Player 2 Wins! [r to restart]' : 'Player 1 Wins! [r to restart]';
        return;
    }

    animationFrameId = requestAnimationFrame(update);
}

// resetButton.addEventListener('click', () => {
//     cancelAnimationFrame(animationFrameId);
//     init();
//     canvas.style.filter = 'none';
//     blurEnabled = false;
//     winScreen.style.display = 'none';
//     update();
// });

cancelAnimationFrame(animationFrameId);
init();
canvas.style.filter = 'none';
blurEnabled = false;
winScreen.style.display = 'none';
update();


var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.code] = true;
        switch(e.code){
            case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
            case "Space": e.preventDefault(); break;
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.code] = false;
    },
false);