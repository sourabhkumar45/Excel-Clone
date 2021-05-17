//let allCells = document.querySelectorAll(".grid .cell");

grid.addEventListener("click", (e) => {
  e.target.addEventListener("blur", (e1) => {
    let addr =
      e.target.attributes.cid.nodeValue + e.target.attributes.rid.nodeValue;
    let j = addr.charCodeAt(0) - 65;
    let i = Number(addr[1]);
    //console.log(i - 1, j);
    sheetDB[i - 1][j].value = e.target.innerText;
    console.log(sheetDB[i - 1][j].value);
  });
});
formulaCont.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && formulaCont.value) {
    let cFormula = formulaCont.value;
    let value = evaluateFormula(cFormula);
    setCell(value);
  }
});

function evaluateFormula(formula) {
  let formulaToken = formula.split(" ");
  console.log(formulaToken);
  for (let i = 0; i < formulaToken.length; i++) {
    let ascii = formulaToken[i].charAt(0);
    ascii = ascii.charCodeAt(0);

    if (ascii >= 65 && ascii <= 90) {
      console.log("ascii = ", ascii);
      let i1 = formulaToken[i].charCodeAt(0) - 65;
      let j = Number(formulaToken[i][1]);
      console.log(i1, j - 1);
      let value = sheetDB[Number(j) - 1][i1].value;

      formulaToken[i] = value;
    }
  }
  console.log(formulaToken);
  let eformula = formulaToken.join(" ");
  console.log(eformula);
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
