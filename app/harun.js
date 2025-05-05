var GAME_STATES;
(function (GAME_STATES) {
    GAME_STATES["NOT_PLAYING"] = "Not started";
    GAME_STATES["PLAYING"] = "Playing";
    GAME_STATES["FINISHED"] = "Finished";
})(GAME_STATES || (GAME_STATES = {}));
var gameState = GAME_STATES.NOT_PLAYING;
console.log(gameState);
// start the game
gameState = GAME_STATES.PLAYING;
console.log(gameState);
//finish the game
gameState = GAME_STATES.FINISHED;
console.log(gameState);
