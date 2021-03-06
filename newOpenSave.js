const saveBtn = document.querySelector(".save");
const newBtn = document.querySelector(".new");
const openBtn = document.querySelector(".open");

saveBtn.addEventListener("click", () => {
  const data = JSON.stringify(sheetDB);
  const blob = new Blob([data], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.download = `${fileName.innerText}.json`;
  a.href = url;
  a.click();
  a.remove();
});

openBtn.addEventListener("click", (e) => {
  // files array -> file accept-> multiple files get
  let filesArray = open.files;

  let fileObj = e.target.files[0];
  // file reader to read the file
  let fr = new FileReader();
  // read as text
  fr.readAsText(fileObj);
  fr.onload = function () {
    console.log(fr.result);
    sheetArray.push(JSON.parse(fr.result));
  };
  fr.addEventListener("load", function () {
    // console.log(fr.result);
  });

  console.log("After");
  // ui init f
});
