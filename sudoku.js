"use strict";
// DOM Variables
const newBtn = document.querySelector(".btn--new");
const eraseBtn = document.querySelector(".btn--erase");
const numBtns = document.querySelectorAll(".btn--num");
const gameZone = document.querySelector(".game-zone");
let subCells = document.querySelectorAll(".sub-cell");
const RANDOM_LIMIT = 16;

// Logic Variables
let activeSubIdx;

const cellDependentIndexes = {
  0: [
    [1, 2],
    [3, 6],
  ],
  1: [
    [0, 2],
    [4, 7],
  ],
  2: [
    [0, 1],
    [5, 8],
  ],
  3: [
    [4, 5],
    [0, 6],
  ],
  4: [
    [3, 5],
    [1, 7],
  ],
  5: [
    [3, 4],
    [2, 8],
  ],
  6: [
    [7, 8],
    [0, 3],
  ],
  7: [
    [6, 8],
    [1, 4],
  ],
  8: [
    [6, 7],
    [2, 5],
  ],
};
const rowSubDependentIndexes = {
  0: [1, 0, 2],
  1: [0, 1, 2],
  2: [0, 2, 1],
  3: [4, 3, 5],
  4: [3, 4, 5],
  5: [3, 5, 4],
  6: [7, 6, 8],
  7: [6, 7, 8],
  8: [6, 8, 7],
};
const columnSubDependentIndexes = {
  0: [3, 0, 6],
  1: [4, 1, 7],
  2: [5, 2, 8],
  3: [0, 3, 6],
  4: [1, 4, 7],
  5: [2, 5, 8],
  6: [0, 6, 3],
  7: [1, 7, 4],
  8: [2, 8, 5],
};
const board = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
  [54, 55, 56, 57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68, 69, 70, 71],
  [72, 73, 74, 75, 76, 77, 78, 79, 80],
];

newBtn.addEventListener("click", onNew);

// LOGIC functions---------------------------
function onNew() {
  subCells.forEach((sub) => (sub.innerHTML = ""));
  renderRandomSubs();
}

function generateNum(maxNum, distance = 0) {
  return Math.floor(Math.random() * maxNum) + distance;
}

function handleSelect(element, cellIdx, subIdx) {
  const selectIdx = subIdx + 9 * cellIdx;
  toggleActive(element, selectIdx);

  // remove active class all sub elements
  subCells.forEach((sub) => sub.classList.remove("shadow"));

  const subIdxsOfCell = board[cellIdx]; // [1,2,3]
  const rowSubIdxs = getRowSubIdxs(cellIdx, subIdx);
  const columnSubIdxs = getColumnSubIdxs(cellIdx, subIdx);
  const allSubIdxs = [...subIdxsOfCell, ...rowSubIdxs, ...columnSubIdxs];

  addActive(allSubIdxs);
}
// LOGIC functions------------------------------

// UI functions---------------------------------

function renderCells() {
  let resultCells = "";
  for (let cell = 0; cell < 9; cell++) {
    resultCells += "<div class='cell'>";
    for (let sub = 0; sub < 9; sub++)
      resultCells += `<div class='sub-cell' onclick='handleSelect(this,${cell},${sub})'></div>`;
    resultCells += "</div>";
  }

  gameZone.innerHTML = resultCells;
  subCells = document.querySelectorAll(".sub-cell");

  renderRandomSubs();
}

function renderRandomSubs() {
  let counter = 0;
  while (true) {
    const ranIdx = generateNum(81);
    const ranValue = generateNum(9, 1);
    if (subCells[ranIdx].innerHTML === "") {
      subCells[ranIdx].innerHTML = ranValue;
      subCells[ranIdx].style.pointerEvents = "none";
      subCells[ranIdx].classList.add("randomly");
      counter++;
      if (RANDOM_LIMIT === counter) break;
    }
  }
}

function getRowSubIdxs(row, column) {
  const cellIdxs = cellDependentIndexes[row][0];
  const subIdxs = rowSubDependentIndexes[column];
  const idxs = [];

  for (let cellIdx of cellIdxs)
    for (let subIdx of subIdxs) idxs.push(board[cellIdx][subIdx]);
  return idxs;
}

