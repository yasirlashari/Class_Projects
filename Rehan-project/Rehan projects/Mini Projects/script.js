let userScore = 0;
let compScore = 0;

function play(userChoice) {

    const choices = ["rock", "paper", "scissors"];
    const compChoice = choices[Math.floor(Math.random() * 3)];

    const resultText = document.getElementById("resultText");
    const userScoreDisplay = document.getElementById("userScore");
    const compScoreDisplay = document.getElementById("compScore");

    // Animation reset
    resultText.style.animation = "none";
    void resultText.offsetWidth; // restart animation
    resultText.style.animation = "fadeIn 0.5s forwards";

    // Shake animation (computer thinking)
    resultText.classList.add("shake");
    setTimeout(() => resultText.classList.remove("shake"), 500);

    let result = "";

    if (userChoice === compChoice) {
        result = "It's a draw! 😐";
    } 
    else if (
        (userChoice === "rock" && compChoice === "scissors") ||
        (userChoice === "paper" && compChoice === "rock") ||
        (userChoice === "scissors" && compChoice === "paper")
    ) {
        userScore++;
        userScoreDisplay.textContent = userScore;
        
        // Pop score animation
        userScoreDisplay.classList.add("pop");
        setTimeout(() => userScoreDisplay.classList.remove("pop"), 300);

        result = `You win! 🎉 (${userChoice} beats ${compChoice})`;
    } 
    else {
        compScore++;
        compScoreDisplay.textContent = compScore;

        // Pop score animation
        compScoreDisplay.classList.add("pop");
        setTimeout(() => compScoreDisplay.classList.remove("pop"), 300);

        result = `You lose! 😢 (${compChoice} beats ${userChoice})`;
    }

    resultText.textContent = result;
}
