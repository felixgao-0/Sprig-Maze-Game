/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started


@title: Escape Arcade Prision!
@author: Felix Gao
@tags: ["Puzzle", "Prison"]
@addedOn: 2024-00-00
*/

// People lol
const player = "p";
const player2 = "o";

const guard = "g";
const guard2 = "f";

// Misc
const levelUp = "l"
const wall = "w";

// Lasers!
const laserVert = "v";
const laserVertOff = "c";

const laserHorz = "h";
const laserHorzOff = "j";

// This door is never unlockable
const door = "d";
const doorHorz = "s";
  
const doorLocked = "z";
const doorLockedHorz = "x";

const key = "k";
const objective = "m";

// Minigame stuff
// WIP!
const lockPin = "r";
const lockPinDone = "e";
const goalLine = "t";

let lockTimer = 15;
let stopPin = false;
let pinSelection = null;

let pinsFinished = 0;

let pinSprite = null;
let yPath = cyclicIteration([0, 1, 2, 3, 4])

let attempts = 4;

let pinTimer = null;
let minigameTimer = null;

setLegend(
  [player, bitmap`
................
................
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..666666006006..
..666666006006..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
................
................`],
  [player2, bitmap`
................
................
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..600600666666..
..600600666666..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
..666666666666..
................
................`],
  [guard, bitmap`
................
................
..333333333333..
..333333333333..
..333333333333..
..333333003003..
..333333003003..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
................
................`],
  [guard2, bitmap`
................
................
..333333333333..
..333333333333..
..333333333333..
..300300333333..
..300300333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
..333333333333..
................
................`],
  
  [wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  
  [laserVert, bitmap`
................
................
................
................
................
L..............L
L1............1L
L13333333333331L
L1............1L
L..............L
................
................
................
................
................
................`],
  [laserVertOff, bitmap`
................
................
................
................
................
L..............L
L1............1L
L1............1L
L1............1L
L..............L
................
................
................
................
................
................`],
  [laserHorz, bitmap`
......LLLLL.....
.......111......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
........3.......
.......111......
......LLLLL.....`],
  [laserHorzOff, bitmap`
......LLLLL.....
.......111......
................
................
................
................
................
................
................
................
................
................
................
................
.......111......
......LLLLL.....`],
  
  [levelUp, bitmap`
................
.DDD..DDDD..DDD.
.D............D.
.D............D.
................
................
.D............D.
.D............D.
.D............D.
.D............D.
................
................
.D............D.
.D............D.
.DDD..DDDD..DDD.
................`],
  
  [door, bitmap`
....LLLLLLL.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....L11111L.....
....LLLLLLL.....`],
  [doorHorz, bitmap`
................
................
................
................
LLLLLLLLLLLLLLLL
L11111111111111L
L11111111111111L
L11111111111111L
L11111111111111L
L11111111111111L
LLLLLLLLLLLLLLLL
................
................
................
................
................`],
  [doorLocked, bitmap`
.....LLLLLLL....
.....L11111L....
.....L11111L....
.....L11111L....
.....L16661L....
.....L61116L....
.....L61116L....
.....L16661L....
.....L11611L....
.....L11661L....
.....L11611L....
.....L11661L....
.....L11111L....
.....L11111L....
.....L11111L....
.....LLLLLLL....`],
  [doorLockedHorz, bitmap`
................
................
................
................
................
LLLLLLL66LLLLLLL
L11111611611111L
L11111611611111L
L11111166111111L
L11111161111111L
L11111166111111L
LLLLLLL6LLLLLLLL
.......66.......
................
................
................`],
  
  [key, bitmap`
................
................
................
................
......999.......
.....9...9......
.....9...9......
......999.......
.......9........
.......99.......
.......9........
.......99.......
................
................
................
................`],
  [objective, bitmap`
................
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
.......99.......
................
.......99.......
.......99.......
................
................`],
  
  [lockPin, bitmap`
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
......0000......
................`],
  [lockPinDone, bitmap`
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
......DDDD......
................`],
  [goalLine, bitmap`
................
................
................
................
................
................
6666666666666666
6666666666666666
6666666666666666
6666666666666666
................
................
................
................
................
................`]
)

// Setup levels and different misc. screens here
// Using 13x9 size for most maps
// NOTE SELF: Each level should have the player and a checkpoint
let level = 0
const levels = [
  map`
w...........w
w...........w
w...........w
w..........lw
w..........lw
www.wwwswwwsw
w...w...w...w
w..pw...w...w
w...w...w...w`,
  map`
........w....
........w....
........wwwww
........h...l
p.......h...l
wwwswwwswwwww
w...w...w....
w...w...w....
w...w...w....`,
  map`
.......w..w.k
.......w..w..
wwwwww.wssw..
..........w..
p.......g.wcc
wwwwwxxw..w..
.......w..w..
.......w..h..
llwwwwww..h..`,
  map`
p.w...w...w..
..w...w...w..
.kwww.wwwswww
...j...h.....
...j...h.....
wwwwwxwwwvwww
.......w.....
.......w.....
llwwwwww.....`,
  map`
p.w...w...w..
..w...w...w..
..www.wwwswww
...j...h.....
...j...h.....
wwwwwxwwwvwww
.......w.....
.......w...k.
llwwwwww.....`,
  map`
..w..........
p.wwwwwwwwwww
..h.......z.l
..h.......z.l
..h.......z.l
sswwwwww.wwww
..w.......w..
..w.f...k.w..
..w.......w..`,
  map`
....h...h...l
....h.g.h...l
....h...h...l
wwwwwvvvwwwww
....w...w....
....w...w....
....w...w....
....wsssw....
....w...w....`,
  map`
...h...hz...l
...h.g.hz...l
...h...hz...l
wvwwvvvwwwwww
...w...w.kw..
...w...w..w..
...h...h..d..
...w...w..w..
...w...w..w..`,
  map`
...h...hz...l
...h.g.hz...l
...h...hz...l
wvwwvvvwwwwww
...w...w.kw..
...w...w..w..
...h...h..d..
...w...w..w..
...w...w..w..`,
  map``
  
]

// Misc settings

const guardPath = [
  null,
  null,
  [
    [8,4],
    [7,4],
    [6,4],
    [5,4],
    [4,4]
  ], 
  null,
  null,
  [
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 7]
  ]
]

