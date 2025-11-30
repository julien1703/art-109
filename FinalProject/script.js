/* ========= DREAMSCAPES - INTERACTIVE JAVASCRIPT ========= */

// ========= AUDIO SYSTEM =========
let audioContext;
let audioEnabled = false;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioEnabled = !audioEnabled;
    document.getElementById('audio-toggle').textContent = audioEnabled ? '🔊' : '🔇';
}

function playDreamSound(dreamType, intensity = 0.3) {
    if (!audioEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different dream types
    switch(dreamType) {
        case -1: // Start screen
            oscillator.frequency.value = 200 + Math.random() * 300;
            oscillator.type = 'triangle';
            break;
        case 0: // Counting Sheep
            oscillator.frequency.value = 220 + Math.random() * 100;
            oscillator.type = 'sine';
            break;
        case 1: // Nightmare
            oscillator.frequency.value = 80 + Math.random() * 120;
            oscillator.type = 'sawtooth';
            break;
        case 2: // Weightlessness
            oscillator.frequency.value = 440 + Math.random() * 220;
            oscillator.type = 'triangle';
            break;
        case 3: // Thoughts
            oscillator.frequency.value = 330 + Math.random() * 440;
            oscillator.type = 'square';
            break;
        case 4: // Memories
            oscillator.frequency.value = 150 + Math.random() * 200;
            oscillator.type = 'sine';
            break;
    }

    filter.type = 'lowpass';
    filter.frequency.value = 1500 + Math.random() * 1000;

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(intensity, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
}

// ========= MAIN VARIABLES =========
let currentDream = -1; // -1 for start screen
let time = 0;
let mouseTrail = [];
let dreamSentences = [];
let isOnStartScreen = true;
let lastSentenceTime = 0;
let sentenceInterval = 3000; // 3 seconds
let startScreenParticles = [];
let ripples = [];

// Journey System - now dream-specific
let dreamJourneyActive = false;
let journeyProgress = 0;
let journeyStage = 0;
let maxJourneyStages = 5;
let stageStartTime = 0;
let stageDuration = 6000; // Base duration

// Dream-specific variables
let sheepCount = 0;
let nightmareIntensity = 0;
let weightlessGravity = 1;
let thoughtComplexity = 0;
let memoryClarity = 1;

// Dream-specific collections
let dreamSpecificElements = [];
let cloudParticles = [];
let shadowTentacles = [];
let floatingWords = [];
let memoryPhotos = [];

// Advanced Effects
let mandelbrotZoom = 1;
let mandelbrotOffsetX = 0;
let mandelbrotOffsetY = 0;
let musicVisualizer = [];
let colorPalette = [];
let morphingShapes = [];
let textParticles = [];
let zoomInEffect = false;
let dreamTransition = false;

// Dream-specific variables
let sheep = [];
let nightmareElements = [];
let floatingParticles = [];
let thoughtBubbles = [];
let memoryFragments = [];

// ========= DREAM TEXTS =========
const dreamTexts = {
    "-1": [ // Start screen
        "Dreams drift by...",
        "Which path will you choose?",
        "The night is calling...",
        "Thoughts become reality...",
        "A universe awaits...",
        "Let yourself fall...",
        "Time stands still...",
        "Dimensions merge..."
    ],
    "0": [ // Counting Sheep
        "One sheep jumps over the fence...",
        "Two sheep jump over the fence...",
        "Three sheep jumping...",
        "I'm losing count...",
        "The sheep become clouds...",
        "Gentle dreams embrace me..."
    ],
    "1": [ // Nightmare
        "Shadows are chasing me...",
        "I can't run away...",
        "The walls are closing in...",
        "Everything blurs before my eyes...",
        "A cold wind...",
        "I'm falling into nothingness..."
    ],
    "2": [ // Weightlessness
        "I'm floating through the air...",
        "Gravity has no power here...",
        "Light as a feather...",
        "The world spins around me...",
        "I dance between the stars...",
        "Endless freedom..."
    ],
    "3": [ // Thoughts
        "What if...",
        "Do you still remember...",
        "Tomorrow I will...",
        "Thoughts like soap bubbles...",
        "Why do I think of this...",
        "The mind wanders freely..."
    ],
    "4": [ // Memories
        "Once upon a time...",
        "The laughter of my childhood...",
        "Forgotten faces...",
        "The scent of yesteryear...",
        "How time passes...",
        "Precious moments..."
    ]
};

// ========= CLASSES =========
class Sheep {
    constructor() {
        this.reset();
        this.x = random(-200, -50);
    }

    reset() {
        this.x = random(-200, -50);
        this.y = height * 0.7 + random(-50, 50);
        this.jumpHeight = random(80, 150);
        this.speed = random(2, 4);
        this.jumpProgress = 0;
        this.size = random(40, 80);
        this.wooliness = random(0.8, 1.2);
    }

    update() {
        this.x += this.speed;
        this.jumpProgress += 0.08;
        
        if (this.x > width + 100) {
            this.reset();
        }
    }

    display() {
        push();
        
        // Jump arc
        let jumpY = sin(this.jumpProgress) * this.jumpHeight;
        translate(this.x, this.y - max(0, jumpY));
        
        // Body (fluffy cloud)
        fill(255, 255, 255, 200);
        noStroke();
        for (let i = 0; i < 6; i++) {
            let angle = (i / 6) * TWO_PI;
            let x = cos(angle) * this.size * 0.4 * this.wooliness;
            let y = sin(angle) * this.size * 0.3 * this.wooliness;
            ellipse(x, y, this.size * 0.6);
        }
        
        // Main body
        ellipse(0, 0, this.size);
        
        // Head
        fill(240, 240, 240);
        ellipse(this.size * 0.4, -this.size * 0.2, this.size * 0.4);
        
        // Eyes
        fill(0);
        ellipse(this.size * 0.5, -this.size * 0.25, 3);
        ellipse(this.size * 0.6, -this.size * 0.25, 3);
        
        // Legs
        stroke(50);
        strokeWeight(3);
        line(-this.size * 0.2, this.size * 0.3, -this.size * 0.2, this.size * 0.6);
        line(this.size * 0.2, this.size * 0.3, this.size * 0.2, this.size * 0.6);
        
        pop();
    }
}

class DreamSentence {
    constructor(text, dreamType) {
        this.text = text;
        this.x = random(100, width - 100);
        this.y = random(100, height - 100);
        this.size = random(16, 48);
        this.alpha = 255;
        this.rotation = random(-0.2, 0.2);
        this.rotSpeed = random(-0.01, 0.01);
        this.life = 300;
        this.maxLife = 300;
        this.driftX = random(-0.5, 0.5);
        this.driftY = random(-0.5, 0.5);
        this.dreamType = dreamType;
    }

    update() {
        this.x += this.driftX;
        this.y += this.driftY;
        this.rotation += this.rotSpeed;
        this.life--;
        this.alpha = map(this.life, 0, this.maxLife, 0, 255);
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.driftX *= -1;
        if (this.y < 0 || this.y > height) this.driftY *= -1;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        
        // Color based on dream type
        switch(this.dreamType) {
            case -1: fill(255, 255, 255, this.alpha); break; // White for start
            case 0: fill(135, 206, 235, this.alpha); break; // Sky blue
            case 1: fill(255, 100, 100, this.alpha); break; // Red
            case 2: fill(78, 205, 196, this.alpha); break; // Teal
            case 3: fill(255, 230, 109, this.alpha); break; // Yellow
            case 4: fill(168, 230, 207, this.alpha); break; // Green
        }
        
        textAlign(CENTER, CENTER);
        textSize(this.size);
        textFont('Space Mono');
        text(this.text, 0, 0);
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}

class NightmareElement {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(50, 200);
        this.angle = random(TWO_PI);
        this.speed = random(0.005, 0.02);
        this.darkness = random(0.3, 0.8);
        this.tentacles = [];
        
        for (let i = 0; i < random(3, 8); i++) {
            this.tentacles.push({
                angle: random(TWO_PI),
                length: random(50, 150),
                speed: random(0.01, 0.05)
            });
        }
    }

    update() {
        this.angle += this.speed;
        this.x += sin(this.angle) * 0.5;
        this.y += cos(this.angle) * 0.3;
        
        // Keep in bounds
        this.x = (this.x + width) % width;
        this.y = (this.y + height) % height;
        
        this.tentacles.forEach(tentacle => {
            tentacle.angle += tentacle.speed;
        });
    }

    display() {
        push();
        translate(this.x, this.y);
        
        // Draw tentacles
        this.tentacles.forEach(tentacle => {
            stroke(255, 0, 0, 100);
            strokeWeight(5);
            noFill();
            
            beginShape();
            for (let i = 0; i <= 10; i++) {
                let t = i / 10;
                let x = cos(tentacle.angle + t * PI) * tentacle.length * t;
                let y = sin(tentacle.angle + t * PI) * tentacle.length * t;
                vertex(x, y);
            }
            endShape();
        });
        
        // Main shadow form
        fill(0, 0, 0, this.darkness * 255);
        noStroke();
        
        for (let i = 0; i < 5; i++) {
            let offset = sin(time * 2 + i) * 10;
            ellipse(offset, offset, this.size - i * 10);
        }
        
        pop();
    }
}

class FloatingParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = height + 50;
        this.z = random(50, 500);
        this.speed = random(0.5, 2);
        this.size = random(5, 20);
        this.hue = random(180, 220);
        this.brightness = random(70, 100);
    }

    update() {
        this.y -= this.speed;
        this.x += sin(time + this.z * 0.01) * 0.5;
        
        if (this.y < -50) {
            this.reset();
        }
    }

    display() {
        push();
        colorMode(HSB);
        
        let alpha = map(this.z, 50, 500, 255, 50);
        fill(this.hue, 60, this.brightness, alpha);
        noStroke();
        
        let perspectiveSize = this.size * (500 / this.z);
        ellipse(this.x, this.y, perspectiveSize);
        
        // Glow effect
        fill(this.hue, 30, 100, alpha * 0.3);
        ellipse(this.x, this.y, perspectiveSize * 2);
        
        colorMode(RGB);
        pop();
    }
}

