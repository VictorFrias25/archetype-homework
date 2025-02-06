let possibleWords = [
    "Laptop",
    "Desktop",
    "Javascript",
    "HTML",
    "CSS"
]

let currentWordArray, underscoresLength, underscoresArray, guessAmount = 8, lettersGuessed = [], userInput, hasWon;


function startGame(){
    hasWon = false;
    let randomWord = Math.floor(Math.random() * possibleWords.length);
    currentWordArray = possibleWords[randomWord].split("");
    console.log(`game started from button`);
    console.log(`Here is your current word: ${currentWordArray.join("")}`);
    underscoresLength = currentWordArray.length;
    underscoresArray = Array(underscoresLength).fill("_");
    console.log(`Here is how many underscores you will need for your current word: ${underscoresLength}`);
    console.log(`Here is your underscores array: ${underscoresArray.join(" ")}`);
    
    gameAlertBox();
}

function gameAlertBox(){

let lettersToDisplay = lettersGuessed.length > 0 ? `Letters guessed: ${lettersGuessed.join(", ")}` : "";
let messageToDisplay = `Your word: ${underscoresArray.join(" ")}\nGuesses left: ${guessAmount}\n${lettersToDisplay}`;

if(!underscoresArray.includes("_")){
    // alert(`You win!`);
    hasWon = true;
    lettersGuessed = [];
    lettersToDisplay = lettersGuessed.length > 0 ? `Letters guessed: ${lettersGuessed.join(", ")}` : "";
}
if(hasWon){
    alert(`you win! the word was ${currentWordArray.join("")}`);
    // if(`Do you want to play again?`);
    if(confirm(`Do you want to play again?`)){
        startGame();
    } else {
        alert(`Thank you for playing!`);
        return;
    }
}

UserInput = prompt(messageToDisplay).trim();

if(!/^[a-zA-Z]$/.test(UserInput)){
    alert(`No numbers or symbols! Please type only ONE letter.`);
    gameAlertBox();
} else {
    UserInput = UserInput.toLowerCase();
    let lowerCaseCurrentWordArray = currentWordArray.map(letter => letter.toLowerCase());
    if(lettersGuessed.includes(UserInput)){
        alert(`Letter has already been guessed!`);
        gameAlertBox();
    } else {
        lettersGuessed.push(UserInput);
        if(lowerCaseCurrentWordArray.includes(UserInput)){
            console.log(`Letter is included!`);
            for (let i = 0; i < currentWordArray.length; i++) {
                if (lowerCaseCurrentWordArray[i] === UserInput) {
                    underscoresArray[i] = currentWordArray[i]; // Keep original case
                }
            }
            gameAlertBox();
        } else {
            if(guessAmount <= 0){
                alert(`Game over!`);
                alert(`The correct word was ${currentWordArray.join("")}!`);
            } else {
            alert(`Wrong guess!`);
            guessAmount--; 
            gameAlertBox();
        }
        } 
    }
}



}

if(confirm(`start game?`)){
    startGame();
} else {
    alert(`Thanks for stopping by!`);
}