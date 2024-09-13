document.addEventListener('DOMContentLoaded', () => {
    const totalPoints = 99;
    let pointsRemaining = totalPoints;
    let moveNumber = 1;
    let playerMoves = [];
    const types = ['rock', 'paper', 'scissors'];

    const moveNumberDisplay = document.getElementById('move-number');
    const pointsRemainingDisplay = document.getElementById('points-remaining');
    const choices = document.querySelectorAll('.choice');
    const moveSelection = document.getElementById('move-selection');
    const strengthContainer = document.getElementById('strength-container');
    const strengthSlider = document.getElementById('strength-slider');
    const strengthValueDisplay = document.getElementById('strength-value');
    const confirmStrengthButton = document.getElementById('confirm-strength');
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('result-title');
    const resultDetails = document.getElementById('result-details');
    const playAgainButton = document.getElementById('play-again');

    let currentType = '';

    // Sound Effects
    const selectSound = new Audio('sounds/select.mp3');
    const confirmSound = new Audio('sounds/confirm.mp3');
    const winSound = new Audio('sounds/win.mp3');
    const loseSound = new Audio('sounds/lose.mp3');
    const tieSound = new Audio('sounds/tie.mp3');

    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            selectSound.play();
            selectMoveType(choice.dataset.type);
        });
    });

    strengthSlider.addEventListener('input', () => {
        strengthValueDisplay.textContent = strengthSlider.value;
    });

    confirmStrengthButton.addEventListener('click', () => {
        confirmSound.play();
        confirmStrength();
    });

    function selectMoveType(type) {
        if (moveNumber > 3) return;

        currentType = type;
        // Update the max value of the slider based on points remaining
        let maxStrength = pointsRemaining - (3 - moveNumber);
        if (maxStrength > 97) maxStrength = 97;
        strengthSlider.max = maxStrength;
        strengthSlider.value = 1;
        strengthValueDisplay.textContent = strengthSlider.value;
        // Show the strength allocation slider
        strengthContainer.classList.remove('hidden');
    }

    function confirmStrength() {
        let strength = parseInt(strengthSlider.value);

        if (strength < 1 || strength > parseInt(strengthSlider.max)) {
            alert(`Please allocate between 1 and ${strengthSlider.max} points.`);
            return;
        }

        playerMoves.push({ type: currentType, strength });
        pointsRemaining -= strength;
        pointsRemainingDisplay.textContent = `Points Remaining: ${pointsRemaining}`;
        strengthContainer.classList.add('hidden');

        if (moveNumber < 3) {
            moveNumber++;
            moveNumberDisplay.textContent = moveNumber;
        } else {
            // All moves selected
            playGame();
        }
    }

    function playGame() {
        // Hide move selection and show result
        moveSelection.classList.add('hidden');
        resultDiv.classList.remove('hidden');

        // Generate computer's moves
        const computerMoves = generateComputerMoves();

        // Determine the winner
        const result = compareMoves(playerMoves, computerMoves);
        displayResult(result, playerMoves, computerMoves);
    }

    function generateComputerMoves() {
        let remainingPoints = totalPoints;
        const moves = [];

        for (let i = 1; i <= 3; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            let strength;
            if (i < 3) {
                // Allocate at least 1 point per remaining move
                let maxStrength = remainingPoints - (3 - i);
                strength = Math.floor(Math.random() * (maxStrength - 1)) + 1;
                remainingPoints -= strength;
            } else {
                strength = remainingPoints;
            }
            moves.push({ type, strength });
        }
        return moves;
    }

    function compareMoves(playerMoves, computerMoves) {
        let playerScore = 0;
        let computerScore = 0;

        for (let i = 0; i < 3; i++) {
            const playerMove = playerMoves[i];
            const computerMove = computerMoves[i];

            if (playerMove.type === computerMove.type) {
                if (playerMove.strength > computerMove.strength) {
                    playerScore++;
                } else if (playerMove.strength < computerMove.strength) {
                    computerScore++;
                }
                // Tie if strengths are equal
            } else if (
                (playerMove.type === 'rock' && computerMove.type === 'scissors') ||
                (playerMove.type === 'paper' && computerMove.type === 'rock') ||
                (playerMove.type === 'scissors' && computerMove.type === 'paper')
            ) {
                playerScore++;
            } else {
                computerScore++;
            }
        }

        let finalResult = '';
        if (playerScore > computerScore) {
            finalResult = 'victory';
            winSound.play();
        } else if (playerScore < computerScore) {
            finalResult = 'defeat';
            loseSound.play();
        } else {
            finalResult = 'tie';
            tieSound.play();
        }

        return { finalResult };
    }

    function displayResult(result, playerMoves, computerMoves) {
        // Show result illustration
        let illustration = '';
        if (result.finalResult === 'victory') {
            illustration = '<img src="images/victory.png" alt="Victory">';
            resultTitle.textContent = 'You Win!';
        } else if (result.finalResult === 'defeat') {
            illustration = '<img src="images/defeat.png" alt="Defeat">';
            resultTitle.textContent = 'You Lose!';
        } else {
            illustration = '<img src="images/tie.png" alt="Tie">';
            resultTitle.textContent = 'It\'s a Tie!';
        }

        resultDetails.innerHTML = `
            ${illustration}
            <h3>Your Moves:</h3>
            <ul>
                ${playerMoves.map((move, index) => `<li>Move ${index + 1}: ${capitalize(move.type)}, Strength: ${move.strength}</li>`).join('')}
            </ul>
            <h3>Computer's Moves:</h3>
            <ul>
                ${computerMoves.map((move, index) => `<li>Move ${index + 1}: ${capitalize(move.type)}, Strength: ${move.strength}</li>`).join('')}
            </ul>
        `;
    }

    playAgainButton.addEventListener('click', () => {
        // Reset game state
        moveNumber = 1;
        pointsRemaining = totalPoints;
        playerMoves = [];
        moveNumberDisplay.textContent = moveNumber;
        pointsRemainingDisplay.textContent = `Points Remaining: ${pointsRemaining}`;
        moveSelection.classList.remove('hidden');
        resultDiv.classList.add('hidden');
    });

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});