class StartParticle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.size = random(2, 8);
        this.hue = random(360);
        this.life = random(200, 400);
        this.maxLife = this.life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    display() {
        push();
        colorMode(HSB);
        let alpha = map(this.life, 0, this.maxLife, 0, 255);
        fill(this.hue, 70, 90, alpha);
        noStroke();
        ellipse(this.x, this.y, this.size);
        colorMode(RGB);
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = random(100, 200);
        this.speed = random(2, 4);
        this.alpha = 255;
    }

    update() {
        this.radius += this.speed;
        this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);
    }

    display() {
        push();
        noFill();
        stroke(255, 255, 255, this.alpha);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius * 2);
        pop();
    }

    isDead() {
        return this.radius >= this.maxRadius;
    }
}

class MorphingShape {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.points = [];
        this.numPoints = random(6, 12);
        this.baseRadius = random(30, 100);
        this.rotation = 0;
        this.rotSpeed = random(-0.02, 0.02);
        this.hue = random(360);
        
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({
                angle: (i / this.numPoints) * TWO_PI,
                radius: this.baseRadius + random(-20, 20),
                radiusSpeed: random(0.01, 0.05)
            });
        }
    }

    update() {
        this.rotation += this.rotSpeed;
        this.points.forEach(point => {
            point.radius += sin(time * point.radiusSpeed + point.angle) * 2;
        });
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        
        colorMode(HSB);
        fill(this.hue, 70, 80, 150);
        stroke(this.hue, 90, 100, 200);
        strokeWeight(2);
        
        beginShape();
        this.points.forEach(point => {
            let x = cos(point.angle) * point.radius;
            let y = sin(point.angle) * point.radius;
            vertex(x, y);
        });
        endShape(CLOSE);
        
        colorMode(RGB);
        pop();
    }
}

