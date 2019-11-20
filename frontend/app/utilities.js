
//===UTILITIES

function drawMainMenu() {

  drawTitle();
  drawInstructions();


  playButton.update();
  leaderboardButton.update();


}

function drawTitle() {
  //===Draw title
  let titleText = Koji.config.strings.title;
  let titleSize = floor(objSize * 2);
  textSize(titleSize);

  //Resize title until it fits the screen
  while (textWidth(titleText) > width * 0.9) {
    titleSize *= 0.9;
    textSize(titleSize);
  }

  fill(Koji.config.colors.titleColor);
  textAlign(CENTER, TOP);
  text(Koji.config.strings.title, width / 2, objSize * 1.5);
}

function drawInstructions() {
  //===Draw instructions
  let instructionsText = [];
  instructionsText[0] = Koji.config.strings.instructions1;
  instructionsText[1] = Koji.config.strings.instructions2;
  instructionsText[2] = Koji.config.strings.instructions3;

  let instructionsSize = [];

  for (let i = 0; i < instructionsText.length; i++) {
    instructionsSize[i] = floor(objSize * 0.75);
    textSize(instructionsSize[i]);

    //Resize text until it fits the screen
    while (textWidth(instructionsText[i]) > width * 0.9) {
      instructionsSize[i] *= 0.9;
      textSize(instructionsSize[i]);
    }
  }

  textSize(instructionsSize[0]);
  fill(Koji.config.colors.instructionsColor);
  textAlign(CENTER, TOP);
  text(instructionsText[0], width / 2, objSize * 5);

  textSize(instructionsSize[1]);
  fill(Koji.config.colors.instructionsColor);
  textAlign(CENTER, TOP);
  text(instructionsText[1], width / 2, objSize * 7);

  textSize(instructionsSize[2]);
  fill(Koji.config.colors.instructionsColor);
  textAlign(CENTER, TOP);
  text(instructionsText[2], width / 2, objSize * 9);
}

function playMusic() {
  if (sndMusic) {
    sndMusic.setVolume(Koji.config.sounds.musicVolume);
    sndMusic.setLoop(true);
    sndMusic.play();
  }
}

function disableSound() {
  getAudioContext().suspend();

  soundEnabled = false;
}

function enableSound() {
  soundEnabled = true;
  getAudioContext().resume();
}

//Call this function on sound button click
function toggleSound() {
  if (canMute) {

    canMute = false;

    if (soundEnabled) {
      disableSound();
    } else {
      enableSound();
    }

    //A timeout is required to prevent double registering of touch input on mobile
    setTimeout(() => {
      canMute = true;
    }, 100);
  }
}



function shakeCamera(duration) {
    shakeTimer = duration;

}

function doCameraShake() {
  let shakeIntensity = 4;

  let x = random(-shakeIntensity, shakeIntensity);
  let y = random(-shakeIntensity, shakeIntensity);

  camera.position.x += x;
  camera.position.y += y;

}

//===Basic Sound button with an on/off function
class SoundButton {

  constructor() {
    this.pos = createVector(0, 0);
    this.sizeMod = 1;
  }

  render() {
    this.pos.x = width - objSize * this.sizeMod * 1.5;
    this.pos.y = height - objSize * this.sizeMod * 1.5;

    let img;
    if (soundEnabled) {
      img = soundImage;
    } else {
      img = muteImage;
    }

    image(img, this.pos.x, this.pos.y, this.sizeMod * objSize, this.sizeMod * objSize); //draw
  }

  checkClick() {
    if (mouseX >= this.pos.x &&
      mouseX <= this.pos.x + this.sizeMod * objSize &&
      mouseY >= this.pos.y &&
      mouseY <= this.pos.y + this.sizeMod * objSize) {
      return true;
    } else {
      return false;
    }
  }
}

