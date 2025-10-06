let mouseMovements = 0;
let clicks = 0;
let startTime = Date.now();

function $(id){ return document.getElementById(id); }

function logData(message) {
  const stream = $("streamContent");
  if (!stream) return;
  const entry = document.createElement("div");
  entry.className = "data-entry";
  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
  stream.insertBefore(entry, stream.firstChild);
  if (stream.children.length > 80) stream.removeChild(stream.lastChild);
}

$("screenRes").textContent = `${screen.width}x${screen.height}`;
$("browserInfo").textContent = navigator.userAgent || "unknown";
$("platformInfo").textContent = navigator.platform || "unknown";

function updateOnlineStatus(){
  const status = navigator.onLine ? "Online" : "Offline";
  $("connStatus").textContent = status;
  logData(`CONNECTIVITY: ${status}`);
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

async function fetchIP() {
  try {
    const r1 = await fetch("https://api.ipify.org?format=json", {cache:"no-store"});
    const j1 = await r1.json();
    if (j1 && j1.ip) {
      logData(`NETWORK: Public IP ${j1.ip}`);
    }
  } catch (_) {
    logData("NETWORK: ipify failed");
  }

  try {
    const t0 = performance.now();
    const r2 = await fetch("https://httpbin.org/get", {cache:"no-store"});
    const t1 = performance.now();
    const data = await r2.json();
    const latency = Math.round(t1 - t0);
    const ip = data.origin || "unknown";
    const lang = (data.headers && (data.headers["Accept-Language"] || data.headers["accept-language"])) || navigator.language;
    const referer = (data.headers && (data.headers["Referer"] || data.headers["referer"])) || document.referrer || "none";
    logData(`NETWORK: Approx. Latency ${latency}ms`);
    logData(`NETWORK: Accept-Language ${lang}`);
    logData(`NETWORK: Referer ${referer}`);

    const netInfo = $("netInfo");
    if (netInfo) {
      netInfo.textContent = `IP: ${ip} · Latency: ${latency}ms · Lang: ${lang} · Referrer: ${referer || "—"}`;
    }
  } catch (e) {
    logData("NETWORK: httpbin failed (firewall/offline?)");
    const netInfo = $("netInfo");
    if (netInfo) netInfo.textContent = "Network fingerprint unavailable.";
  }
}
function renderConnection(){
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return;
  logData(`CONNECTION: downlink≈${c.downlink}Mb/s, rtt≈${c.rtt}ms, type=${c.effectiveType}`);
}
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn) {
  conn.addEventListener("change", renderConnection);
  renderConnection();
}

fetchIP();
setInterval(fetchIP, 60000);

document.addEventListener("mousemove", (e) => {
  mouseMovements++;
  if (mouseMovements % 10 === 0) $("mouseCount").textContent = mouseMovements;

  if (mouseMovements % 5 === 0) {
    const trail = document.createElement("div");
    trail.className = "mouse-trail";
    trail.style.left = e.pageX + "px";
    trail.style.top = e.pageY + "px";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 500);
  }

  if (mouseMovements % 50 === 0) {
    logData(`MOVEMENT: X:${e.pageX} Y:${e.pageY}`);
  }
  checkAndAddTraits();
});

document.addEventListener("click", (e) => {
  clicks++;
  $("clickCount").textContent = clicks;

  const marker = document.createElement("div");
  marker.className = "click-marker";
  marker.style.left = (e.pageX - 15) + "px";
  marker.style.top = (e.pageY - 15) + "px";
  document.body.appendChild(marker);
  setTimeout(() => marker.remove(), 1000);

  logData(`CLICK: Position (${e.pageX}, ${e.pageY})`);

  if (clicks % 5 === 0) addObservation();
  if (clicks % 10 === 0) showCreepyMessage();

  checkAndAddTraits();
});

setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  $("timeCount").textContent = elapsed + "s";
  const score = Math.min(100, Math.floor(
    (mouseMovements * 0.1) + (clicks * 2) + (elapsed * 0.5)
  ));
  $("behaviorScore").textContent = score;

  if (elapsed % 30 === 0 && elapsed > 0) addObservation();
}, 1000);

const traits = [
  { id:'curious',   cond: () => mouseMovements > 50,   text: "Curious Explorer", shown:false },
  { id:'active',    cond: () => mouseMovements > 100,  text: "Active User", shown:false },
  { id:'clicky',    cond: () => clicks > 20,           text: "Frequent Clicker", shown:false },
  { id:'engaged',   cond: () => clicks > 30,           text: "Engaged Subject", shown:false },
  { id:'impulsive', cond: () => clicks > 15 && mouseMovements > 200, text: "Impulsive Behavior Detected", shown:false }
];
function checkAndAddTraits() {
  traits.forEach(t => {
    if (!t.shown && t.cond()) { addTrait(t.text); t.shown = true; }
  });
}

function addTrait(text) {
  const traitsContainer = $("profileTraits");
  const trait = document.createElement("div");
  trait.className = "trait";
  trait.textContent = text;
  traitsContainer.appendChild(trait);
  logData(`TRAIT ADDED: ${text}`);
}

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
function addObservation() {
  const obsContainer = $("observations");
  const obs = document.createElement("div");
  obs.className = "observation";
  const randomObs = observations[Math.floor(Math.random() * observations.length)];
  obs.textContent = `◉ ${randomObs}`;
  obsContainer.appendChild(obs);
  logData(`OBSERVATION: ${randomObs}`);
}

const creepyMessages = [
  "We see you...",
  "Your behavior is being recorded",
  "Data collection in progress",
  "Profile analysis: 67% complete",
  "You can't escape the algorithm",
  "Every click tells us more about you"
];
function showCreepyMessage() {
  const msg = document.createElement("div");
  msg.className = "creepy-message";
  msg.textContent = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}

// Boot logs
logData("SURVEILLANCE INITIATED");
logData(`USER AGENT: ${navigator.userAgent || "unknown"}`);
logData(`SCREEN: ${screen.width}x${screen.height}`);
