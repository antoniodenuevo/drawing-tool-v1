let averagingAmt = 0.1;
let curPos, mousePos;
let brushType = 1, brushStroke = 1, vtnr = 100;
let img, img2, c;

// UI elements
let brushSelect, strokeSlider, vtnrSlider, imgSelect, bgButton;
let uiElements = [];

// RGB Sliders
let rSlider, gSlider, bSlider;
let bgColor = { r: 224, g: 5, b: 0 };  // Initial background color (e40500)

function preload() {
  img1 = loadImage('assets/1.jpg');
  img2 = loadImage('assets/2.jpg');
  img3 = loadImage('assets/3.jpg');
  img4 = loadImage('assets/4.jpg');
  img5 = loadImage('assets/4.jpg');
  img = img2;  // Default image
}

function setup() {
  smooth(200);
  createCanvas(windowWidth, windowHeight);

  // Set the initial background color
  background(bgColor.r, bgColor.g, bgColor.b);

  curPos = createVector(0, 0);
  mousePos = createVector(0, 0);

  // Create UI elements
  createP('Brush Type:').position(10, 10);
  brushSelect = createSelect().position(100, 10);
  brushSelect.option('Brush 1 (Noisy Shape)', 1);
  brushSelect.option('Brush 2 (Noisy Line)', 2);
  brushSelect.option('Brush 3 (Growing Shape)', 3);
  brushSelect.changed(changeBrushType);
  uiElements.push(brushSelect);

  createP('Brush Stroke:').position(10, 50);
  strokeSlider = createSlider(1, 10, 1, 1).position(100, 50); // Set to a range from 1 to 10
  strokeSlider.input(changeBrushStroke);
  uiElements.push(strokeSlider);

  createP('Vertex Count (Brush 1):').position(10, 90);
  vtnrSlider = createSlider(100, 2000, 100, 100).position(150, 90);
  vtnrSlider.input(changeVtnr);
  uiElements.push(vtnrSlider);

  createP('Select Image:').position(10, 130);
  imgSelect = createSelect().position(100, 130);
  imgSelect.option('Image 1', 1);
  imgSelect.option('Image 2', 2);
  imgSelect.option('Image 3', 3);
  imgSelect.option('Image 4', 4);
  imgSelect.option('Image 5', 5);
  imgSelect.changed(changeImage);
  uiElements.push(imgSelect);

  createP('Background Color:').position(10, 170);
  rSlider = createSlider(0, 255, bgColor.r).position(150, 170);
  gSlider = createSlider(0, 255, bgColor.g).position(150, 190);
  bSlider = createSlider(0, 255, bgColor.b).position(150, 210);
  rSlider.input(updateBackground);  // Automatically update background when slider is adjusted
  gSlider.input(updateBackground);  // Automatically update background when slider is adjusted
  bSlider.input(updateBackground);  // Automatically update background when slider is adjusted
  uiElements.push(rSlider);
  uiElements.push(gSlider);
  uiElements.push(bSlider);
}

function draw() {
  // Check if the mouse is interacting with any UI element
  if (mouseIsOverUI()) return;

  c = img.get(random(width), random(height));

  mousePos.set(mouseX, mouseY);
  let displacement = p5.Vector.sub(mousePos, curPos).mult(averagingAmt);
  let magnitude = displacement.mag();

  curPos.add(displacement);

  if (mouseIsPressed) {
    switch (brushType) {
      case 1:
        noisyShape(curPos.x, curPos.y, vtnr, 10, magnitude, brushStroke);
        break;
      case 2:
        drawANoisyLine(mouseX, mouseY, 90, brushStroke);
        break;
      case 3:
        noisyShape2(curPos.x, curPos.y, 200, 10, magnitude, brushStroke);
        break;
    }
  }
}

// Event listener functions for UI elements
function changeBrushType() {
  brushType = int(brushSelect.value());
}

function changeBrushStroke() {
  brushStroke = strokeSlider.value();
}

function changeVtnr() {
  vtnr = vtnrSlider.value();
}

function changeImage() {
  let selectedImage = int(imgSelect.value());
  switch (selectedImage) {
    case 1:
      img = img1;
      break;
    case 2:
      img = img2;
      break;
    case 3:
      img = img3;
      break;
    case 4:
      img = img4;
      break;
    case 5:
      img = img5;
      break;
  }
}

// Update background color when sliders are adjusted
function updateBackground() {
  bgColor.r = rSlider.value();
  bgColor.g = gSlider.value();
  bgColor.b = bSlider.value();
  background(bgColor.r, bgColor.g, bgColor.b);  // Update the background color live
}

// Helper function to detect if the mouse is over any UI element
function mouseIsOverUI() {
  for (let el of uiElements) {
    let x = el.position().x;
    let y = el.position().y;
    let w = el.size().width;
    let h = el.size().height;

    // Check if the mouse is within the bounds of the UI element
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      return true;  // If the mouse is over any element, stop drawing
    }
  }
  return false;
}

// Brush 1: Noisy Shape
function noisyShape(ox, oy, vertNum, radius, noiseAmplitude, strokeWeight) {
  let angleStep = 360.0 / vertNum;

  push();
  translate(ox, oy);
  noStroke();
  fill(c);

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

// Brush 2: Noisy Line
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

// Brush 3: Growing Shape
function noisyShape2(ox, oy, vertNum, radius, noiseAmplitude) {
  let angleStep = 360.0 / vertNum;

  push();
  translate(ox, oy);
  stroke(0);
  noFill();

  beginShape();
  for (let vn = 0; vn < vertNum; vn++) {
    let vX = cos(radians(angleStep * vn));
    let vY = sin(radians(angleStep * vn));
    let noiseValue = noise(frameCount * 1 + vn);

    vX += noiseValue * (vX * noiseAmplitude);
    vY += noiseValue * (vY * noiseAmplitude);

    vertex(vX * radius, vY * radius);
  }
  endShape(CLOSE);
  pop();
}