const screenText = [
  [
    ["Quick! >>>", { x: 4, y: 3, color: color`0`}]
  ], 
  [
    ["Watch out!", { x: 2, y: 3, color: color`0`}],
    ["lasers! >", { x: 2, y: 5, color: color`0`}]
  ], 
  [
    ["Guard!", { x: 1, y: 3, color: color`0`}]
  ], 
  [
    ["Here!", { x: 5, y: 2, color: color`0`}]
  ],
  null,
  null,
  null
]

const misc = {
  welcome: map`
.............
.............
.............
.............
.............
.............
.............
.............
.............`,
  lost: map`
wwwwwwwwwwwww
w...........w
w...........w
w...........w
w...........w
w...........w
wwwswwwswwwsw
w...w...w...w
w..pw...w...w
w...w...w...w`,
  victory: map`
.w...........
.w...........
ww...........
.d...........
.d...........
ww...........
.w....p......
.w...........
.w...........`,
  tutorialFriendly: map`
.............
.p...........
.............
.l...........
.............
.z...........
.............
.k...........
.............`,
  tutorialHostile: map`
.............
.g...........
.............
.h...........
.............
.d...........
.............
.............
.............`,
  lockGame: map`
r.r.r.rw
.......w
tttttttw
.......w
.......w`,
}

const music = {
  caught: tune`
500: A4-500 + G4-500 + F4-500 + E4-500,
500,
500: G4-500 + F4-500 + E4-500 + D4-500,
14500`,
  background: tune`
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500,
500: C5-500 + A4~500 + G5~500 + F5-500,
500: G4/500 + F5-500,
500: G4/500 + G5~500,
500: D4-500 + B4/500`,
  victory: tune`
410.958904109589: E4-410.958904109589,
410.958904109589: F4-410.958904109589,
410.958904109589: B4-410.958904109589,
410.958904109589: C5-410.958904109589 + C4^410.958904109589,
410.958904109589,
410.958904109589: C4-410.958904109589 + C5^410.958904109589,
10684.931506849314`,

  correct: tune`
500: F5-500 + C5-500 + G4/500,
500: G5-500 + C5-500 + G4/500,
15000`,
  missed: tune`
500: D5/500 + G4-500,
500: G4/500 + D4-500,
15000`
}

let minigame = false;
let tutorial = true;
let restart = false;

let game = null;
let guardAI = null;
let iterator = null;
let timer = 600;

let playback = playTune(music.background, Infinity);

setSolids([player, player2, wall, door, doorHorz, doorLocked, doorLockedHorz, guard, guard2]);

setPushables({
  [player]: []
});

// Tutorial prompt
let x_align = 4;

