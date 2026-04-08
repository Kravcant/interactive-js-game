const FINAL_LEVEL = 25;
const BOSS_TIME_LIMIT = 20;

let gold = 0;
let damagePerClick = 1;
let enemiesKilled = 0;
let currentLevel = 1;
let maxLevel = 1;

let enemyMaxHP = 0;
let enemyHP = 0;
let isBossFight = false;
let bossTimeRemaining = 0;
let bossInterval = null;
let playerWon = false;
let victoryBannerShown = false;


let encounterStep = "normal";

const mapData = [
  { name: "Whispering Forest", image: "Assets/Maps/Map1.png", minLevel: 1, maxLevel: 10 },
  { name: "Shattered Pass", image: "Assets/Maps/Map2.png", minLevel: 11, maxLevel: 20 },
  { name: "Infernal Wastes", image: "Assets/Maps/Map3.png", minLevel: 21, maxLevel: 999 }
];

const characterStages = [
  { minTotalPurchases: 0, image: "Assets/Character/Char1.png" },
  { minTotalPurchases: 2, image: "Assets/Character/Char2.png" },
  { minTotalPurchases: 4, image: "Assets/Character/Char3.png" },
  { minTotalPurchases: 6, image: "Assets/Character/Char4.png" },
  { minTotalPurchases: 8, image: "Assets/Character/Char6.png" },
  { minTotalPurchases: 10, image: "Assets/Character/Char7.png" },
  { minTotalPurchases: 12, image: "Assets/Character/Char8.png" },
  { minTotalPurchases: 14, image: "Assets/Character/Char9.png" },
  { minTotalPurchases: 16, image: "Assets/Character/Char10.png" }
];

const monsterGroups = [
  {
    name: "Venom Snake",
    normalImage: "Assets/Monsters/Monster01-1.png",
    bossImage: "Assets/Monsters/Monster01-2.png"
  },
  {
    name: "Fallen Knight",
    normalImage: "Assets/Monsters/Monster02-1.png",
    bossImage: "Assets/Monsters/Monster02-2.png"
  },
  {
    name: "Plague Raven",
    normalImage: "Assets/Monsters/Monster03-1.png",
    bossImage: "Assets/Monsters/Monster03-2.png"
  },
  {
    name: "Sporeling",
    normalImage: "Assets/Monsters/Monster04-1.png",
    bossImage: "Assets/Monsters/Monster04-2.png"
  },
  {
    name: "Gloom Beast",
    normalImage: "Assets/Monsters/Monster05-1.png",
    bossImage: "Assets/Monsters/Monster05-2.png"
  }
];

const finalBoss = {
  name: "Totem of the Deep",
  image: "Assets/Monsters/Monster06-1.png"
};

const upgrades = [
  { id: 1, name: "Iron Sword", cost: 10, bonus: 1, purchases: 0 },
  { id: 2, name: "Peasant Farm", cost: 75, bonus: 5, purchases: 0 },
  { id: 3, name: "Sword Master", cost: 300, bonus: 20, purchases: 0 },
  { id: 4, name: "Knight Mastery", cost: 600, bonus: 35, purchases: 0 },
  { id: 5, name: "Ballista", cost: 1200, bonus: 50, purchases: 0 },
  { id: 6, name: "Elixir Potion", cost: 2500, bonus: 75, purchases: 0 },
  { id: 7, name: "Dragon Slayer Training", cost: 5000, bonus: 120, purchases: 0 },
  { id: 8, name: "Rune Enhancement", cost: 8000, bonus: 160, purchases: 0 },
  { id: 9, name: "Ancient Artifact", cost: 12000, bonus: 220, purchases: 0 },
  { id: 10, name: "Blessing of the Gods", cost: 20000, bonus: 300, purchases: 0 }
];