class TextParticle {
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-3, -1);
        this.life = 255;
        this.size = random(12, 24);
        this.rotation = 0;
        this.rotSpeed = random(-0.1, 0.1);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life -= 3;
        this.rotation += this.rotSpeed;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        fill(255, 255, 255, this.life);
        textAlign(CENTER, CENTER);
        textSize(this.size);
        text(this.text, 0, 0);
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}

class MusicVisual {
    constructor() {
        this.frequencies = [];
        for (let i = 0; i < 64; i++) {
            this.frequencies.push(random(0.1, 1));
        }
    }

    update() {
        for (let i = 0; i < this.frequencies.length; i++) {
            this.frequencies[i] = lerp(this.frequencies[i], random(0.1, 1), 0.1);
        }
    }

    display() {
        push();
        translate(width/2, height/2);
        
        for (let i = 0; i < this.frequencies.length; i++) {
            let angle = (i / this.frequencies.length) * TWO_PI;
            let radius = this.frequencies[i] * 200;
            
            colorMode(HSB);
            stroke((i * 5 + time * 50) % 360, 80, 90, 200);
            strokeWeight(4);
            
            let x1 = cos(angle) * 50;
            let y1 = sin(angle) * 50;
            let x2 = cos(angle) * (50 + radius);
            let y2 = sin(angle) * (50 + radius);
            
            line(x1, y1, x2, y2);
        }
        
        colorMode(RGB);
        pop();
    }
}

