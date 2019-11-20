let myFont; //The font we'll use throughout the app

let gameOver = true; //If it's true the game will render the main menu

//===Game objects
//Declare game objects here like player, enemies etc
let floatingTexts = [];
let particles = [];
let explosions = [];

//EXAMPLE
let nodes = [];

//===Buttons
let playButton;
let soundButton;
let leaderboardButton;

//===Score data
let score = 0;
let scoreGain;
let scoreAnimTimer = 1;

//===Data taken from Game Settings
let startingLives;
let lives;

//===Images
let imgLife;
let imgBackground;
let imgParticle;
let imgExplosion;

//===Audio
let sndMusic;
let sndTap;

let soundEnabled = true;
let canMute = true;

let soundImage;
let muteImage;

//===Size stuff
let objSize; //base size modifier of all objects, calculated based on screen size

//game size in tiles, using bigger numbers will decrease individual object sizes but allow more objects to fit the screen
//Keep in mind that if you change this, you might need to change text sizes as well
let gameSize = 18;

let isMobile = false;
let touching = false; //Whether the user is currently touching/clicking

let cameraPositionDefault;
let shakeTimer = 0;

//===This function is called before starting the game
function preload() {

  //===Load font from google fonts link provided in game settings
  var link = document.createElement('link');
  link.href = Koji.config.strings.fontFamily;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  myFont = getFontFamily(Koji.config.strings.fontFamily);
  let newStr = myFont.replace("+", " ");
  myFont = newStr;
  //===

  //===Load images

  //Load background if there's any
  if (Koji.config.images.background != "") {
    imgBackground = loadImage(Koji.config.images.background);
  }

  imgLife = loadImage(Koji.config.images.lifeIcon);
  imgParticle = loadImage(Koji.config.images.particle);
  imgExplosion = loadImage(Koji.config.images.explosion);

  soundImage = loadImage(Koji.config.images.soundImage);
  muteImage = loadImage(Koji.config.images.muteImage);

  //===Load Sounds here
  //Include a simple IF check to make sure there is a sound in config, also include a check when you try to play the sound, so in case there isn't one, it will just be ignored instead of crashing the game
  if (Koji.config.sounds.tap) sndTap = loadSound(Koji.config.sounds.tap);

  //Music is loaded in setup(), to make it asynchronous

  //===Load settings from Game Settings
  startingLives = parseInt(Koji.config.strings.lives);
  lives = startingLives;
  scoreGain = parseInt(Koji.config.strings.scoreGain);

}

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;

  //===How much of the screen should the game take, this should usually be left as it is
  let sizeModifier = 0.75;
  if (height > width) {
    sizeModifier = 1;
  }

  createCanvas(width, height);

  //Magically determine basic object size depending on size of the screen
  objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

  isMobile = detectMobile();

  //set our font in both the game and html body(needed for leaderboards)
  textFont(myFont);
  document.body.style.fontFamily = myFont;

  playButton = new PlayButton();
  soundButton = new SoundButton();
  leaderboardButton = new LeaderboardButton();

  //Load music asynchronously and play once it's loaded
  //This way the game will load faster
  if (Koji.config.sounds.backgroundMusic) sndMusic = loadSound(Koji.config.sounds.backgroundMusic, playMusic);
}

//Resizes canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  width = window.innerWidth;
  height = window.innerHeight;

  //===How much of the screen should the game take, this should usually be left as it is
  let sizeModifier = 0.75;
  if (height > width) {
    sizeModifier = 1;
  }

  //Magically determine basic object size depending on size of the screen
  objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

  cameraPositionDefault = createVector(camera.position.x, camera.position.y);
}

