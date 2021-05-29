"use strict";
// case 1
// user enters the formula and based on the expression and value of cells the value is generated
// and set in the cell.
// case 2
// User changes the value of a parent cell so the change should be reflected in child cell
// E.g - C1 = A1+B1 change in value of B1 should be reflected back in C1.

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
    // user just click the cell but did not change the value
    if (cellObj.value == e.target.innerText) {
      return;
    }
    cellObj.value = e.target.innerText;

    updateMyChildren(cellObj);
  });
});

formulaCont.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && formulaCont.value) {
    let currentFormula = formulaCont.value;
    let value = evaluateFormula(currentFormula);
    setCellAndDB(value, currentFormula);
    setChildren(currentFormula, address.value);
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
function findUIElement(childAddress) {
  if (childAddress == undefined) {
    let addr = address.value;
    let cell = document.querySelector(
      `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
    );
    return cell;
  } else {
    let cell = document.querySelector(
      `.cell[cid='${childAddress.charAt(0)}'][rid='${childAddress.charAt(1)}']`
    );
    return cell;
  }
}

function setChildren(currentFormula, childAddress) {
  let tokens = currentFormula.split(" ");
  for (let k = 0; k < tokens.length; k++) {
    let code = tokens[k].charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let { i, j } = generateAddress(tokens[k].charAt(0), tokens[k].charAt(1));
      let parentObj = sheetDB[i][j];
      parentObj.children.add(childAddress);
    }
  }
}

function setCellAndDB(value, currentFormula, childAddress) {
  let cell;
  let addr = { i: 0, j: 0 };
  if (childAddress == undefined) {
    cell = findUIElement();
    addr = generateAddress();
  } else {
    cell = findUIElement(childAddress);
    addr = generateAddress(childAddress.charAt(0), childAddress.charAt(1));
  }
  cell.innerText = value;
  sheetDB[addr.i][addr.j].value = value;
  sheetDB[addr.i][addr.j].formula = currentFormula;
}

function updateMyChildren(cellObj) {
  let { children } = cellObj;
  for (let child of children) {
    let { i, j } = generateAddress(child.charAt(0), child.charAt(1));
    let childObj = sheetDB[i][j];
    let childFormula = childObj.formula;
    let newValue = evaluateFormula(childFormula);
    setCellAndDB(newValue, childFormula, child);
    updateMyChildren(childObj);
  }
}
