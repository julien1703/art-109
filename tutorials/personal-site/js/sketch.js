// p5.js Animated Background - Particles with Sine Waves
// By Julien Offray for Portfolio Assignment

let particles = [];
let numParticles = 80;

function setup() {
  // Create fullscreen canvas
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  
  // Create particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Subtle gradient background (white to very light gray)
  background(255);
  
  // Update and display all particles
  for (let particle of particles) {
    particle.update();
    particle.display();
    particle.connect(particles);
  }
}

// Particle class with sine wave movement
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.size = random(2, 5);
    this.angle = random(TWO_PI);
    this.angleSpeed = random(0.01, 0.03);
    this.amplitude = random(30, 80);
    this.offset = random(1000);
  }
  
  update() {
    // Sine wave movement for smooth, organic motion
    this.angle += this.angleSpeed;
    
    // Move base position slowly
    this.baseX += this.vx;
    this.baseY += this.vy;
    
    // Add sine wave oscillation
    this.x = this.baseX + sin(this.angle + this.offset) * this.amplitude;
    this.y = this.baseY + cos(this.angle * 0.7 + this.offset) * this.amplitude * 0.6;
    
    // Wrap around edges
    if (this.baseX < -50) this.baseX = width + 50;
    if (this.baseX > width + 50) this.baseX = -50;
    if (this.baseY < -50) this.baseY = height + 50;
    if (this.baseY > height + 50) this.baseY = -50;
  }
  
  display() {
    // Draw particle with red accent color
    noStroke();
    fill(239, 68, 68, 180); // var(--accent) with transparency
    circle(this.x, this.y, this.size);
  }
  
  connect(particles) {
    // Draw lines between nearby particles
    for (let other of particles) {
      let d = dist(this.x, this.y, other.x, other.y);
      
      if (d < 120 && d > 0) {
        // Line opacity based on distance
        let alpha = map(d, 0, 120, 80, 0);
        stroke(100, 116, 139, alpha); // var(--muted) with fade
        strokeWeight(0.8);
        line(this.x, this.y, other.x, other.y);
      }
    }
  }
}

// Responsive canvas resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}