// ========= P5.JS CORE FUNCTIONS =========

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB);
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
        startScreenParticles.push(new StartParticle());
    }
    
    // Initialize dream elements
    for (let i = 0; i < 5; i++) {
        sheep.push(new Sheep());
    }
    
    for (let i = 0; i < 3; i++) {
        nightmareElements.push(new NightmareElement());
    }
    
    for (let i = 0; i < 30; i++) {
        floatingParticles.push(new FloatingParticle());
    }
    
    for (let i = 0; i < 5; i++) {
        morphingShapes.push(new MorphingShape());
    }
    
    musicVisualizer.push(new MusicVisual());
}

function draw() {
    time = millis() * 0.001;
    
    if (isOnStartScreen) {
        drawStartScreen();
    } else {
        drawDreamExperience();
    }
    
    // Update mouse trail
    mouseTrail.push({x: mouseX, y: mouseY, time: millis()});
    if (mouseTrail.length > 20) {
        mouseTrail.shift();
    }
    
    // Draw mouse trail
    drawMouseTrail();
    
    // Update dream sentences
    updateDreamSentences();
    drawDreamSentences();
    
    // Add new sentence periodically
    if (millis() - lastSentenceTime > sentenceInterval) {
        addDreamSentence();
        lastSentenceTime = millis();
    }
    
    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].display();
        if (ripples[i].isDead()) {
            ripples.splice(i, 1);
        }
    }
    
    // Update text particles for thought dream
    if (currentDream === 3) {
        updateTextParticles();
        drawTextParticles();
    }
}

function drawStartScreen() {
    // Animated gradient background
    drawAnimatedGradient();
    
    // Update and draw start particles
    for (let i = startScreenParticles.length - 1; i >= 0; i--) {
        startScreenParticles[i].update();
        startScreenParticles[i].display();
        if (startScreenParticles[i].isDead()) {
            startScreenParticles.splice(i, 1);
            startScreenParticles.push(new StartParticle());
        }
    }
    
    // Floating orbs
    drawFloatingOrbs();
}

function drawDreamExperience() {
    if (dreamJourneyActive) {
        drawJourneyStage();
        updateJourney();
    } else {
        drawDreamBackground();
        drawDreamSpecificContent();
    }
}

function drawAnimatedGradient() {
    for (let i = 0; i < height; i += 2) {
        let t = i / height;
        let wave = sin(time * 2 + t * PI) * 0.3 + 0.7;
        
        let r = lerp(15, 45, t) * wave;
        let g = lerp(25, 85, t) * wave;
        let b = lerp(55, 125, t) * wave;
        
        stroke(r, g, b, 150);
        line(0, i, width, i);
    }
}

function drawFloatingOrbs() {
    for (let i = 0; i < 8; i++) {
        let angle = time * 0.3 + i * PI / 4;
        let x = width/2 + cos(angle) * (200 + sin(time + i) * 50);
        let y = height/2 + sin(angle) * (150 + cos(time * 0.7 + i) * 30);
        
        push();
        translate(x, y);
        
        // Outer glow
        fill(255, 255, 255, 30);
        noStroke();
        ellipse(0, 0, 60);
        
        // Inner orb
        fill(150 + sin(time * 2 + i) * 50, 200 + cos(time + i) * 30, 255, 180);
        ellipse(0, 0, 25);
        
        pop();
    }
}

function drawDreamBackground() {
    switch(currentDream) {
        case 0: // Counting Sheep - Pastoral meadow
            background(135, 206, 235, 200); // Sky blue
            drawClouds();
            break;
            
        case 1: // Nightmare - Dark corridors
            background(20, 0, 20, 230);
            drawNightmareBackground();
            break;
            
        case 2: // Weightlessness - Space
            background(10, 10, 40, 200);
            drawStarField();
            break;
            
        case 3: // Thoughts - Mind palace
            background(255, 240, 200, 180);
            drawThoughtPatterns();
            break;
            
        case 4: // Memories - Vintage sepia
            background(139, 119, 101, 190);
            drawMemoryFragments();
            break;
    }
}

