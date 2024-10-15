let curPos, mousePos;
let brushType = 1, brushStroke = 1, vtnr = 100;
let img, img2, c;
let bgColor = { r: 76, g: 112, b: 255 };  // Initial background color

function preload() {
  img1 = loadImage('assets/1.jpg');
  img2 = loadImage('assets/2.jpg');
  img3 = loadImage('assets/3.jpg');
  img4 = loadImage('assets/4.jpg');
  img5 = loadImage('assets/5.jpg');
  img = img1;  // Default image
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Set the initial background color
  background(bgColor.r, bgColor.g, bgColor.b);

  curPos = createVector(0, 0);
  mousePos = createVector(0, 0);

  // Get UI elements from HTML using p5.js select()
  let rSlider = select('#rSlider');
  let gSlider = select('#gSlider');
  let bSlider = select('#bSlider');
  let setBgButton = select('#setBgButton');
  let brushSelect = select('#brushSelect');
  let strokeSlider = select('#strokeSlider');
  let vtnrSlider = select('#vtnrSlider');
  let imgSelect = select('#imgSelect');

  // Set background color when sliders are adjusted (auto-trigger "Set Background Color")
  rSlider.input(updateBackground);
  gSlider.input(updateBackground);
  bSlider.input(updateBackground);

  // Set background color when the button is clicked
  setBgButton.mousePressed(updateBackground);

  // Change brush type based on selection
  brushSelect.changed(() => {
    brushType = int(brushSelect.value());
  });

  // Change brush stroke based on slider input
  strokeSlider.input(() => {
    brushStroke = strokeSlider.value();
  });

  // Change vertex count for brush 1 based on slider input
  vtnrSlider.input(() => {
    vtnr = vtnrSlider.value();
  });

  // Change the image used for drawing
  imgSelect.changed(() => {
    let selectedImage = imgSelect.value();
    switch (selectedImage) {
      case '1':
        img = img1;
        break;
      case '2':
        img = img2;
        break;
      case '3':
        img = img3;
        break;
      case '4':
        img = img4;
        break;
      case '5':
        img = img5;
        break;
    }
  });
}

function draw() {
  // Drawing logic
  c = img.get(random(width), random(height));

  mousePos.set(mouseX, mouseY);
  let displacement = p5.Vector.sub(mousePos, curPos).mult(0.1);
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
      // case 3:
      //     Commented out Brush 3
      //     noisyShape2(curPos.x, curPos.y, 200, 10, magnitude, brushStroke);
      //     break;
    }
  }
}

// Update background color based on slider values
function updateBackground() {
  bgColor.r = select('#rSlider').value();
  bgColor.g = select('#gSlider').value();
  bgColor.b = select('#bSlider').value();
  background(bgColor.r, bgColor.g, bgColor.b);  // Update the background color live
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

// Brush 3: Commented Out
// function noisyShape2(ox, oy, vertNum, radius, noiseAmplitude) {
//   let angleStep = 360.0 / vertNum;

//   push();
//   translate(ox, oy);
//   stroke(0);
//   noFill();

//   beginShape();
//   for (let vn = 0; vn < vertNum; vn++) {
//     let vX = cos(radians(angleStep * vn));
//     let vY = sin(radians(angleStep * vn));
//     let noiseValue = noise(frameCount * 1 + vn);

//     vX += noiseValue * (vX * noiseAmplitude);
//     vY += noiseValue * (vY * noiseAmplitude);

//     vertex(vX * radius, vY * radius);
//   }
//   endShape(CLOSE);
//   pop();
// }
