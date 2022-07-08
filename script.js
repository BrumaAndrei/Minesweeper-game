let grid = document.querySelector(".grid");
const box = new Array(10);
let idBox = 0;
const randMines = new Set();
let redFlags = 10;
let gameActive = true;

for (let i = 0; i < box.length; i++) {
   box[i] = [];
}
document.getElementById("flags").innerHTML = "🚩 " + redFlags;
createBoard();

function createBoard() {
   chooseRandMines();
   for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
         let div = document.createElement("div");
         grid.appendChild(div);
         ++idBox;
         box[i][j] = idBox;
         div.setAttribute("id", idBox);
         div.setAttribute("checked", false);
         div.setAttribute("class", "box");
         clickDiv(div, idBox, i, j);
      }
   }
}

function clickDiv(div, idBox, i, j) {
   div.addEventListener("mousedown", function (key) {
      document.addEventListener('contextmenu', key => {
         key.preventDefault();
      });
      if (key.which === 1 || key.button === 0) {
         if (document.getElementById(idBox).getAttribute("checked") == "false" && randMines.has(idBox) && gameActive == true) {
            detonatesMines();
         } else if (gameActive == true) {
            nrMinesAround(i, j, idBox);
         }
         document.getElementById("flags").innerHTML = "🚩 " + redFlags;
      }
      if (key.which === 3 || key.button === 2) {

            if (document.getElementById(idBox).value == '🚩'  && gameActive == true) {
               removeFlags(idBox);
            } else if (document.getElementById(idBox).getAttribute("checked") == "false" && redFlags > 0 && gameActive == true) {
               placeFlags(idBox);
            }
         document.getElementById("flags").innerHTML = "🚩 " + redFlags;
      }
   });
}

function placeFlags(idBox) {
   document.getElementById(idBox).innerHTML = "🚩";
   document.getElementById(idBox).value = '🚩';
   document.getElementById(idBox).setAttribute("checked", true);
   --redFlags;
}

function removeFlags(idBox) {
   document.getElementById(idBox).innerHTML = "";
   document.getElementById(idBox).value = '';
   document.getElementById(idBox).setAttribute("checked", false);
   ++redFlags;
}

function chooseRandMines() {
   while (randMines.size < 10) {
      let rndNr = Math.floor(Math.random() * 100) + 1;
      randMines.add(rndNr);
   }
}

function detonatesMines() {
   gameActive = false;
   for (let i = 1; i < 101; ++i) {
      if (randMines.has(i)) {
         document.getElementById(i).innerHTML = "💣";
         document.getElementById(i).style.background = '#FF6666';
      }
   }
   document.getElementById("alert").innerHTML = "You Lost!";
}

function nrMinesAround(i, j, idBox) {
   let minesCounting = 0;
   let id = 0;
   for (let r = -1; r < 2; ++r) {
      for (let c = -1; c < 2; ++c) {
         if (i === 0 && j === 0) {
            continue;
         }
         if (i + r >= 0 && j + c >= 0 && i + r <= 9 && j + c <= 9) {
            id = box[i + r][j + c];
            if (randMines.has(id)) {
               ++minesCounting;
            }
         }
      }
   }
   if (document.getElementById(idBox).getAttribute("checked") == "false" && minesCounting > 0) {
      document.getElementById(idBox).innerHTML = minesCounting;
      document.getElementById(idBox).style.background = '#BEBEBE';
      document.getElementById(idBox).setAttribute("checked", true);
   } else if (document.getElementById(idBox).getAttribute("checked") == "false" && minesCounting == 0) {
      document.getElementById(idBox).setAttribute("checked", true);
      document.getElementById(idBox).style.background = '#BEBEBE';
      uncoverEmptyBoxes(i, j);
   }
   checkCompleteGame();
}

function uncoverEmptyBoxes(i, j) {
   let id = 0;
   for (let r = -1; r < 2; ++r) {
      for (let c = -1; c < 2; ++c) {
         if (i === 0 && j === 0) {
            continue;
         }
         if (i + r >= 0 && j + c >= 0 && i + r <= 9 && j + c <= 9) {
            id = box[i + r][j + c];
            if (document.getElementById(id).value == '🚩') {
               removeFlags(id);
            }
            nrMinesAround(i + r, j + c, id)
         }
      }
   }
}

function checkCompleteGame() {
   let completeLevel = true;
   for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
         let div = box[i][j];
         let clicked = document.getElementById(div).getAttribute("checked");
         let val = document.getElementById(idBox).value;
         if ((gameActive == true && clicked == "false" && !randMines.has(div)) || val == '🚩') {
            completeLevel = false;
         }
      }
   }
   if (completeLevel == true) {
      document.getElementById("alert").innerHTML = "You Win!";
      gameActive = false;
   }
}