// Tutorial text is stored in a var for convenience
let tutorialText = [
  [
    ["You!", { x: x_align, y: 3, color: color`0`}],
    ["Next Lv", { x: x_align, y: 6, color: color`0`}],
    ["Locked door", { x: x_align, y: 9, color: color`0`}],
    ["Key = open", { x: x_align, y: 12, color: color`0`}],
  ],
  [
    ["Avoid Guards", { x: x_align, y: 3, color: color`0` }],
    ["Avoid lasers", { x: x_align, y: 6, color: color`0` }],
    ["perma-lock door", { x: x_align, y: 9, color: color`0` }]
  ],
  [
    ["Escape Arcade JAIL:", { x: 0, y: 3, color: color`D` }],
    ["You have been caught", { x: 0, y: 5, color: color`0` }],
    ["faking points. You", { x: 0, y: 6, color: color`0` }],
    ["have been sentenced to", { x: 0, y: 7, color: color`0` }],
    ["LIFE in Arcade jail.", { x: 0, y: 8, color: color`0` }],
    ["Tip: tutorial loops", { x: 0, y: 12, color: color`9` }]
  ]
]

setMap(misc.welcome);
tutorialText[2].forEach((text) => addText(text[0], options=text[1]));
addText("Press 'L' to play!", options = { x: 1, y: 14, color: color`5` });

tutorialScreen = setInterval(tutorialAnimation, 4000);

let tutorialFlag = 1;
function tutorialAnimation() {
  clearText();
  if (tutorialFlag == 1) {
    setMap(misc.tutorialFriendly);
    tutorialText[0].forEach((text) => addText(text[0], options=text[1]));
    addText("Press 'L' to play!", options = { x: 1, y: 14, color: color`5` });
    tutorialFlag++;
  } else if (tutorialFlag == 2) {
    setMap(misc.tutorialHostile);
    tutorialText[1].forEach((text) => addText(text[0], options=text[1]));
    addText("Press 'L' to play!", options = { x: 1, y: 14, color: color`5` });
    tutorialFlag++;
  } else {
    setMap(misc.welcome);
    tutorialText[2].forEach((text) => addText(text[0], options=text[1]));
    addText("Press 'L' to play!", options = { x: 1, y: 14, color: color`5` });
    tutorialFlag = 1;
  }
}
// END TUTORIAL!


// inputs for player movement control
onInput("w", () => {
  if (!tutorial && !minigame) {
    try {
      getFirst(player).y -= 1;
    } catch (error) {
      getFirst(player2).y -= 1;
    }
  }
});

onInput("a", () => {
  if (!tutorial && !minigame) {
    try {
      getFirst(player).x -= 1;
      getFirst("p").type = "o";
    } catch (error) {
      getFirst(player2).x -= 1;
    }
  }
});

onInput("s", () => {
  if (!tutorial && !minigame) {
    try {
      getFirst(player).y += 1;
    } catch (error) {
      getFirst(player2).y += 1;
    }
  }
});

onInput("d", () => {
  if (!tutorial && !minigame) {
    try {
      getFirst(player2).x += 1;
      getFirst("o").type = "p";
    } catch (error) {
      getFirst(player).x += 1;
    }
  }
});

onInput("j", () => {
  nextLevel();
});

onInput("l", () => {
  if (tutorial) { // Start the game!
    clearInterval(tutorialScreen);
    setMap(levels[0]);
    clearText();
    game = setInterval(updateGame, 1000);
    guardAI = setInterval(runGuard, 2000);
    iterator = cyclicIteration(guardPath[level]);
    screenText[0].forEach((text) => addText(text[0], options=text[1]));
    tutorial = false;
    
  } else if (restart) { // Restart game if caught
    level = 0;
    var timer = 600;
    setMap(levels[0]);
    clearText()
    game = setInterval(updateGame, 1000);
    guardAI = setInterval(runGuard, 1000);
    iterator = cyclicIteration(guardPath[level]);
    playback = playTune(music.background, Infinity);
    restart = false;
  }
});

// Keybinds for the lockpick minigame
// inputs for player movement control
let victory = false;
onInput("i", () => {
  getTile(getFirst("r").x, getFirst("r").y).forEach(sprites => {
    if (sprites.type == "t") {
      victory = true;
    }
  });
  if (victory) {
    getFirst("r").type = "e";
    victory = false;
    yPath = cyclicIteration([0, 1, 2, 3, 4])
    pinsFinished++;
    if (pinsFinished == 2) { // When we finish more pins, the rest go faster
      clearInterval(pinTimer);
      pinTimer = setInterval(pinDown, 300);
    } else if (pinsFinished >= 3) {
      clearInterval(pinTimer);
      pinTimer = setInterval(pinDown, 250);
    }
  } else {
    attempts--;
    splashText(`${attempts}/4 trys left!`, 3000, false);
  }
  if (attempts <= 0) {
    clearInterval(pinTimer);
    clearInterval(minigameTimer);
    clearText();
    addText("You lost!", {color: color`2`});
    setCaught();
    minigame = false;
  }
});