function drawDreamSpecificContent() {
    switch(currentDream) {
        case 0:
            drawSheepDream();
            break;
        case 1:
            drawNightmareDream();
            break;
        case 2:
            drawWeightlessDream();
            break;
        case 3:
            drawThoughtDream();
            break;
        case 4:
            drawMemoryDream();
            break;
    }
}

function drawSheepDream() {
    // Ground
    fill(34, 139, 34, 150);
    rect(0, height * 0.8, width, height * 0.2);
    
    // Fence
    stroke(139, 69, 19);
    strokeWeight(4);
    for (let x = 0; x < width; x += 100) {
        line(x, height * 0.7, x, height * 0.75);
    }
    line(0, height * 0.72, width, height * 0.72);
    
    // Update and draw sheep
    sheep.forEach(s => {
        s.update();
        s.display();
    });
    
    // Sheep counter
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`Sheep counted: ${Math.floor(time * 0.3)}`, width/2, 50);
}

function drawNightmareDream() {
    nightmareElements.forEach(element => {
        element.update();
        element.display();
    });
    
    // Distortion effect
    if (random() < 0.1) {
        push();
        tint(255, 200);
        translate(random(-5, 5), random(-5, 5));
        // Additional nightmare effects would go here
        pop();
    }
}

function drawWeightlessDream() {
    floatingParticles.forEach(particle => {
        particle.update();
        particle.display();
    });
    
    // Gravity wells
    for (let i = 0; i < 3; i++) {
        let x = width * (0.2 + i * 0.3);
        let y = height * 0.5 + sin(time + i * 2) * 100;
        
        push();
        translate(x, y);
        noFill();
        stroke(78, 205, 196, 100);
        strokeWeight(2);
        
        for (let r = 20; r < 100; r += 20) {
            ellipse(0, 0, r);
        }
        pop();
    }
}

function drawThoughtDream() {
    morphingShapes.forEach(shape => {
        shape.update();
        shape.display();
    });
    
    musicVisualizer[0].update();
    musicVisualizer[0].display();
    
    // Neural network connections
    drawNeuralNetwork();
}

function drawMemoryDream() {
    // Sepia overlay
    push();
    blendMode(MULTIPLY);
    fill(210, 180, 140, 100);
    rect(0, 0, width, height);
    pop();
    
    // Memory photos floating
    for (let i = 0; i < 5; i++) {
        let x = width * 0.2 + (i * width * 0.15) + sin(time + i) * 50;
        let y = height * 0.3 + cos(time * 0.7 + i) * 80;
        
        push();
        translate(x, y);
        rotate(sin(time + i) * 0.2);
        
        fill(255, 255, 255, 180);
        rect(-40, -30, 80, 60);
        
        fill(200, 180, 160, 200);
        rect(-35, -25, 70, 50);
        
        pop();
    }
}

function drawClouds() {
    fill(255, 255, 255, 150);
    noStroke();
    
    for (let i = 0; i < 6; i++) {
        let x = (time * 20 + i * 150) % (width + 100) - 50;
        let y = 100 + sin(time + i) * 30;
        
        // Cloud shape
        ellipse(x, y, 80, 40);
        ellipse(x + 20, y, 60, 35);
        ellipse(x - 20, y, 60, 35);
        ellipse(x, y - 15, 50, 25);
    }
}

function drawNightmareBackground() {
    // Creeping shadows
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        let size = random(50, 200);
        
        fill(0, 0, 0, random(20, 60));
        noStroke();
        ellipse(x, y, size);
    }
}

function drawStarField() {
    fill(255, 255, 255, 200);
    noStroke();
    
    for (let i = 0; i < 100; i++) {
        let x = (noise(i * 0.1) * width + time * 10) % width;
        let y = (noise(i * 0.1 + 100) * height + time * 5) % height;
        let size = noise(i * 0.05 + time * 0.1) * 3;
        
        ellipse(x, y, size);
    }
}

function drawThoughtPatterns() {
    stroke(255, 230, 109, 100);
    strokeWeight(1);
    noFill();
    
    for (let i = 0; i < 20; i++) {
        let x1 = noise(i * 0.1 + time * 0.1) * width;
        let y1 = noise(i * 0.1 + 50 + time * 0.1) * height;
        let x2 = noise(i * 0.1 + 25 + time * 0.1) * width;
        let y2 = noise(i * 0.1 + 75 + time * 0.1) * height;
        
        line(x1, y1, x2, y2);
    }
}

