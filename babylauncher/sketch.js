let babyimg;

function preload() {
  // local file (in data/" directory of this sketch)
  let filename = "data/babyrates.csv";
  babyimg = loadImage('data/baby.svg');

  // remember, always good to print out some information about the
  // data you loaded to help diagnose problems
  print(`Loading '${filename}'...`);
  table = loadTable(filename, "csv", "header", function () {
    print(
      `  loaded ${table.getRowCount()} rows in ${table.getColumnCount()} columns`
    );
  });
}

let countries = []
let gdps = []
let birthrates = []
let probabilityVector = [];
let agents = [];
let agentID = 0;
maxGDP = 0;

let dropSpeed = 0;

function setup() {

  createCanvas(1200, 800)
  // simple HTML textarea debug window
  createDebugWindow();
  print(table)
  for (let i = 0; i < table.rows.length; i++) {
    if (table.rows[i].arr[0] != "") {
      let curCountry = table.rows[i].arr[0];
      let curGDP = table.rows[i].arr[1];
      let curBirthRate = table.rows[i].arr[2];
      // print(curCountry, curGDP, curBirthRate)
      countries.push(curCountry)
      gdps.push(curGDP)
      birthrates.push(curBirthRate)
      if (curGDP > maxGDP) {
        maxGDP = curGDP;
      }
      
      let probFactor = int(curBirthRate*10);
      for (let j = 0; j < probFactor; j++) {
        probabilityVector.push(curCountry);
      }
    }
  }

  // just so you don't think this is broken
  background(240);
  // fill(0);
  // textAlign(CENTER, CENTER);
  // text("empty\ncanvas", width / 2, height / 2);
}

function draw() {
  background(240);
  dropSpeed ++;

  if (dropSpeed % 2==0) {
    let curCountry = "";
    while (curCountry == "") {
      let index = int(random(0, probabilityVector.length-1));
      curCountry = probabilityVector[index];
      // print(index, probabilityVector)
    }
    // print(curCountry)
    let valueIndex = countries.indexOf(curCountry);
    // print(valueIndex)
    let curGDP = float(gdps[valueIndex]);

    let xPos = map(curGDP, 0, maxGDP, 0, width);
    if (xPos > 0 && curGDP != 2021) {
      agents.push(new Agent(xPos, agentID++));
    }
  }

  for (let i = 0; i < agents.length; i++) {
    agents[i].update();
  }

  for (let i = 0; i < agents.length; i++) {
    agents[i].draw();
  }
  fill(192, 180, 219);
  noStroke();
  rect(0, height-65, width, 65);

  // print(probabilityVector;

}