enum GAME_STATES {
    NOT_PLAYING = "Not started",
    PLAYING = "Playing",
    FINISHED = "Finished",
}

let gameState = GAME_STATES.NOT_PLAYING;
console.log(gameState);

// start the game
gameState = GAME_STATES.PLAYING;
console.log(gameState);

//finish the game
gameState = GAME_STATES.FINISHED;
console.log(gameState);