function drawMemoryFragments() {
    // Floating text fragments
    fill(139, 119, 101, 150);
    textAlign(CENTER, CENTER);
    
    let memories = ['childhood', 'laughter', 'summer', 'home', 'friends'];
    
    for (let i = 0; i < memories.length; i++) {
        let x = width * 0.2 + (i * width * 0.15) + sin(time + i) * 30;
        let y = height * 0.6 + cos(time * 0.5 + i) * 50;
        
        textSize(16 + sin(time + i) * 4);
        text(memories[i], x, y);
    }
}

function drawNeuralNetwork() {
    // Neural connections
    let nodes = [];
    for (let i = 0; i < 8; i++) {
        nodes.push({
            x: width * 0.2 + (i % 3) * width * 0.3,
            y: height * 0.3 + Math.floor(i / 3) * height * 0.2,
            active: noise(i + time) > 0.5
        });
    }
    
    // Draw connections
    stroke(255, 230, 109, 150);
    strokeWeight(2);
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[i].active && nodes[j].active && random() < 0.3) {
                line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            }
        }
    }
    
    // Draw nodes
    noStroke();
    for (let node of nodes) {
        fill(node.active ? color(255, 255, 0) : color(100, 100, 150));
        ellipse(node.x, node.y, 12);
    }
}

// ========= JOURNEY SYSTEM =========

function startDreamJourney() {
    dreamJourneyActive = true;
    journeyProgress = 0;
    journeyStage = 0;
    stageStartTime = millis();
    
    // Stage durations vary by dream type
    switch(currentDream) {
        case 0: stageDuration = 4000; break; // Gentle sheep dreams
        case 1: stageDuration = 3000; break; // Rapid nightmare escalation
        case 2: stageDuration = 7000; break; // Slow weightless drift
        case 3: stageDuration = 5000; break; // Thought development time
        case 4: stageDuration = 6000; break; // Memory recall time
    }
    
    updateProgressBar();
    playDreamSound(currentDream, 0.4);
    
    document.getElementById('dream-overlay').style.display = 'block';
    document.getElementById('progress-container').style.display = 'block';
}

function updateJourney() {
    let elapsed = millis() - stageStartTime;
    journeyProgress = elapsed / stageDuration;
    
    if (journeyProgress >= 1) {
        journeyStage++;
        stageStartTime = millis();
        journeyProgress = 0;
        
        if (journeyStage >= maxJourneyStages) {
            endDreamJourney();
            return;
        }
        
        playDreamSound(currentDream, 0.3);
    }
    
    updateProgressBar();
}

function drawJourneyStage() {
    // Each dream type has completely different journey visuals
    switch(currentDream) {
        case 0: drawSheepJourney(); break;
        case 1: drawNightmareJourney(); break;
        case 2: drawWeightlessJourney(); break;
        case 3: drawThoughtJourney(); break;
        case 4: drawMemoryJourney(); break;
    }
}

function drawSheepJourney() {
    background(135, 206, 235, 150);
    
    switch(journeyStage) {
        case 0: // Peaceful meadow
            fill(34, 139, 34);
            rect(0, height * 0.7, width, height * 0.3);
            drawClouds();
            break;
            
        case 1: // First sheep appears
            fill(34, 139, 34);
            rect(0, height * 0.7, width, height * 0.3);
            if (sheep.length > 0) sheep[0].display();
            break;
            
        case 2: // More sheep jumping
            fill(34, 139, 34);
            rect(0, height * 0.7, width, height * 0.3);
            sheep.forEach(s => s.display());
            break;
            
        case 3: // Sheep become clouds
            background(200, 230, 255);
            drawClouds();
            break;
            
        case 4: // Drift into sleep
            background(100, 150, 200, 200);
            fill(255, 255, 255, 100);
            rect(0, 0, width, height);
            break;
    }
}

function drawNightmareJourney() {
    let intensity = journeyStage / maxJourneyStages;
    background(20 * intensity, 0, 20 * intensity);
    
    switch(journeyStage) {
        case 0: // Unease begins
            background(50, 30, 50);
            break;
            
        case 1: // Shadows appear
            background(30, 10, 30);
            nightmareElements[0].display();
            break;
            
        case 2: // Multiple threats
            background(20, 0, 20);
            nightmareElements.forEach(e => e.display());
            break;
            
        case 3: // Overwhelming darkness
            background(10, 0, 10);
            fill(255, 0, 0, 100);
            rect(0, 0, width, height);
            break;
            
        case 4: // Breaking free
            background(40, 20, 40);
            fill(255, 255, 255, 50);
            ellipse(width/2, height/2, 200);
            break;
    }
}

