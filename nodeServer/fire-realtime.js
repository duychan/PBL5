const timeout = (ms) => {
  return new Promise(() => {
    setTimeout(() => {
      console.log(2);
    }, ms);
  });
};
async function func(fn) {
  await timeout(1000);
  fn();
}
func(() => {
  console.log(1);
});