const goldDisplay = document.getElementById("gold-display");
const damageDisplay = document.getElementById("damage-display");
const levelDisplay = document.getElementById("level-display");
const killsDisplay = document.getElementById("kills-display");
const mapNameDisplay = document.getElementById("map-name-display");
const enemyNameDisplay = document.getElementById("enemy-name-display");
const stageDisplay = document.getElementById("stage-display");
const nextBossDisplay = document.getElementById("next-boss-display");
const battlefield = document.getElementById("battlefield");
const heroImage = document.getElementById("hero-image");
const monsterImage = document.getElementById("monster-image");
const battleTitle = document.getElementById("battle-title");
const healthDisplay = document.getElementById("health-display");
const healthFill = document.getElementById("health-fill");
const timerDisplay = document.getElementById("timer-display");
const bossBadge = document.getElementById("boss-badge");
const upgradesContainer = document.getElementById("upgrades");
const floatingTextLayer = document.getElementById("floating-text-layer");
const winScreen = document.getElementById("win-screen");
const winText = document.getElementById("win-text");

document.getElementById("attack-btn").addEventListener("click", attackEnemy);
monsterImage.addEventListener("click", attackEnemy);
document.getElementById("prevLvl").addEventListener("click", goToPreviousLevel);
document.getElementById("nextLvl").addEventListener("click", goToNextLevel);
document.getElementById("restart-btn").addEventListener("click", restartGame);
document.getElementById("dismiss-btn").addEventListener("click", () => winScreen.classList.add("hidden"));

function attackEnemy() {
  enemyHP -= damagePerClick;
  monsterImage.classList.remove("hit");
  void monsterImage.offsetWidth;
  monsterImage.classList.add("hit");

  showFloatingText(`-${damagePerClick} dmg`);

  if (enemyHP <= 0) {
    handleEnemyDefeat();
  }

  updateDisplay();
}

function handleEnemyDefeat() {
  const reward = calculateReward();
  gold += reward;
  enemiesKilled++;
  showFloatingText(`+${reward} gold`);

  if (currentLevel === FINAL_LEVEL && encounterStep === "finalBoss") {
    stopBossTimer();
    if (!victoryBannerShown) {
      victoryBannerShown = true;
      showVictoryBanner();
    }
    currentLevel++;
    if (currentLevel > maxLevel) maxLevel = currentLevel;
    encounterStep = "normal";
    calculateEncounter();
    return;
  }

  if (!isBossFight) {
    currentLevel++;
    if (currentLevel > maxLevel) maxLevel = currentLevel;
    encounterStep = "normal";
  } else {
    if (encounterStep === "normal") {
      encounterStep = "boss";
    } else if (encounterStep === "boss") {
      currentLevel++;
      if (currentLevel > maxLevel) maxLevel = currentLevel;
      encounterStep = "normal";
    }
  }

  calculateEncounter();
}

function calculateEncounter() {
  stopBossTimer();

  if (currentLevel === FINAL_LEVEL) {
    isBossFight = true;
    encounterStep = "finalBoss";
    enemyMaxHP = Math.round(1200 + currentLevel * 140);
    enemyHP = enemyMaxHP;
    startBossTimer();
    updateDisplay();
    return;
  }

  isBossFight = currentLevel % 5 === 0;

  if (isBossFight) {
    if (encounterStep !== "boss") {
      encounterStep = "normal";
    }

    if (encounterStep === "normal") {
      enemyMaxHP = Math.round(60 + currentLevel * 26 + Math.pow(currentLevel, 1.75));
    } else {
      enemyMaxHP = Math.round(180 + currentLevel * 42 + Math.pow(currentLevel, 2));
    }

    enemyHP = enemyMaxHP;
    startBossTimer();
  } else {
    encounterStep = "normal";
    enemyMaxHP = Math.round(16 + currentLevel * 10 + Math.pow(currentLevel, 1.35));
    enemyHP = enemyMaxHP;
  }

  updateDisplay();
}

function calculateReward() {
  if (currentLevel === FINAL_LEVEL && encounterStep === "finalBoss") {
    return 2000;
  }

  if (!isBossFight) {
    return Math.round(6 + currentLevel);
  }

  if (encounterStep === "normal") {
    return Math.round(10 + currentLevel * 2);
  }

  return Math.round(30 + currentLevel * 4);
}