function drawWeightlessJourney() {
    background(10, 10, 40);
    
    switch(journeyStage) {
        case 0: // Gravity weakens
            drawStarField();
            break;
            
        case 1: // Lifting off
            drawStarField();
            floatingParticles.slice(0, 10).forEach(p => p.display());
            break;
            
        case 2: // Free floating
            background(5, 5, 30);
            floatingParticles.forEach(p => p.display());
            break;
            
        case 3: // Among the stars
            background(0, 0, 20);
            drawStarField();
            // Add nebula effect
            fill(100, 50, 200, 30);
            ellipse(width/2, height/2, 400, 200);
            break;
            
        case 4: // Cosmic consciousness
            background(0, 0, 10);
            drawStarField();
            fill(255, 255, 255, 100);
            ellipse(width/2, height/2, 100);
            break;
    }
}

function drawThoughtJourney() {
    background(255, 240, 200);
    
    switch(journeyStage) {
        case 0: // Simple thoughts
            drawThoughtPatterns();
            break;
            
        case 1: // Ideas connecting
            drawNeuralNetwork();
            break;
            
        case 2: // Complex patterns
            morphingShapes.slice(0, 2).forEach(s => s.display());
            drawNeuralNetwork();
            break;
            
        case 3: // Synaptic symphony
            morphingShapes.forEach(s => s.display());
            musicVisualizer[0].display();
            break;
            
        case 4: // Enlightenment
            background(255, 255, 200);
            fill(255, 230, 109, 200);
            ellipse(width/2, height/2, 300);
            break;
    }
}

function drawMemoryJourney() {
    background(139, 119, 101);
    
    switch(journeyStage) {
        case 0: // Recent memories
            drawMemoryFragments();
            break;
            
        case 1: // Childhood emerges
            background(180, 160, 140);
            drawMemoryFragments();
            break;
            
        case 2: // Deep memories
            background(120, 100, 80);
            // Draw memory photos
            for (let i = 0; i < 3; i++) {
                let x = width * (0.2 + i * 0.3);
                let y = height * 0.5;
                fill(255, 240, 220);
                rect(x - 30, y - 20, 60, 40);
            }
            break;
            
        case 3: // Emotional core
            background(100, 80, 60);
            fill(255, 200, 150, 150);
            ellipse(width/2, height/2, 200);
            break;
            
        case 4: // Integration
            background(160, 140, 120);
            fill(255, 255, 255, 100);
            rect(0, 0, width, height);
            break;
    }
}

function endDreamJourney() {
    dreamJourneyActive = false;
    journeyStage = 0;
    journeyProgress = 0;
    
    document.getElementById('dream-overlay').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    
    // Return to start screen after a moment
    setTimeout(() => {
        returnToStart();
    }, 2000);
}

// ========= UTILITY FUNCTIONS =========

function updateProgressBar() {
    let totalProgress = (journeyStage + journeyProgress) / maxJourneyStages;
    document.getElementById('progress-fill').style.width = (totalProgress * 100) + '%';
    
    let stageText = getStageDescription(currentDream, journeyStage);
    document.getElementById('stage-info').textContent = stageText;
}

function getStageDescription(dreamType, stage) {
    const descriptions = {
        0: ['Peaceful meadow', 'First sheep', 'Counting continues', 'Becoming clouds', 'Drifting away'],
        1: ['Growing unease', 'Shadows emerge', 'Multiple threats', 'Overwhelming darkness', 'Breaking free'],
        2: ['Gravity weakens', 'Lifting off', 'Free floating', 'Among stars', 'Cosmic consciousness'],
        3: ['Simple thoughts', 'Ideas connecting', 'Complex patterns', 'Synaptic symphony', 'Enlightenment'],
        4: ['Recent memories', 'Childhood emerges', 'Deep memories', 'Emotional core', 'Integration']
    };
    
    return descriptions[dreamType][stage] || 'Dream stage';
}

function addDreamSentence() {
    let texts = dreamTexts[currentDream.toString()];
    if (texts && texts.length > 0) {
        let text = random(texts);
        dreamSentences.push(new DreamSentence(text, currentDream));
        playDreamSound(currentDream, 0.2);
    }
}

