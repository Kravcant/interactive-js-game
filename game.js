let score = 0;
let damagePerClick = 1;
let enemiesKilled = 0;
let level = 1;
let nextEnemyHP = 10 * level;
let enemyHP = nextEnemyHP;


//function to update the score when the button is clicked
function updateDisplay(){
   document.getElementById("score-display").textContent = `Score: ${score}`;
   document.getElementById("rate-display").textContent = `Damage per Click: ${damagePerClick}`;
   document.getElementById("health-display").textContent = `HP: ${enemyHP}`;
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