let playerPos = null;
function startLockGame() {
  clearText();
  playerPos = getPlayer();
  attempts = 4;      // Reset the attempts
  pinsFinished = 0;  // & progress of minigame
  minigame = true;
  clearInterval(game);
  clearInterval(guardAI);
  pinTimer = setInterval(pinDown, 500);
  minigameTimer = setInterval(runTimer, 1000);
  setMap(misc.lockGame);
}

minigameTimerCount = 15;
function runTimer() {
  addText(`Pick lock in ${minigameTimerCount} secs`, { x: 0, y: 0, color: color`2`});
  if (timer <= 0) {
    setCaught();
    minigame = false;
  }
  minigameTimerCount--;
}

function pinDown() {
  try {
    pinSprite = getFirst("r");
    if (pinSprite != null) {
      pinSprite.y = yPath.next().value;
    } else if (pinsFinished == 4) { // <= This determines if we win da minigame
      clearInterval(pinTimer);
      clearInterval(minigameTimer);
      game = setInterval(updateGame, 1000);
      guardAI = setInterval(runGuard, 1000);
      splashText("Unlocked vault!");
      setMap(levels[level]);
      getPlayer().x = playerPos.x;
      getPlayer().y = playerPos.y;
      getPlayer().type = playerPos.type;
      victory = false;
      minigame = false; // <= Allow player movement and loops to continue
    }
  } catch (error) {
    console.log(error);
  }
}


// Add text to screen and remove it, for quick messages
function splashText(text, time = 3000, addTextBack = true) {
  let options = {y: 15, color: color`6` };
  addText(text, options=options);
  setTimeout( function() {
    clearText();
    if (addTextBack) {
      timerText = addText(`Escape in ${timer} secs`, { x: 1, y: 0, color: color`2`});
      if (screenText[level] != null) {
        screenText[level].forEach((text) => addText(text[0], options=text[1]));
      }
    }
  }, time); //Clear splash text and put other text back
}

function blockHas(block, item) {
  for (let sprite of block) {
    if (sprite.type == item) {
      return true;
    }
  }
  return false;
}

function getPlayer() {
  let playerModel = null;
  if (getFirst("p") !== undefined) {
      playerModel = getFirst("p");
  } else if (getFirst("o") !== undefined) {
      playerModel = getFirst("o");
  } else {
    throw new Error('No player sprite');
  }
  console.log(`Player Coords: (${playerModel.x}, ${playerModel.y})`)
  return playerModel;
}

function getGuard() {
  let GuardModel = null;
  if (getFirst("g") !== undefined) {
      GuardModel = getFirst("g");
  } else if (getFirst("f") !== undefined) {
      GuardModel = getFirst("f");
  }
  return GuardModel;
}


// Iterate infinitely front and back
// CREDIT: ChatGPT, modified code
function cyclicIteration(array) {
  if (array == null) {
    return null
  }
  let index = 0;
  let direction = 1;
  let directionStr = "";

  // Store the last move to calculate guard NPC animation
  let lastMove = null;

  return {
    next: function() {
      if (index === array.length - 1) {
        direction = -1;
      } else if (index == 0) {
        direction = 1;
      }

      const currentValue = array[index];
      index += direction;
      
      if (lastMove == null) {
        lastMove = currentValue;
        return {value: currentValue, directionStr: "nothing yet"};
      }
      
      let difference = lastMove[0] - currentValue[0];
      if (difference >= 1) { // If the x is increasing / moving left <<<
        directionStr = "left";
      } else if (difference <= -1) { // If the x is decreasing / moving right >>>
        directionStr = "right";
      } else { // else then not moving left or right
        directionStr = "up/down"
      }

      lastMove = currentValue;
      return {value: currentValue, direction: directionStr};
    }
  };
}

// Aw man I got caught by a guard!
function setCaught() {
  playback.end();
  playTune(music.caught);
  clearText(); // Clear text which may be onscreen before adding screen
  addText("You got caught!", options = { x: 3, y: 3, color: color`3` });
  addText("Press 'L' to", options = { x: 4, y: 5, color: color`0` });
  addText("lockpick out", options = { x: 4, y: 6, color: color`0` })
  setMap(misc.lost);
  clearInterval(game);
  clearInterval(guardAI);
  restart = true;
  level = 0;
}

