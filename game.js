let score = 0;
let pointsPerClick = 1;


//function to update the score when the button is clicked
function updateDisplay(){
   document.getElementById("score=display").textContent = score;
   document.getElementById("points-per-click-display").textContent = pointsPerClick;
}


//event listener for the click button
document.getElementById("click-button").addEventListener("click", function(){{
    score += pointsPerClick;
    updateDisplay();
}})
