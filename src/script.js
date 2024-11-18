const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function Particle(x, y, dx, dy, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.color = color;
  this.radius = random(1, 3);
  this.alpha = 1;

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  };

  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 0.01;
    this.radius -= 0.01;
    this.draw();
  };
}

let particles = [];

function createFirework() {
  let particleCount = random(100, 200);
  let x = random(0, canvas.width);
  let y = canvas.height;
  let color = `hsl(${random(0, 360)}, 100%, 50%)`;

  for (let i = 0; i < particleCount; i++) {
    let dx = random(-10, 10);
    let dy = random(-20, -5);
    particles.push(new Particle(x, y, dx, dy, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (Math.random() < 0.05) {
    createFirework();
  }
}

animate();