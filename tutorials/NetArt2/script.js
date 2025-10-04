let mouseMovements = 0;
let clicks = 0;
let startTime = Date.now();
let mouseTrail = [];
let maxTrailLength = 20;

const traits = [
    { threshold: 50, text: "Curious Explorer", shown: false },
    { threshold: 100, text: "Active User", shown: false },
    { threshold: 20, text: "Frequent Clicker", shown: false },
    { threshold: 30, text: "Cautious Visitor", shown: false },
    { threshold: 200, text: "Engaged Subject", shown: false },
    { threshold: 15, text: "Impulsive Behavior Detected", shown: false }
];

const observations = [
    "Subject shows signs of awareness...",
    "Behavior pattern logged and archived.",
    "Mouse hesitation detected. Uncertainty noted.",
    "Click frequency suggests growing anxiety.",
    "Subject attempting to understand scope of surveillance.",
    "Attention span calculated. Profile updated.",
    "Interaction pattern matches 78% of monitored users.",
    "Your browsing signature has been recorded."
];

const creepyMessages = [
    "We see you...",
    "Your behavior is being recorded",
    "Data collection in progress",
    "Profile analysis: 67% complete",
    "You can't escape the algorithm",
    "Every click tells us more about you"
];


document.getElementById('screenRes').textContent = `${screen.width}x${screen.height}`;
document.getElementById('browserInfo').textContent = navigator.userAgent.split(' ').slice(-1)[0];
document.getElementById('platformInfo').textContent = navigator.platform;

// Mouse movement tracking
document.addEventListener('mousemove', (e) => {
    mouseMovements++;
    
    if (mouseMovements % 10 === 0) {
        document.getElementById('mouseCount').textContent = mouseMovements;
    }

    
    if (mouseMovements % 5 === 0) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
    }

    
    if (mouseMovements % 50 === 0) {
        logData(`MOVEMENT: X:${e.pageX} Y:${e.pageY}`);
    }

    
    checkAndAddTraits();
});

// Click tracking
document.addEventListener('click', (e) => {
    clicks++;
    document.getElementById('clickCount').textContent = clicks;

    
    const marker = document.createElement('div');
    marker.className = 'click-marker';
    marker.style.left = (e.pageX - 15) + 'px';
    marker.style.top = (e.pageY - 15) + 'px';
    document.body.appendChild(marker);
    
    setTimeout(() => marker.remove(), 1000);

    logData(`CLICK: Position (${e.pageX}, ${e.pageY})`);    
    if (clicks % 5 === 0) {
        addObservation();
    }
    if (clicks % 10 === 0) {
        showCreepyMessage();
    }

    checkAndAddTraits();
});

// Time tracking
setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeCount').textContent = elapsed + 's';

    const score = Math.min(100, Math.floor(
        (mouseMovements * 0.1) + (clicks * 2) + (elapsed * 0.5)
    ));
    document.getElementById('behaviorScore').textContent = score;

    if (elapsed % 30 === 0 && elapsed > 0) {
        addObservation();
    }
}, 1000);

function logData(message) {
    const stream = document.getElementById('streamContent');
    const entry = document.createElement('div');
    entry.className = 'data-entry';
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
    stream.insertBefore(entry, stream.firstChild);

    if (stream.children.length > 50) {
        stream.removeChild(stream.lastChild);
    }
}

function checkAndAddTraits() {
    const traitsContainer = document.getElementById('profileTraits');
    
    if (mouseMovements > 50 && !traits[0].shown) {
        addTrait(traits[0].text);
        traits[0].shown = true;
    }
    if (mouseMovements > 100 && !traits[1].shown) {
        addTrait(traits[1].text);
        traits[1].shown = true;
    }
    if (clicks > 20 && !traits[2].shown) {
        addTrait(traits[2].text);
        traits[2].shown = true;
    }
    if (clicks > 30 && !traits[4].shown) {
        addTrait(traits[4].text);
        traits[4].shown = true;
    }
    if (clicks > 15 && mouseMovements > 200 && !traits[5].shown) {
        addTrait(traits[5].text);
        traits[5].shown = true;
    }
}

function addTrait(text) {
    const traitsContainer = document.getElementById('profileTraits');
    const trait = document.createElement('div');
    trait.className = 'trait';
    trait.textContent = text;
    traitsContainer.appendChild(trait);
    logData(`TRAIT ADDED: ${text}`);
}

function addObservation() {
    const obsContainer = document.getElementById('observations');
    const obs = document.createElement('div');
    obs.className = 'observation';
    const randomObs = observations[Math.floor(Math.random() * observations.length)];
    obs.textContent = `◉ ${randomObs}`;
    obsContainer.appendChild(obs);
    logData(`OBSERVATION: ${randomObs}`);
}

function showCreepyMessage() {
    const msg = document.createElement('div');
    msg.className = 'creepy-message';
    msg.textContent = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
    document.body.appendChild(msg);
    
    setTimeout(() => msg.remove(), 2000);
}

logData('SURVEILLANCE INITIATED');
logData(`USER AGENT: ${navigator.userAgent}`);
logData(`SCREEN: ${screen.width}x${screen.height}`);