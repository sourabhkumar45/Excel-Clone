"use strict";
// case 1
// user enters the formula and based on the expression and value of cells the value is generated
//and set in the cell.

function generateAddress(cid, rid) {
  if (rid == undefined && cid == undefined) {
    let addr = address.value;
    let j = addr.charCodeAt(0) - 65;
    let i = Number(addr[1]);
    return { i: i - 1, j: j };
  } else {
    let j = cid.charCodeAt(0) - 65;
    let i = Number(rid);
    return { i: i - 1, j: j };
  }
}

grid.addEventListener("click", (e) => {
  e.target.addEventListener("blur", () => {
    let { i, j } = generateAddress();
    let cellObj = sheetDB[i][j];
    cellObj.value = e.target.innerText;
  });
});

formulaCont.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && formulaCont.value) {
    let currentFormula = formulaCont.value;
    let value = evaluateFormula(currentFormula);
    let cell = findUIElement();
    cell.value = value;
    cell.formula = currentFormula;
    cell.innerText = value;
  }
});

function evaluateFormula(currentFormula) {
  let tokens = currentFormula.split(" ");
  for (let k = 0; k < tokens.length; k++) {
    let code = tokens[k].charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let { i, j } = generateAddress(tokens[k].charAt(0), tokens[k].charAt(1));
      tokens[k] = sheetDB[i][j].value;
    }
  }
  currentFormula = tokens.join(" ");
  return eval(currentFormula);
}
// findUIElement returns the cell holding the current address.
function findUIElement() {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  return cell;
}