class PlayButton {
  constructor() {
    this.btn = new Clickable();
    this.btn.textSize = floor(objSize * 0.9);
    this.btn.text = Koji.config.strings.playButtonText;
    this.btn.textColor = Koji.config.colors.buttonTextColor;

    this.size = createVector(this.btn.textWidth, this.btn.textSize);
    this.pos = createVector(width / 2 - this.size.x / 2, height / 2 - this.size.y / 2 + objSize * 2);

    if (this.size.y > width) {
      this.size.y = width;
    }

    this.btn.resize(this.size.x, this.size.y);

    this.btn.strokeWeight = 0;

    this.btn.onHover = function () {
      this.color = Koji.config.colors.buttonHoverColor;
    }
    this.btn.onOutside = function () {
      this.color = Koji.config.colors.buttonColor;
    }
    this.btn.onPress = function () {
      this.color = Koji.config.colors.buttonClickColor;
    }
    this.btn.onRelease = function () {
      init();
    }
  }

  update() {

    //Resize button to fit text
    this.btn.textSize = floor(objSize * 0.9);
    this.size = createVector(this.btn.textWidth * 1.5, this.btn.textSize * 3);

    if (this.size.y > width) {
      this.size.y = width;
    }
    this.btn.resize(this.size.x, this.size.y);

    this.pos.x = width / 2 - this.size.x / 2;
    this.pos.y = height / 2 - this.size.y / 2 + objSize * 2;
    this.btn.locate(this.pos.x, this.pos.y);

    this.btn.draw();
  }
}


class LeaderboardButton {
  constructor() {
    this.btn = new Clickable();
    this.btn.textSize = floor(objSize * 0.9);
    this.btn.text = Koji.config.strings.leaderboardButtonText;
    this.btn.textColor = Koji.config.colors.buttonTextColor;

    this.size = createVector(this.btn.textWidth, this.btn.textSize);
    this.pos = createVector(width / 2 - this.size.x / 2, height - this.size.y / 2 - objSize * 2);

    if (this.size.y > width) {
      this.size.y = width;
    }

    this.btn.resize(this.size.x, this.size.y);

    this.btn.strokeWeight = 0;


    this.btn.onHover = function () {
      this.color = Koji.config.colors.buttonHoverColor;
    }
    this.btn.onOutside = function () {
      this.color = Koji.config.colors.buttonColor;
    }
    this.btn.onPress = function () {
      this.color = Koji.config.colors.buttonClickColor;
    }
    this.btn.onRelease = function () {
      window.setAppView("leaderboard");
    }
  }

  update() {

    //Resize button to fit text
    this.btn.textSize = floor(objSize * 0.9);
    this.size = createVector(this.btn.textWidth * 1.5, this.btn.textSize * 3);

    if (this.size.y > width) {
      this.size.y = width;
    }
    this.btn.resize(this.size.x, this.size.y);

    this.pos.x = width / 2 - this.size.x / 2;
    this.pos.y = height - this.size.y / 2 - objSize * 4;
    this.btn.locate(this.pos.x, this.pos.y);

    this.btn.draw();
  }
}

/*
    Basic smoothing function
    v = ((v * (N - 1)) + w) / N; 

    v - current value
    w - goal value
    The higher the factor, the slower v approaches w.
    
    Example usage (called in every frame):
    myValue = Smooth(myValue, goalValue, 4);
*/
function Smooth(current, goal, factor) {
  return ((current * (factor - 1)) + goal) / factor;
}


//===Isolate the font name from the font link provided in game settings
function getFontFamily(ff) {
  const start = ff.indexOf('family=');
  if (start === -1) return 'sans-serif';
  let end = ff.indexOf('&', start);
  if (end === -1) end = undefined;
  return ff.slice(start + 7, end);
}

//Returns true if the user is on mobile
function detectMobile() {
  var check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

// Go to leaderboard submission
function submitScore() {

  //Pass the score which we'll use for the leaderboard submission
  window.setScore(score);

  //Change app view to the form
  window.setAppView('setScore');

}