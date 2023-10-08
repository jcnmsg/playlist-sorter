export function Pipeline () {
  const steps = [];

  let index = -1;
  let data = {};

  function step (callback) {
    steps.push(callback);
  }

  function run (d) {
    data = d;
    next();
  }

  function next () {
    if (steps[++index]) steps[index](data, next);
  }

  return Object.freeze({
    step,
    run
  });
}