function getColumnSubIdxs(row, column) {
  const cellIdxs = cellDependentIndexes[row][1];
  const subIdxs = columnSubDependentIndexes[column];
  const idxs = [];

  for (let cellIdx of cellIdxs)
    for (let subIdx of subIdxs) idxs.push(board[cellIdx][subIdx]);
  return idxs;
}

function addActive(subIdxs) {
  for (let subIdx of subIdxs) {
    subCells[subIdx].classList.add("shadow");
  }
}

function toggleActive(newElement, newIdx) {
  if (activeSubIdx) subCells[activeSubIdx].classList.remove("active");
  if (newElement) newElement.classList.add("active");
  activeSubIdx = newIdx;
}

function toggleKey(key) {
  if (key !== "Backspace" && subCells[activeSubIdx].innerHTML !== `${key}`)
    subCells[activeSubIdx].innerHTML = key;
  else subCells[activeSubIdx].innerHTML = "";
}

document.addEventListener("keydown", (e) => {
  if (activeSubIdx >= 0) {
    switch (e.key) {
      case "Enter":
        return toggleActive();
      case "Backspace":
        return toggleKey(e.key);
      default:
        if (e.key !== "0" && e.code.startsWith("Digit")) toggleKey(e.key);
    }
  }
});

// erase btn
eraseBtn.addEventListener("click", () => {
  subCells[activeSubIdx].innerHTML = "";
});

// Add Numbers
function addBoardNums() {
  for (let i = 0; i < numBtns.length; i++) {
    numBtns[i].addEventListener("click", () => subCells[activeSubIdx].innerText = i + 1);
  }
}

addBoardNums();

renderCells();

// UI functions---------------------------------

// Sudoku Plans
// #1 -> randomSubCells (Muhammadumar) 👍🏻
// #2 -> onNew bosilganda loyihani noldan boshalsh kerak(Inomjon) 👍🏻
// #3 -> biz kiritgan xar bir subCell ajralib turishi kerak(Avazbek) 👍🏻
// #4 -> cellRender function yaratishimiz kerak(Abdulxoliq) 👍🏻
// #6 -> randomSubCell takroriy index da bolmasligi kerak(Husniddinbek) 👍🏻
// #7 -> keyboard event larni qoshish(Muhiddin) 👍🏻
// #8 -> select qilingan elementga active class ni qoshish(Muhammaddiyor K) 👍🏻
// #9 -> oldin yozilgan element ustiga takroran yozish(Muhammaddiyor) 👍🏻
// #10 -> Bosilganni index ni topib olish(Hasanboy) 👍🏻
// #12 -> subCell boshqa tanlanganda oldingi tanlangan subCell dan "active" classni remove qilish(Muhammaddiyor) 👍🏻
// #13 -> Enter bosilganda active subCell ni "active" class ni remove qilish(Muhammadumar) 👍🏻
// #14 -> Backspace keyboardEvent ni ishlatish(Inomjonbek) 👍🏻
// #15 -> Kiritlgan qiymat doimo bitta belgi va raqam bolishi kerak, add validation function (Muhammaddiyor) 👍🏻
// #16 -> Keyboard dan "0" kiritmasligini tekshirish(Inomjonbek) 👍🏻
// #17 -> Oldin qiymat kiritlgan subCellga kiritilgan yangi qiymat eskisi bilan bir xil bolsa, ushbu subCell ni empty ga aylantirsin 👍🏻
// #11 -> numBtns lardan foydalanish(Samandar) 👍
// #5 -> onErase boganda tanlangan subCell remove bolishi kerak(Murtozxon) 👍
// #19 -> randomSubCell larni ozgartirib bomasin(Rahmonbek) -> 👍
// #20 -> Barchasiga shadown operation ni qoshish 👍
// #18 -> checkFilled function qoshish(Muhammadumar)
// #21 -> Sub dan tashqariga bosilsa sub ning active ni ochirish
