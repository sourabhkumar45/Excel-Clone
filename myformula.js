"use strict";

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
// handles value changed by formula
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type == "characterData") {
      let { i, j } = generateAddress();
      sheetDB[i][j].value = mutation.target.parentElement.innerText;
      updateMyChildren(sheetDB[i][j]);
    }
  });
});
var config = { characterData: true, subtree: true };
observer.observe(grid, config);

grid.addEventListener("click", (e) => {
  e.target.addEventListener("blur", () => {
    let { i, j } = generateAddress();
    if (sheetDB[i][j].formula) {
      removeMeFromParent(sheetDB[i][j], address.value);
    }
    updateMyChildren(sheetDB[i][j]);
  });
});

formulaCont.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && formulaCont.value) {
    // evaluate and set DB and UI
    let currentFormula = formulaCont.value;
    let { i, j } = generateAddress();
    let cellObj = sheetDB[i][j];
    let value = evaluateFormula(currentFormula);
    cellObj.value = value;
    let cell = findUIElement();
    cell.innerText = value;
    cellObj.formula = currentFormula;
    console.log(cellObj);
    setMeAsChild(currentFormula, address.value);
  }
});

function evaluateFormula(currentFormula) {
  let tokens = currentFormula.split(" ");
  for (let k = 0; k < tokens.length; k++) {
    let code = tokens[k].charAt(0).charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let { i, j } = generateAddress(tokens[k].charAt(0), tokens[k].charAt(1));
      let value = sheetDB[i][j].value;
      tokens[k] = value;
    }
  }
  currentFormula = tokens.join(" ");
  return eval(currentFormula);
}
function findUIElement() {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  return cell;
}
formulaCont.addEventListener("blur", () => {
  let { i, j } = generateAddress();

  if (formulaCont.innerText == "" && sheetDB[i][j].formula) {
    let myAddress = address.value;
    // remove current cell from parentObj
    removeMeFromParent(sheetDB[i][j], myAddress);
  }
});

//removeMeFromParent removes the children from parents and set formula to nothing
function removeMeFromParent(cellObj, myAddress) {
  let formula = cellObj.formula;
  let formulaToken = formula.split(" ");
  for (let i = 0; i < formulaToken.length; i++) {
    let ascii = formulaToken[i].charAt(0);
    ascii = ascii.charCodeAt(0);

    if (ascii >= 65 && ascii <= 90) {
      let i1 = formulaToken[i].charCodeAt(0) - 65;
      let j = Number(formulaToken[i][1]);
      let parentObj = sheetDB[Number(j) - 1][i1];
      parentObj.children.delete(myAddress);
    }
  }
  cellObj.formula = "";
}
function setMeAsChild(currentFormula, myAddress) {
  let tokens = currentFormula.split(" ");
  for (let k = 0; k < tokens.length; k++) {
    let code = tokens[k].charAt(0).charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let { i, j } = generateAddress(tokens[k].charAt(0), tokens[k].charAt(1));
      let parent = sheetDB[i][j];
      parent.children.add(myAddress);
    }
  }
}
function updateMyChildren(cellObj) {
  let { children } = cellObj.children;
  for (let child in children) {
    console.log(child);
  }
}