function draw() {

  //Manage cursor - show it on main menu, and hide during game, depending on game settings
  if (!gameOver) {
    if (!Koji.config.strings.enableCursor) {
      noCursor();
    }
  } else {
    cursor(ARROW);
  }

  //Draw background or a solid color
  if (imgBackground) {
    background(imgBackground);
  } else {
    background(Koji.config.colors.backgroundColor);
  }

  //===Draw UI
  if (gameOver) {

    camera.off();
    drawMainMenu();
    cameraPositionDefault = createVector(camera.position.x, camera.position.y);

  } else {

    camera.on();

    if (shakeTimer > 0) {
      shakeTimer -= 1 / frameRate();
      doCameraShake();
    } else {
      camera.position.x = cameraPositionDefault.x;
      camera.position.y = cameraPositionDefault.y;
    }

    //Update and render all game objects here

    //===EXAMPLE
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].render();
    }
    //===

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].render();
    }

    for (let i = 0; i < explosions.length; i++) {
      explosions[i].update();
      explosions[i].render();
    }

    for (let i = 0; i < floatingTexts.length; i++) {
      floatingTexts[i].update();
      floatingTexts[i].render();
    }

    //===Ingame UI
    camera.off();

    //===Score draw
    if (scoreAnimTimer < 1) {
      scoreAnimTimer += 1 / frameRate() * 4;
    }

    let scoreX = width - objSize / 2;
    let scoreY = objSize / 3;
    let txtSize = Ease(EasingFunctions.outBack, scoreAnimTimer, objSize * 2.5, -objSize * 0.5);
    textSize(txtSize);
    fill(Koji.config.colors.scoreColor);
    textAlign(RIGHT, TOP);
    text(score.toLocaleString(), scoreX, scoreY);

    //Lives draw
    let lifeSize = objSize;
    for (let i = 0; i < lives; i++) {
      image(imgLife, lifeSize / 2 + lifeSize * i, lifeSize / 2, lifeSize, lifeSize);
    }

    //EXAMPLE
    push();
    textAlign(LEFT, TOP);
    textSize(objSize * 0.75);
    text("Click - Score Points\nSPACE - Shake Camera\nE - Spawn Explosion\nP - Submit Score to leaderboard", lifeSize / 2, lifeSize * 2);
    pop();

    cleanup();

  }

  soundButton.render();
}


//===Go through objects and see which ones need to be removed
//A good practive would be for objects to have a boolean like removable, and here you would go through all objects and remove them if they have removable = true;
//Removing objects is important to prevent memory leaks in your game
function cleanup() {
  for (let i = 0; i < floatingTexts.length; i++) {
    if (floatingTexts[i].timer <= 0) {
      floatingTexts.splice(i, 1);
    }
  }

  for (let i = 0; i < particles.length; i++) {
    if (particles[i].removable) {
      particles.splice(i, 1);
    }
  }

  for (let i = 0; i < explosions.length; i++) {
    if (explosions[i].removable) {
      explosions.splice(i, 1);
    }
  }
}


//===Handle input
function touchStarted() {
  if (!gameOver) {
    //Ingame
    touching = true;

    //EXAMPLE
    if (sndTap) sndTap.play();
    addScore(scoreGain);
    floatingTexts.push(new FloatingText(camera.mouseX, camera.mouseY, scoreGain, Koji.config.colors.scoreColor, objSize));
    spawnParticles(camera.mouseX, camera.mouseY, random(10, 15));
    //===
  }

  if (soundButton.checkClick()) {
    toggleSound();
    return;
  }
}

function touchEnded() {
  //===This is required to fix a problem where the music sometimes doesn't start on mobile
  if (soundEnabled) {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }

  touching = false;
}


//Keyboard input
/*
For non-ASCII keys, use the keyCode variable. You can check if the keyCode equals:

BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
*/

function keyPressed() {
  if (!gameOver) {
    //Ingame
    if (keyCode == UP_ARROW) {
      console.log("up")
    }
    if (keyCode == DOWN_ARROW) {
      console.log("down")
    }
    if (keyCode == LEFT_ARROW) {
      console.log("left")
    }
    if (keyCode == RIGHT_ARROW) {
      console.log("right")
    }

    if (keyCode == ESCAPE) {
      gameOver = true;
    }

    if (key == ' ') {
      console.log("Space");
      shakeTimer = 0.1;
    }

    if (key == 'p') {
      console.log("Pressed P key")
      submitScore();
    }

    if (key == 'e') {
      console.log("Pressed E key")

      spawnExplosion(camera.mouseX, camera.mouseY, 3);
    }
  }
}

//Same usage as keyPressed, but is called on key released instead
function keyReleased() {
  if (!gameOver) {

    //Return false here if you want to prevent arrow keys scrolling down the page while you're playing the game
    return false;
  }
}

//===Call this every time you want to start or reset the game
//This is a good place to clear all arrays like enemies, bullets etc before starting a new game
//It gets called when you press the PLAY button
function init() {
  gameOver = false;

  score = 0;
  lives = startingLives;

  //Clear out all arrays
  floatingTexts = [];


  //EXAMPLE
  spawnNodes();
  //===

}

//EXAMPLE
function spawnNodes() {
  let nodeCount = floor(random(80, 100));
  if (isMobile) {
    nodeCount = 30;
  }
  for (let i = 0; i < nodeCount; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let node = new Node(x, y);
    nodes.push(node);
    node.changeVelocity();
  }
}
//===

//Use this to add score and trigger animation
function addScore(amount) {
  score += amount;
  scoreAnimTimer = 0;
}

//===Call this when a lose life event should trigger
function loseLife() {

  lives--;
  if (lives <= 0) {
    gameOver = true;

    // Go to leaderboard submission
    if (score > 0) {
      submitScore();
    }

    if (sndMusic) {
      sndMusic.stop();
    }
  }
}