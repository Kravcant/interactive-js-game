let score = 0;
let damagePerClick = 1;
let nextEnemyHP = 10;
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
        enemyHP = nextEnemyHP;
    }
    updateDisplay();
}})
