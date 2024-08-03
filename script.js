const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const characterImage = new Image();
characterImage.src = 'character.jpg'; // Replace with the path to your character image

const groundHeight = canvas.height - 70;
const gravity = 0.6;
const jumpStrength = 12;

class Character {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.y = groundHeight - this.height;
        this.yVelocity = 0;
        this.jumping = false;
        this.jumpCounter = 0;
        this.successfulJump = false;
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.yVelocity = -jumpStrength;
        }
    }

    update() {
        if (this.jumping) {
            this.yVelocity += gravity;
            this.y += this.yVelocity;

            if (this.y >= groundHeight - this.height) {
                this.y = groundHeight - this.height;
                this.jumping = false;

                // Check if the jump was successful (cleared an obstacle)
                if (this.successfulJump) {
                    this.jumpCounter++;
                    this.successfulJump = false;

                    if (this.jumpCounter >= 15) {
                        gameOver = true;
                        alert('ΜΠΡΑΒΟ ΘΑΡΑ ΚΕΡΔΙΘΑΜΕ!');
                        resetGame();
                        return;
                    }
                }
            }
        }
    }

    draw() {
        ctx.drawImage(characterImage, this.x, this.y, this.width, this.height);
    }
}

class Obstacle {
    constructor() {
        this.width = 20;
        this.height = 50;
        this.x = canvas.width;
        this.y = groundHeight - this.height;
        this.speed = 5;
        this.cleared = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width + Math.random() * 300;
            this.cleared = false; // Reset the cleared status for the new position
        }
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkClearance(character) {
        if (!this.cleared && character.x > this.x + this.width) {
            this.cleared = true;
            return true;
        }
        return false;
    }
}

let character;
let obstacles;
let gameOver = false;
let countdown = 5;

function resetGame() {
    character = new Character();
    obstacles = [new Obstacle()];
    gameOver = false;
    countdown = 5;
    startCountdown();
}

function startCountdown() {
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px serif';
        ctx.fillText(countdown, canvas.width / 2 - 15, canvas.height / 2 + 15);
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameLoop();
        }
    }, 1000);
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    character.update();
    character.draw();

    for (let obstacle of obstacles) {
        obstacle.update();
        obstacle.draw();

        if (character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y) {
            gameOver = true;
            alert('Πω χάθαμε... Δεν πειράδει πάμε κθανά!');
            resetGame();
            return;
        }

        if (obstacle.checkClearance(character)) {
            character.successfulJump = true;
        }
    }

    ctx.font = '24px serif';
    ctx.fillText(`Jumps: ${character.jumpCounter}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        character.jump();
    }
});

// Ensure the image is loaded before starting the game
characterImage.onload = function() {
    resetGame();
};

characterImage.onerror = function() {
    console.error('Failed to load character image.');
};