function startBossTimer() {
  stopBossTimer();
  bossTimeRemaining = BOSS_TIME_LIMIT;
  timerDisplay.classList.remove("hidden");
  timerDisplay.textContent = `${bossTimeRemaining}s`;

  bossInterval = setInterval(() => {
    bossTimeRemaining--;
    timerDisplay.textContent = `${bossTimeRemaining}s`;

    if (bossTimeRemaining <= 0) {
      enemyHP = enemyMaxHP;
      bossTimeRemaining = BOSS_TIME_LIMIT;
      timerDisplay.textContent = `${bossTimeRemaining}s`;
      showFloatingText("Boss recovered!");
      updateDisplay();
    }
  }, 1000);
}

function stopBossTimer() {
  if (bossInterval !== null) {
    clearInterval(bossInterval);
    bossInterval = null;
  }
  timerDisplay.classList.add("hidden");
}

function renderUpgrades() {
  upgradesContainer.innerHTML = "";

  upgrades.forEach((upgrade) => {
    const card = document.createElement("div");
    card.className = "upgrade-card";

    const title = document.createElement("h3");
    title.textContent = upgrade.name;

    const cost = document.createElement("p");
    cost.textContent = `Cost: ${upgrade.cost} gold`;

    const bonus = document.createElement("p");
    bonus.textContent = `Power: +${upgrade.bonus} damage`;

    const count = document.createElement("p");
    count.className = "purchase-count";
    count.textContent = `Bought: ${upgrade.purchases}`;

    const button = document.createElement("button");
    button.textContent = gold >= upgrade.cost ? "Buy Upgrade" : "Need More Gold";
    button.disabled = gold < upgrade.cost;
    button.addEventListener("click", () => buyUpgrade(upgrade.id));

    card.appendChild(title);
    card.appendChild(cost);
    card.appendChild(bonus);
    card.appendChild(count);
    card.appendChild(button);

    upgradesContainer.appendChild(card);
  });
}

function buyUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade || gold < upgrade.cost) {
    return;
  }

  gold -= upgrade.cost;
  damagePerClick += upgrade.bonus;
  upgrade.purchases++;
  upgrade.cost = Math.round(upgrade.cost * 1.75);

  showFloatingText(`${upgrade.name} +${upgrade.bonus}`);
  updateDisplay();
}

function getCurrentMap() {
  return mapData.find((map) => currentLevel >= map.minLevel && currentLevel <= map.maxLevel) || mapData[0];
}

function getCurrentMonsterData() {
  if (currentLevel === FINAL_LEVEL) {
    return {
      name: finalBoss.name,
      image: finalBoss.image,
      boss: true
    };
  }

  const groupIndex = Math.floor((currentLevel - 1) / 5) % monsterGroups.length;
  const group = monsterGroups[groupIndex];

  if (!isBossFight) {
    return {
      name: group.name,
      image: group.normalImage,
      boss: false
    };
  }

  if (encounterStep === "normal") {
    return {
      name: `${group.name} Vanguard`,
      image: group.normalImage,
      boss: false
    };
  }

  return {
    name: `${group.name} Boss`,
    image: group.bossImage,
    boss: true
  };
}

function updateCharacterDisplay() {
  const totalPurchases = upgrades.reduce((sum, upgrade) => sum + upgrade.purchases, 0);

  let currentCharacter = characterStages[0];
  for (const stage of characterStages) {
    if (totalPurchases >= stage.minTotalPurchases) {
      currentCharacter = stage;
    }
  }

  heroImage.src = currentCharacter.image;
}

