"use strict";

let btnContainer = document.querySelector(".add-sheet_btn-container");
let sheetCont = document.querySelector(".sheet-container");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
firstSheet.addEventListener("click", handleSheet);

btnContainer.addEventListener("click", function () {
  let AllSheets = document.querySelectorAll(".sheet");
  let lastSheet = AllSheets[AllSheets.length - 1];
  let lastIdx = lastSheet.getAttribute("idx");
  lastIdx = Number(lastIdx);
  let newSheet = document.createElement("div");
  newSheet.setAttribute("class", "sheet");
  newSheet.setAttribute("idx", `${lastIdx + 1}`);
  newSheet.innerHTML = `Sheet ${lastIdx + 2}`;
  sheetList.appendChild(newSheet);

  for (let i = 0; i < AllSheets.length; i++) {
    AllSheets[i].classList.remove("active");
  }
  newSheet.classList.add("active");
  newSheet.addEventListener("click", handleSheet);
});

function handleSheet(e) {
  let sheet = e.currentTarget;
  let AllSheets = document.querySelectorAll(".sheet");
  for (let i = 0; i < AllSheets.length; i++) {
    AllSheets[i].classList.remove("active");
  }
  sheet.classList.add("active");
}
