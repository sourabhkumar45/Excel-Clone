//let allCells = document.querySelectorAll(".grid .cell");

grid.addEventListener("click", (e) => {
  e.target.addEventListener("blur", (e1) => {
    let addr =
      e.target.attributes.cid.nodeValue + e.target.attributes.rid.nodeValue;
    let j = addr.charCodeAt(0) - 65;
    let i = Number(addr[1]);
    //console.log(i - 1, j);

    let cellObj = sheetDB[i - 1][j];
    if (cellObj.value == e.target.innerText) {
      return;
    }
    if (cellObj.formula) {
      removeFormula(cellObj, addr);
    }
    sheetDB[i - 1][j].value = e.target.innerText;

    updateChildren(cellObj);
    //console.log(sheetDB[i - 1][j].value);
  });
});
formulaCont.addEventListener("keydown", (e) => {
  if (formulaCont.value == "") {
    let addr = address.value;
    let j = addr.charCodeAt(0) - 65;
    let i = Number(addr[1]);
    sheetDB[i - 1][j].formula = "";
    return;
  }
  if (e.key == "Enter" && formulaCont.value) {
    let cFormula = formulaCont.value;
    let addr = address.value;
    let j = addr.charCodeAt(0) - 65;
    let i = Number(addr[1]);
    let cellObj = sheetDB[i - 1][j];
    if (cellObj.formula != cFormula) {
      removeFormula(cellObj, addr);
    }
    let value = evaluateFormula(cFormula);
    let childAddress = address.value;
    setCell(value, cFormula);
    setChildrenArray(cFormula, childAddress);
  }
});

function evaluateFormula(formula) {
  let formulaToken = formula.split(" ");
  for (let i = 0; i < formulaToken.length; i++) {
    let ascii = formulaToken[i].charAt(0);
    ascii = ascii.charCodeAt(0);

    if (ascii >= 65 && ascii <= 90) {
      let i1 = formulaToken[i].charCodeAt(0) - 65;
      let j = Number(formulaToken[i][1]);
      let value = sheetDB[Number(j) - 1][i1].value;

      formulaToken[i] = value;
    }
  }
  let eformula = formulaToken.join(" ");
  return eval(eformula);
}

function setCell(value, cFormula) {
  let uiCellElem = findUIElement();
  uiCellElem.innerText = value;
  let j = address.value.charCodeAt(0) - 65;
  let i = Number(address.value[1]);
  sheetDB[i - 1][j].value = value;
  sheetDB[i - 1][j].formula = cFormula;
}
function findUIElement() {
  let addr = address.value;
  let cell = document.querySelector(
    `.cell[cid='${addr[0]}'][rid='${addr[1]}']`
  );
  return cell;
}

function setChildrenArray(formula, childAddress) {
  let formulaToken = formula.split(" ");
  for (let i = 0; i < formulaToken.length; i++) {
    let ascii = formulaToken[i].charAt(0);
    ascii = ascii.charCodeAt(0);

    if (ascii >= 65 && ascii <= 90) {
      let i1 = formulaToken[i].charCodeAt(0) - 65;
      let j = Number(formulaToken[i][1]);
      let parentObj = sheetDB[Number(j) - 1][i1];
      parentObj.children.push(childAddress);
    }
  }
  console.log(sheetDB);
}

function updateChildren(cellObj) {
  console.log("Called");
  let { children } = cellObj;
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let j = childAddress.charCodeAt(0) - 65;
    let i1 = Number(childAddress[1]);
    let childObj = sheetDB[i1 - 1][j];
    let chFormula = childObj.formula;
    let newValue = evaluateFormula(chFormula);
    setChildrenCell(chFormula, newValue, childAddress);
    updateChildren(childObj);
  }
}

function setChildrenCell(chFormula, newValue, childAddress) {
  console.log(childAddress);
  let cell = document.querySelector(
    `.cell[rid="${childAddress[1]}"][cid="${childAddress[0]}"]`
  );
  let j = childAddress.charCodeAt(0) - 65;
  let i = Number(childAddress[1]);

  cell.innerText = newValue;
  sheetDB[i - 1][j].value = newValue;
  sheetDB[i - 1][j].formula = chFormula;
}

function removeFormula(cellObj, myAddress) {
  let formula = cellObj.formula;
  let formulaToken = formula.split(" ");
  for (let i = 0; i < formulaToken.length; i++) {
    let ascii = formulaToken[i].charAt(0);
    ascii = ascii.charCodeAt(0);

    if (ascii >= 65 && ascii <= 90) {
      let i1 = formulaToken[i].charCodeAt(0) - 65;
      let j = Number(formulaToken[i][1]);
      let parentObj = sheetDB[Number(j) - 1][i1];
      let idx = parentObj.children.indexOf(myAddress);
      parentObj.children.splice(idx, 1);
    }
  }
  cellObj.formula = "";
}
