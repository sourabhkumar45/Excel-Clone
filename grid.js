"use strict";

const leftCol = document.querySelector(".left_col");
const topRow = document.querySelector(".top_row");
const grid = document.querySelector(".grid");
const address = document.querySelector(".address-input");
const bold = document.querySelector(".bold");
const italic = document.querySelector(".italic");
const underline = document.querySelector(".underline");
const font = document.querySelector(".font-family");
const alignBtn = document.querySelector(".align-container");
const fontSizeBtn = document.querySelector(".font-size");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const center = document.querySelector(".center");
address.value = "";
let sheetDB = [];
// prettier-ignore
const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let rows = 100;
let cols = 26;

for (let i = 1; i <= 100; i++) {
  let colBox = document.createElement("div");
  colBox.innerHTML = i;
  colBox.setAttribute("class", "box");
  leftCol.appendChild(colBox);
}

for (let i = 0; i < alphabet.length; i++) {
  let rowBox = document.createElement("div");
  rowBox.innerHTML = alphabet[i];
  rowBox.setAttribute("class", "cell");
  topRow.appendChild(rowBox);
}

for (let i = 0; i < rows; i++) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    //cell.innerHTML = `${String.fromCharCode(65 + j)}  ${i + 1}`;
    cell.innerHTML = "";
    cell.setAttribute("class", "cell");
    cell.setAttribute("rid", i + 1);
    cell.setAttribute("cid", `${String.fromCharCode(65 + j)}`);
    row.appendChild(cell);
  }
  grid.appendChild(row);
}

for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    let cell = {
      bold: "normal",
      italic: "normal",
      underline: "none",
      hAlign: "center",
      fontFamily: "sans-serif",
      fontSize: "16",
      color: "black",
      bColor: "none",
    };
    row.push(cell);
  }
  sheetDB.push(row);
}
function changeSheetDB(prop, value, i, j) {
  sheetDB[i][j][prop] = value;
}
grid.addEventListener("click", function (e) {
  let addr =
    e.target.attributes.cid.nodeValue + e.target.attributes.rid.nodeValue;
  address.value = addr;

  e.target.setAttribute("contenteditable", "true");
  let j = addr.charCodeAt(0) - 65;
  let i = Number(addr[1]);
  e.target.style.fontFamily = sheetDB[i - 1][j].fontFamily;
  font.value = sheetDB[i - 1][j].fontFamily;
  fontSizeBtn.value = sheetDB[i - 1][j].fontSize.split("px")[0];
  if (sheetDB[i - 1][j].hAlign == "left") {
    left.classList.add("active-btn");
    center.classList.remove("active-btn");
    right.classList.remove("active-btn");
  } else if (sheetDB[i - 1][j].hAlign == "center") {
    center.classList.add("active-btn");
    left.classList.remove("active-btn");
    right.classList.remove("active-btn");
  } else {
    right.classList.add("active-btn");
    left.classList.remove("active-btn");
    center.classList.remove("active-btn");
  }
  if (sheetDB[i - 1][j].bold == "bold") {
    bold.classList.add("active-btn");
  } else {
    bold.classList.remove("active-btn");
  }
  if (sheetDB[i - 1][j].italic == "italic") {
    italic.classList.add("active-btn");
  } else {
    italic.classList.remove("active-btn");
  }
  if (sheetDB[i - 1][j].underline == "underline") {
    underline.classList.add("active-btn");
  } else {
    underline.classList.remove("active-btn");
  }
});

bold.addEventListener("click", function (e) {
  let addr = address.value;

  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  if (!bold.classList.contains("active-btn")) {
    bold.classList.add("active-btn");
    cell.style.fontWeight = "bold";
    changeSheetDB("bold", "bold", i - 1, j);
  } else {
    bold.classList.remove("active-btn");
    cell.style.fontWeight = "normal";
    changeSheetDB("bold", "normal", i - 1, j);
  }
});

italic.addEventListener("click", function (e) {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  //cell.style.fontStyle = "italic";
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  if (!italic.classList.contains("active-btn")) {
    italic.classList.add("active-btn");
    cell.style.fontStyle = "italic";
    changeSheetDB("italic", "italic", i - 1, j);
  } else {
    italic.classList.remove("active-btn");
    cell.style.fontStyle = "normal";
    changeSheetDB("italic", "normal", i - 1, j);
  }
});

underline.addEventListener("click", function (e) {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  //cell.style.textDecoration = "underline";
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  if (!underline.classList.contains("active-btn")) {
    underline.classList.add("active-btn");
    cell.style.textDecoration = "underline";
    changeSheetDB("underline", "underline", i - 1, j);
  } else {
    underline.classList.remove("active-btn");
    cell.style.textDecoration = "none";
    changeSheetDB("underline", "none", i - 1, j);
  }
});

alignBtn.addEventListener("click", function (e) {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  if (e.target.classList.contains("left")) {
    if (!e.target.classList.contains("active-btn")) {
      cell.style.textAlign = "left";
      changeSheetDB("hAlign", "left", i - 1, j);
      e.target.classList.add("active-btn");
      right.classList.remove("active-btn");
      center.classList.remove("active-btn");
    } else {
      cell.style.textAlign = "center";
      changeSheetDB("hAlign", "center", i - 1, j);
      e.target.classList.remove("active-btn");
    }
  }
  if (e.target.classList.contains("right")) {
    if (!e.target.classList.contains("active-btn")) {
      cell.style.textAlign = "right";
      changeSheetDB("hAlign", "right", i - 1, j);
      e.target.classList.add("active-btn");
      left.classList.remove("active-btn");
      center.classList.remove("active-btn");
    } else {
      cell.style.textAlign = "center";
      changeSheetDB("hAlign", "center", i - 1, j);
      e.target.classList.add("active-btn");
      right.classList.remove("active-btn");
      left.classList.remove("active-btn");
    }
  }
  if (e.target.classList.contains("center")) {
    cell.style.textAlign = "center";
    changeSheetDB("hAlign", "center", i - 1, j);
  }
});

font.addEventListener("change", function () {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  cell.style.fontFamily = font.value;
  changeSheetDB("fontFamily", font.value, i - 1, j);
});

fontSizeBtn.addEventListener("change", function (e) {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  let j = addr[0].charCodeAt(0) - 65; // column
  let i = Number(addr[1]);
  cell.style.fontSize = fontSizeBtn.value + "px";
  changeSheetDB("fontSize", fontSizeBtn.value + "px", i - 1, j);
});