function updateDisplay() {
  goldDisplay.textContent = gold;
  damageDisplay.textContent = damagePerClick;
  levelDisplay.textContent = currentLevel;
  killsDisplay.textContent = enemiesKilled;

  const currentMap = getCurrentMap();
  battlefield.style.backgroundImage = `url("${currentMap.image}")`;
  mapNameDisplay.textContent = currentMap.name;

  const monster = getCurrentMonsterData();
  enemyNameDisplay.textContent = monster.name;
  battleTitle.textContent = monster.name;
  monsterImage.src = monster.image;
  monsterImage.alt = monster.name;

  if (monster.boss) {
    bossBadge.classList.remove("hidden");
    monsterImage.classList.add("boss");
  } else {
    bossBadge.classList.add("hidden");
    monsterImage.classList.remove("boss");
  }

  const hpPercent = Math.max(0, (enemyHP / enemyMaxHP) * 100);
  healthFill.style.width = `${hpPercent}%`;
  healthDisplay.textContent = `HP: ${Math.max(0, enemyHP)} / ${enemyMaxHP}`;

  if (currentLevel === FINAL_LEVEL) {
    stageDisplay.textContent = "Final Boss";
    nextBossDisplay.textContent = "Final battle";
  } else if (currentLevel > FINAL_LEVEL && isBossFight && encounterStep === "normal") {
    stageDisplay.textContent = "Boss Level - Guard";
    nextBossDisplay.textContent = "Boss next";
  } else if (currentLevel > FINAL_LEVEL && isBossFight && encounterStep === "boss") {
    stageDisplay.textContent = "Boss Fight";
    nextBossDisplay.textContent = "Clear to advance";
  } else if (isBossFight && encounterStep === "normal") {
    stageDisplay.textContent = "Boss Level - Guard";
    nextBossDisplay.textContent = "Boss next";
  } else if (isBossFight && encounterStep === "boss") {
    stageDisplay.textContent = "Boss Fight";
    nextBossDisplay.textContent = "Clear to advance";
  } else {
    stageDisplay.textContent = currentLevel > FINAL_LEVEL ? "Endless Mode" : "Normal";
    const remaining = 5 - (currentLevel % 5);
    nextBossDisplay.textContent = remaining === 5 ? "Next level" : `${remaining} levels`;
  }

  document.getElementById("prevLvl").disabled = currentLevel <= 1;
  document.getElementById("nextLvl").disabled = currentLevel >= maxLevel;

  updateCharacterDisplay();
  renderUpgrades();
}

function goToPreviousLevel() {
  if (currentLevel <= 1) return;

  currentLevel--;
  encounterStep = "normal";
  calculateEncounter();
}

function goToNextLevel() {
  if (currentLevel >= maxLevel) return;

  currentLevel++;
  encounterStep = "normal";
  calculateEncounter();
}

function showFloatingText(text) {
  const floatEl = document.createElement("div");
  floatEl.className = "floating-text";
  floatEl.textContent = text;

  const randomX = Math.floor(Math.random() * 120) - 60;
  floatEl.style.marginLeft = `${randomX}px`;

  floatingTextLayer.appendChild(floatEl);

  setTimeout(() => {
    floatEl.remove();
  }, 900);
}

function showVictoryBanner() {
  winText.textContent = `You defeated the Totem of the Deep! The realms tremble — but the monsters keep coming. How far can you go?`;
  winScreen.classList.remove("hidden");
  setTimeout(() => {
    winScreen.classList.add("hidden");
  }, 5000);
}

function restartGame() {
  gold = 0;
  damagePerClick = 1;
  enemiesKilled = 0;
  currentLevel = 1;
  maxLevel = 1;
  enemyMaxHP = 0;
  enemyHP = 0;
  isBossFight = false;
  bossTimeRemaining = 0;
  playerWon = false;
  victoryBannerShown = false;
  encounterStep = "normal";

  upgrades.forEach((upgrade, index) => {
    const baseCosts = [10, 75, 300, 600, 1200, 2500, 5000, 8000, 12000, 20000];
    upgrade.cost = baseCosts[index];
    upgrade.purchases = 0;
  });

  winScreen.classList.add("hidden");
  calculateEncounter();
}

calculateEncounter();