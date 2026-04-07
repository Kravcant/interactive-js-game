let score = 0;
let damagePerClick = 1;
let enemiesKilled = 0;
let level = 1;
let nextEnemyHP = 10 * level;
let enemyHP = nextEnemyHP;

// Upgrades arraydata-driven pattern
const upgrades = [
  { id: 1, name: "Iron Sword", cost: 10, bonus: 1 },
  { id: 2, name: "Peasant Farm", cost: 75, bonus: 5 },
  { id: 3, name: "Sword Master", cost: 300, bonus: 20 },
  { id: 4, name: "Knight Mastery", cost: 600, bonus: 35 },
  { id: 5, name: "Balista", cost: 1200, bonus: 50 },
  { id: 6, name: "Elixir Potion", cost: 2500, bonus: 75 },
  { id: 7, name: "Dragon Slayer Training", cost: 5000, bonus: 120 },
  { id: 8, name: "Rune Enhancement", cost: 8000, bonus: 160 },
  { id: 9, name: "Ancient Artifact", cost: 12000, bonus: 220 },
  { id: 10, name: "Blessing of the Gods", cost: 20000, bonus: 300 }
];


//function to update the score when the button is clicked
function updateDisplay(){
   document.getElementById("score-display").textContent = `Score: ${score}`;
   document.getElementById("rate-display").textContent = `Damage per Click: ${damagePerClick}`;
   document.getElementById("health-display").textContent = `HP: ${enemyHP}`;
   renderUpgrades();
}

// Function to render upgrade buttons dynamically
function renderUpgrades() {
  const upgradesContainer = document.getElementById("upgrades");
  upgradesContainer.innerHTML = "";
  
  upgrades.forEach(upgrade => {
    const button = document.createElement("button");
    const canAfford = score >= upgrade.cost;
    button.disabled = !canAfford;
    button.textContent = `${upgrade.name} (Cost: ${upgrade.cost}, +${upgrade.bonus} Damage)`;
    
    button.addEventListener("click", function() {
      purchaseUpgrade(upgrade);
    });
    
    upgradesContainer.appendChild(button);
  });
}

// Function to purchase an upgrade
function purchaseUpgrade(upgrade) {
  if (score >= upgrade.cost) {
    score -= upgrade.cost;
    damagePerClick += upgrade.bonus;
    updateDisplay();
  }
}


//event listener for the click button
document.getElementById("click-btn").addEventListener("click", function(){{
    enemyHP -= damagePerClick;
    if (enemyHP <= 0) {
        score += Math.round(nextEnemyHP / 10);
        enemiesKilled++;
        if (enemiesKilled == 10) {
            enemiesKilled = 0;
            level++;
            nextEnemyHP = 10 * level;
        }
        enemyHP = nextEnemyHP;
    }
    updateDisplay();
}});

// Initialize the display
updateDisplay();
