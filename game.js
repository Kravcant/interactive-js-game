let score = 0;
let damagePerClick = 1;
let enemiesKilled = 0;
let maxLevel = 1;
let currentLevel = 1;
let killsForNextLevel = 0;
let enemyHP = 5;
let isBossFight = false;

// Boss timer state
const BOSS_TIME_LIMIT = 20;
let bossTimeRemaining = 0;
let bossInterval = null;
let bossMaxHP = 0;

// Upgrades array — data-driven pattern
const upgrades = [
  { id: 1, name: "Iron Sword", cost: 10, bonus: 1, levelUnlock: 2 },
  { id: 2, name: "Peasant Farm", cost: 75, bonus: 5, levelUnlock: 11 },
  { id: 3, name: "Sword Master", cost: 300, bonus: 20, levelUnlock: 21 },
  { id: 4, name: "Knight Mastery", cost: 600, bonus: 35, levelUnlock: 31 },
  { id: 5, name: "Ballista", cost: 1200, bonus: 50, levelUnlock: 41 },
  { id: 6, name: "Elixir Potion", cost: 2500, bonus: 75, levelUnlock: 51 },
  { id: 7, name: "Dragon Slayer Training", cost: 5000, bonus: 120, levelUnlock: 61 },
  { id: 8, name: "Rune Enhancement", cost: 8000, bonus: 160, levelUnlock: 71 },
  { id: 9, name: "Ancient Artifact", cost: 12000, bonus: 220, levelUnlock: 81 },
  { id: 10, name: "Blessing of the Gods", cost: 20000, bonus: 300, levelUnlock: 91 }
];

// Start the boss countdown timer
function startBossTimer() {
  stopBossTimer();
  bossTimeRemaining = BOSS_TIME_LIMIT;
  updateTimerDisplay();
  bossInterval = setInterval(function() {
    bossTimeRemaining--;
    updateTimerDisplay();
    if (bossTimeRemaining <= 0) {
      enemyHP = bossMaxHP;
      updateDisplay();
      startBossTimer();
    }
  }, 1000);
}

// Stop and clear the boss countdown timer, and hide the display
function stopBossTimer() {
  if (bossInterval !== null) {
    clearInterval(bossInterval);
    bossInterval = null;
  }
  document.getElementById("timer-display").style.display = "none";
}

// Update just the timer element
function updateTimerDisplay() {
  const timerEl = document.getElementById("timer-display");
  if (isBossFight) {
    timerEl.textContent = `Time Remaining: ${bossTimeRemaining}s`;
    timerEl.style.display = "block";
  } else {
    timerEl.style.display = "none";
  }
}

// Update the full display
function updateDisplay() {
  document.getElementById("score-display").textContent = `Score: ${score}`;
  document.getElementById("rate-display").textContent = `Damage per Click: ${damagePerClick}`;
  document.getElementById("kills-display").textContent = `Enemies Killed: ${enemiesKilled}`;
  document.getElementById("health-display").textContent = `HP: ${enemyHP}`;
  document.getElementById("level-display").textContent = `Level: ${currentLevel}`;
  document.getElementById("next-display").textContent = `Kills for Next Level: ${killsForNextLevel}`;
  document.getElementById("prevLvl").disabled = currentLevel == 1;
  document.getElementById("nextLvl").disabled = currentLevel == maxLevel;
  updateTimerDisplay();
  renderUpgrades();
}

// Render upgrade buttons dynamically
function renderUpgrades() {
  const upgradesContainer = document.getElementById("upgrades");
  upgradesContainer.innerHTML = "";

  upgrades.forEach(upgrade => {
    if (maxLevel >= upgrade.levelUnlock) {
      const button = document.createElement("button");
      const canAfford = score >= upgrade.cost;
      button.disabled = !canAfford;
      button.textContent = `${upgrade.name} (Cost: ${upgrade.cost}, +${upgrade.bonus} Damage)`;
      button.addEventListener("click", function() {
        purchaseUpgrade(upgrade);
      });
      upgradesContainer.appendChild(button);
    }
  });
}

// Purchase an upgrade
function purchaseUpgrade(upgrade) {
  if (score >= upgrade.cost) {
    score -= upgrade.cost;
    damagePerClick += upgrade.bonus;
    upgrade.cost = Math.round(upgrade.cost * 1.2);
    updateDisplay();
  }
}

// Navigate to the previous level
document.getElementById("prevLvl").addEventListener("click", function() {
  currentLevel--;
  stopBossTimer();
  calculateHP();
  updateDisplay();
});

// Navigate to the next level
document.getElementById("nextLvl").addEventListener("click", function() {
  currentLevel++;
  stopBossTimer();
  calculateHP();
  updateDisplay();
});

// Attack button
document.getElementById("attack-btn").addEventListener("click", function() {
  enemyHP -= damagePerClick;
  if (enemyHP <= 0) {
    // Boss defeated — stop timer before moving on
    if (isBossFight) stopBossTimer();

    calculateHP();
    score += Math.round(enemyHP / 10);
    enemiesKilled++;
    if (currentLevel == maxLevel) killsForNextLevel++;

    // Unlock the next level after enough kills
    if (currentLevel == maxLevel &&
        ((!isBossFight && (killsForNextLevel > 1 && killsForNextLevel % 10 == 0)) ||
         (isBossFight && killsForNextLevel == 1))) {
      maxLevel++;
      currentLevel++;
      calculateHP();
      killsForNextLevel = 0;
    }
  }
  updateDisplay();
});

// Calculate enemy HP and boss status, then manage the timer accordingly
function calculateHP() {
  enemyHP = Math.round(4 * currentLevel + Math.pow(1.2, currentLevel));
  if (currentLevel % 5 == 0) enemyHP *= 20;
  isBossFight = currentLevel % 5 == 0;

  if (isBossFight) {
    bossMaxHP = enemyHP;
    startBossTimer();
  } else {
    stopBossTimer();
  }
}

// Initialize
updateDisplay();