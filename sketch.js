let curPos, mousePos;
let brushType = 1, brushStroke = 1, vtnr = 100;
let colorArray = [];  // To store precomputed colors
let currentColor, nextColor;
let frameCounter = 0;
let changeInterval = 2;
let jsonData; // Store JSON data
let bgColor = { r: 76, g: 112, b: 255 };  // Initial background color
let opacity = 255;  // Default opacity
let lerpAmt = 0;
let blendedColor;
let gradientEnabled = false;  // Gradient toggle state

function preload() {
  jsonData = loadJSON('colors.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor.r, bgColor.g, bgColor.b);

  let opacitySlider = select('#opacitySlider');
  opacitySlider.input(() => {
    opacity = opacitySlider.value();
  });

  colorArray = jsonData.img1;
  currentColor = random(colorArray);
  nextColor = random(colorArray);

  curPos = createVector(0, 0);
  mousePos = createVector(0, 0);

  // UI elements setup (similar as before)
  let rSlider = select('#rSlider');
  let gSlider = select('#gSlider');
  let bSlider = select('#bSlider');
  let setBgButton = select('#setBgButton');
  let brushSelect = select('#brushSelect');
  let strokeSlider = select('#strokeSlider');
  let vtnrSlider = select('#vtnrSlider');
  let imgSelect = select('#imgSelect');
  let intervalSlider = select('#intervalSlider');
  let gradientToggle = select('#gradientToggle');  // Gradient toggle

  rSlider.input(updateBackground);
  gSlider.input(updateBackground);
  bSlider.input(updateBackground);
  setBgButton.mousePressed(updateBackground);

  let saveButton = select('#saveButton');
  saveButton.mousePressed(() => {
    save('my-drawing.jpg');
  });

  intervalSlider.input(() => {
    changeInterval = intervalSlider.value();
  });

  brushSelect.changed(() => {
    brushType = int(brushSelect.value());
  });

  strokeSlider.input(() => {
    brushStroke = strokeSlider.value();
  });

  vtnrSlider.input(() => {
    vtnr = vtnrSlider.value();
  });

  imgSelect.changed(() => {
    let selectedImage = imgSelect.value();
    switch (selectedImage) {
      case '1':
        colorArray = jsonData.img1;
        break;
      case '2':
        colorArray = jsonData.img2;
        break;
      case '3':
        colorArray = jsonData.img3;
        break;
      case '4':
        colorArray = jsonData.img4;
        break;
      case '5':
        colorArray = jsonData.img5;
        break;
    }
    currentColor = random(colorArray);
    nextColor = random(colorArray);
  });

  gradientToggle.changed(() => {
    gradientEnabled = gradientToggle.checked();
  });
}

function draw() {
  frameCounter++;

  if (gradientEnabled) {
    lerpAmt = frameCounter / changeInterval;
    blendedColor = lerpColor(
      color(currentColor[0], currentColor[1], currentColor[2], opacity),
      color(nextColor[0], nextColor[1], nextColor[2], opacity),
      lerpAmt
    );
  } else {
    blendedColor = color(currentColor[0], currentColor[1], currentColor[2], opacity);
  }

  if (frameCounter >= changeInterval) {
    currentColor = nextColor;
    nextColor = random(colorArray);
    frameCounter = 0;
  }

  mousePos.set(mouseX, mouseY);
  let displacement = p5.Vector.sub(mousePos, curPos).mult(0.1);
  let magnitude = displacement.mag();
  curPos.add(displacement);

  if (mouseIsPressed && !isMouseOverUI()) {
    switch (brushType) {
      case 1:
        noisyShape(curPos.x, curPos.y, vtnr, 10, magnitude, brushStroke);
        break;
      case 2:
        drawANoisyLine(mouseX, mouseY, 90, brushStroke);
        break;
    }
  }
}

function updateBackground() {
  bgColor.r = select('#rSlider').value();
  bgColor.g = select('#gSlider').value();
  bgColor.b = select('#bSlider').value();
  background(bgColor.r, bgColor.g, bgColor.b);
}

function noisyShape(ox, oy, vertNum, radius, noiseAmplitude, strokeWeight) {
  let angleStep = 360.0 / vertNum;
  push();
  translate(ox, oy);
  noStroke();
  fill(blendedColor);

  beginShape();
  for (let vn = 0; vn < vertNum; vn++) {
    let vX = cos(radians(angleStep * vn));
    let vY = sin(radians(angleStep * vn));
    let noiseValue = noise(frameCount * 10 + vn);
    vX += noiseValue * (vX * noiseAmplitude);
    vY += noiseValue * (vY * noiseAmplitude);
    vertex(vX * radius, vY * radius);
  }
  endShape(CLOSE);
  pop();
}

function drawANoisyLine(mx, my, amplitude, st) {
  push();
  translate(mx, my);
  stroke(0);
  strokeWeight(st);

  let noiseValueX = noise(frameCount * 0.02);
  let noiseValueY = noise(frameCount * 0.01 + 100);
  let xRange = map(noiseValueX, 0, 1, -amplitude, amplitude);
  let yRange = map(noiseValueY, 0, 1, -amplitude, amplitude);

  line(-xRange, -yRange, xRange * 20, yRange * 2);
  pop();
}

function isMouseOverUI() {
  return document.querySelector('#controls').contains(document.elementFromPoint(mouseX, mouseY));
}