/* Credit for this function: Tutorial :D */
function nextLevel() {
  clearText();
  level++;

  const currentLevel = levels[level];

  if (currentLevel !== undefined) {
    iterator = cyclicIteration(guardPath[level]);
    setMap(currentLevel);
    if (screenText[level] != null) {
      screenText[level].forEach((text) => addText(text[0], options=text[1]));
    }
  } else { // No more maps to load so victory!
    addText("You WIN!", { y: 4, color: color`D` });
    playback.end();
    playTune(music.victory);
    setMap(misc.victory);
    clearInterval(game);
    clearInterval(guardAI);
  }
}


/* After ALL THAT SETUP ABOVE ME comes the fun part! */

// Guard logic
function runGuard() {
  if (iterator !== null) {
    const coords = iterator.next();
    const guardSprite = getGuard();

    guardSprite.x = coords.value[0];
    guardSprite.y = coords.value[1];

    if (coords.direction == "left") {
      guardSprite.type = "f";
      try {
        getFirst("g").remove() // BUGFIX: This fixed the duplicating guard glitch
      } catch (error) {
        console.log(error);
      }
    } else if (coords.direction == "right") {
      guardSprite.type = "g";
      try {
        getFirst("f").remove() // BUGFIX: This fixed the duplicating guard glitch
      } catch (error) {
        console.log(error);
      }
    }
  }

  let guard = getGuard();
  if (guard != null) {
    for (let x = guard.x - 1; x <= guard.x + 1; x++) {
      for (let y = guard.y - 1; y <= guard.y + 1; y++) {
        const sprites = getTile(x, y);

        // Can't use the func I built D:
        for (let sprite of sprites) {
          if (sprite.type == "p" || sprite.type == "o") {
            setCaught();
          }
        }
      }
    }
  }
}

// Most player physics is here
afterInput(() => {
  if (!minigame) {
    playerSprite = getPlayer();
    block = getTile(playerSprite.x, playerSprite.y);
    
    // If touch active laser then player die 
    if (blockHas(block, "h") || blockHas(block, "v")) {
      setCaught();
    }
  
    // If touch key then open all door
    if (blockHas(block, "k")) {
      getAll("x").forEach((door) => door.remove());
      getAll("z").forEach((door) => door.remove());

      getFirst("k").remove();
      splashText("Doors open!", 1000);
      startLockGame();
    }

    // If touch checkpoint promote next level!
    if (blockHas(block, "l")) {
      nextLevel();
    }

    // If in 3x3 range of guard, caught!
    let guard = getGuard();
    if (guard != null) {
      for (let x = guard.x - 1; x <= guard.x + 1; x++) {
        for (let y = guard.y - 1; y <= guard.y + 1; y++) {
          const sprites = getTile(x, y);

          // Can't use the func I built D:
          for (let sprite of sprites) {
            if (sprite.type == "p" || sprite.type == "o") {
              setCaught();
            }
          }
        }
      }
    }
  }
});

/* Enable and disable all lasers every 1 sec, run timer */
var laserOn = false;
function updateGame() {
  // Timer!
  /* CREDIT TIMER: Thanks to https://sprig.hackclub.com/~/pIrXiIjFINorvL2bCYM9! */
  timerText = addText(`Escape in ${timer} secs`, { x: 1, y: 0, color: color`2`});
  
  let laserSprites = [];
  laserSprites.push.apply(laserSprites, getAll("j"));
  laserSprites.push.apply(laserSprites, getAll("c"));
  laserSprites.push.apply(laserSprites, getAll("h"));
  laserSprites.push.apply(laserSprites, getAll("v"));

  laserSprites.forEach((laser) => {
    if (laser.type == "j") {
      laser.type = "h";
    } else if (laser.type == "c") {
      laser.type = "v";
    } else if (laser.type == "h") {
      laser.type = "j";
    } else if (laser.type == "v") {
      laser.type = "c";
    }
  });

  playerSprite = getPlayer();
  console.log("update game!");
  block = getTile(playerSprite.x, playerSprite.y);

  //  Check if lasers touching player every sec
  if (blockHas(block, "h") || blockHas(block, "v")) {
    setCaught()
  }

  // Check if times out and Hakkuun has woken up!
  if (timer <= 0) {
    setCaught();
  }
  
  timer--;
}      
