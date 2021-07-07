const resizeObserver = new ResizeObserver((topRow) => {
  console.log(topRow);
});
resizeObserver.observe(topRow);