function updateDreamSentences() {
    for (let i = dreamSentences.length - 1; i >= 0; i--) {
        dreamSentences[i].update();
        if (dreamSentences[i].isDead()) {
            dreamSentences.splice(i, 1);
        }
    }
}

function drawDreamSentences() {
    dreamSentences.forEach(sentence => sentence.display());
}

function drawMouseTrail() {
    if (mouseTrail.length < 2) return;
    
    noFill();
    for (let i = 0; i < mouseTrail.length - 1; i++) {
        let alpha = map(i, 0, mouseTrail.length - 1, 0, 255);
        stroke(255, 255, 255, alpha);
        strokeWeight(map(i, 0, mouseTrail.length - 1, 1, 5));
        line(mouseTrail[i].x, mouseTrail[i].y, mouseTrail[i+1].x, mouseTrail[i+1].y);
    }
}

// ========= EVENT HANDLERS =========

function mousePressed() {
    ripples.push(new Ripple(mouseX, mouseY));
    playDreamSound(currentDream, 0.1);
    
    // Add text particles on click during thought dream
    if (currentDream === 3) {
        let words = ['think', 'wonder', 'imagine', 'dream', 'create'];
        textParticles.push(new TextParticle(random(words), mouseX, mouseY));
    }
}

function keyPressed() {
    if (key === ' ') {
        if (dreamJourneyActive) {
            endDreamJourney();
        } else if (!isOnStartScreen) {
            startDreamJourney();
        }
    }
    
    if (key === 'r' || key === 'R') {
        returnToStart();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ========= DREAM CONTROL FUNCTIONS =========

function selectDream(dreamIndex) {
    currentDream = dreamIndex;
    isOnStartScreen = false;
    
    // Reset dream-specific variables
    resetDreamVariables();
    
    // Update UI
    document.querySelectorAll('.thought-bubble').forEach(bubble => {
        bubble.classList.add('fade-out');
    });
    
    document.getElementById('dream-title').textContent = getDreamTitle(dreamIndex);
    document.getElementById('dream-description').textContent = getDreamDescription(dreamIndex);
    
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('canvas-container').style.display = 'block';
        document.getElementById('dream-info').style.display = 'block';
    }, 1000);
    
    playDreamSound(dreamIndex, 0.5);
}

function resetDreamVariables() {
    sheepCount = 0;
    nightmareIntensity = 0;
    weightlessGravity = 1;
    thoughtComplexity = 0;
    memoryClarity = 1;
    
    // Clear arrays
    dreamSpecificElements = [];
    cloudParticles = [];
    shadowTentacles = [];
    floatingWords = [];
    memoryPhotos = [];
    textParticles = [];
}

function getDreamTitle(dreamIndex) {
    const titles = [
        'Counting Sheep',
        'Nightmare Realm', 
        'Zero Gravity Dreams',
        'Mind Symphony',
        'Memory Journey'
    ];
    return titles[dreamIndex] || 'Unknown Dream';
}

function getDreamDescription(dreamIndex) {
    const descriptions = [
        'A peaceful meadow where sheep jump over fences in an endless, soothing rhythm.',
        'Dark corridors where shadows chase you through a maze of fear and uncertainty.',
        'Floating weightlessly through space, defying gravity in a cosmic dance.',
        'Thoughts become visible as they connect and form complex neural patterns.',
        'Wandering through cherished memories that shimmer like old photographs.'
    ];
    return descriptions[dreamIndex] || 'An unknown dream experience.';
}

function returnToStart() {
    currentDream = -1;
    isOnStartScreen = true;
    dreamJourneyActive = false;
    
    // Clear sentences
    dreamSentences = [];
    
    // Reset UI
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('dream-info').style.display = 'none';
    document.getElementById('dream-overlay').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    
    // Restore thought bubbles
    document.querySelectorAll('.thought-bubble').forEach(bubble => {
        bubble.classList.remove('fade-out');
    });
    
    playDreamSound(-1, 0.3);
}

// Update text particles for thought dream
function updateTextParticles() {
    for (let i = textParticles.length - 1; i >= 0; i--) {
        textParticles[i].update();
        if (textParticles[i].isDead()) {
            textParticles.splice(i, 1);
        }
    }
}

function drawTextParticles() {
    textParticles.forEach(particle => particle.display());
}