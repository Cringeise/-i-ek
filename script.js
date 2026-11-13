(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
  const starsLayer = byId("stars");
  const firefliesLayer = byId("fireflies");
  const heartLayer = byId("moon-hearts");
  const rainLayer = byId("rain");


  // Beş türden oluşan yoğun bir buket kur: her örnek aynı açılma animasyonunu paylaşır.
  const flowerBed = document.querySelector(".flower-bed");
  const templates = new Map();
  flowerBed.querySelectorAll(".flower").forEach((flower) => {
    const kindClass = [...flower.classList].find((name) => name.startsWith("flower--") && name !== "flower--bouquet-layer");
    if (kindClass) templates.set(kindClass.replace("flower--", ""), flower);
  });

  const bouquet = [
    // Arka sıra: daha uzun çiçekler buketin tepesini oluşturur.
    ["lavender", 18, 47, 164, -7, .15, 1], ["snowdrop", 26, 51, 170, -5, .55, 1],
    ["lily", 34, 59, 184, -3, .3, 1], ["daisy", 42, 62, 188, -1, .4, 1],
    ["tulip", 50, 58, 182, 2, .75, 1], ["lavender", 58, 51, 168, 5, .2, 1],
    ["snowdrop", 66, 45, 154, 7, .65, 1],
    // Orta sıra: renk ve türleri sıklaştırır.
    ["tulip", 14, 39, 150, -9, .9, 3], ["lily", 21, 43, 160, -7, 1.1, 3],
    ["daisy", 28, 46, 166, -5, .7, 3], ["snowdrop", 35, 44, 158, -3, 1.25, 3],
    ["lavender", 42, 48, 166, 1, 1.0, 3], ["daisy", 49, 47, 164, 3, .85, 3],
    ["lily", 56, 43, 160, 6, 1.35, 3], ["tulip", 63, 39, 150, 8, 1.15, 3],
    ["snowdrop", 70, 36, 146, 10, 1.4, 3],
    // Ön sıra: kısa çiçekler gövdelerin alt kısmını doldurur.
    ["lily", 22, 32, 145, -8, 1.6, 6], ["daisy", 29, 35, 152, -5, 1.45, 6],
    ["lavender", 36, 37, 154, -2, 1.7, 6], ["tulip", 43, 38, 156, 2, 1.55, 6],
    ["snowdrop", 50, 35, 150, 5, 1.8, 6], ["daisy", 57, 33, 146, 8, 1.65, 6]
  ];

  const firstUsed = new Set();
  const minDesktopX = 14;
  const maxDesktopX = 70;
  bouquet.forEach(([kind, desktopX, height, width, lean, delay, layer]) => {
    const template = templates.get(kind);
    if (!template) return;
    const flower = firstUsed.has(kind) ? template.cloneNode(true) : template;
    firstUsed.add(kind);
    flower.classList.add("flower--bouquet-layer");
    flower.style.setProperty("--left", `${isSmallScreen ? 4 + ((desktopX - minDesktopX) / (maxDesktopX - minDesktopX)) * 60 : desktopX}%`);
    flower.style.setProperty("--height", `${height}vh`);
    flower.style.setProperty("--width", `${width}px`);
    flower.style.setProperty("--lean", `${lean}deg`);
    flower.style.setProperty("--delay", `${delay}s`);
    flower.style.zIndex = String(layer);
    if (flower !== template) {
      flower.setAttribute("aria-hidden", "true");
      flower.querySelector("figcaption")?.remove();
      flower.querySelector("svg")?.removeAttribute("role");
    }
    flowerBed.appendChild(flower);
  });

  // Yüklenişte gökyüzüne küçük yıldızlar ve ateş böcekleri yerleştir.
  for (let i = 0; i < (isSmallScreen ? 34 : 68); i += 1) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 76}%`;
    star.style.setProperty("--duration", `${2 + Math.random() * 3.5}s`);
    star.style.setProperty("--delay", `${Math.random() * 4}s`);
    if (Math.random() > 0.74) {
      star.style.width = "3px";
      star.style.height = "3px";
    }
    starsLayer.appendChild(star);
  }

  // İnce, sakin bir gece yağmuru: damlalar farklı hız ve boylarda akar.
  for (let i = 0; i < (isSmallScreen ? 42 : 78); i += 1) {
    const drop = document.createElement("i");
    drop.className = "raindrop";
    drop.style.left = `${Math.random() * 110 - 5}%`;
    drop.style.setProperty("--drop-length", `${18 + Math.random() * 32}px`);
    drop.style.setProperty("--drop-duration", `${1.05 + Math.random() * 1.15}s`);
    drop.style.setProperty("--drop-delay", `${-Math.random() * 2.4}s`);
    drop.style.setProperty("--drop-opacity", `${0.16 + Math.random() * 0.28}`);
    rainLayer.appendChild(drop);
  }

  for (let i = 0; i < (isSmallScreen ? 9 : 24); i += 1) {
    const firefly = document.createElement("i");
    firefly.className = "firefly";
    firefly.style.left = `${8 + Math.random() * 84}%`;
    firefly.style.top = `${25 + Math.random() * 65}%`;
    firefly.style.setProperty("--fly-time", `${6 + Math.random() * 7}s`);
    firefly.style.setProperty("--fly-delay", `${Math.random() * 5}s`);
    firefliesLayer.appendChild(firefly);
  }

  window.addEventListener("load", () => {
    window.setTimeout(() => document.body.classList.remove("not-loaded"), 450);
  });
  document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(() => document.body.classList.remove("not-loaded"), 700);
  });

  // Ayın çevresinde aralıklarla beliren küçük kalpler.
  const heartEmojis = ["♥", "♡", "✦"];
  function createMoonHeart() {
    const heart = document.createElement("span");
    heart.className = "moon-heart";
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${Math.random() * 32}px`;
    heart.style.top = `${Math.random() * 22}px`;
    heart.style.setProperty("--tx", `${Math.random() * 70 - 42}px`);
    heart.style.setProperty("--ty", `${Math.random() * 56 + 10}px`);
    heartLayer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1900);
  }
  if (!isSmallScreen) window.setInterval(createMoonHeart, 1550);

  // Sevgi barı: Başlat / durdur, üç hak ve cihazda saklanan kişisel rekor.
  const fill = byId("love-bar-fill");
  const recordMarker = byId("record-marker");
  const attemptsLabel = byId("attempts-count");
  const message = byId("message-display");
  const playButton = byId("play-button");

  let value = 0;
  let direction = 1;
  let playing = false;
  let finished = false;
  let attempts = 3;
  let frameId = 0;
  let previousTime = 0;
  let best = Number.parseInt(localStorage.getItem("geceBahcesiBest") || "0", 10);
  if (!Number.isFinite(best) || best < 0 || best > 100) best = 0;
  recordMarker.style.bottom = `${best}%`;

  function renderBar() {
    fill.style.transform = `scaleY(${value / 100})`;
  }

  function gameLoop(time) {
    if (!playing) return;
    if (!previousTime) previousTime = time;
    const scale = Math.min((time - previousTime) / 16.67, 2.5);
    previousTime = time;

    // Üst seviyelere çıkıldıkça bar belirgin biçimde hızlanır.
    const speed = value > 70 ? 14 + Math.random() * 5 : 0.55 + (value / 70) * 2.1;
    value += speed * scale * direction;
    if (value >= 100) { value = 100; direction = -1; }
    if (value <= 0) { value = 0; direction = 1; }
    renderBar();
    frameId = requestAnimationFrame(gameLoop);
  }

  function celebrate() {
    const amount = isSmallScreen ? 18 : 42;
    for (let i = 0; i < amount; i += 1) {
      const bit = document.createElement("span");
      bit.textContent = Math.random() > .5 ? "✦" : "♥";
      bit.style.position = "fixed";
      bit.style.left = "50%";
      bit.style.top = "45%";
      bit.style.zIndex = "60";
      bit.style.pointerEvents = "none";
      bit.style.color = Math.random() > .5 ? "#f4c7e2" : "#e9d7a1";
      bit.style.fontSize = `${10 + Math.random() * 14}px`;
      document.body.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 180;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const animation = bit.animate([
        { transform: "translate(-50%, -50%) scale(.6)", opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.3)`, opacity: 0 }
      ], { duration: 950 + Math.random() * 650, easing: "cubic-bezier(.1,.8,.2,1)" });
      animation.onfinish = () => bit.remove();
    }
  }

  function toggleGame() {
    if (finished) return;
    if (!playing) {
      playing = true;
      previousTime = 0;
      playButton.textContent = "Durdur";
      message.textContent = "Tam zamanında durdur!";
      frameId = requestAnimationFrame(gameLoop);
      return;
    }

    playing = false;
    cancelAnimationFrame(frameId);
    attempts -= 1;
    attemptsLabel.textContent = String(attempts);
    const score = Math.floor(value);

    if (score > best) {
      best = score;
      localStorage.setItem("geceBahcesiBest", String(best));
      recordMarker.style.bottom = `${best}%`;
      message.textContent = `Yeni rekor! ${score}% ✨`;
      celebrate();
    } else {
      message.textContent = `Skorun: ${score}%. Biraz daha yaklaşabilirsin.`;
    }

    if (attempts <= 0) {
      finished = true;
      playButton.textContent = "Hakların bitti";
      playButton.disabled = true;
      message.textContent = `Oyun bitti! En iyi skorun: ${best}%.`;
    } else {
      playButton.textContent = "Tekrar dene";
    }
  }

  playButton.addEventListener("click", toggleGame);
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.repeat && !/^(BUTTON|INPUT|TEXTAREA)$/.test(event.target.tagName)) {
      event.preventDefault();
      toggleGame();
    }
  });
})();
