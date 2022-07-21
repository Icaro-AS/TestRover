module.exports = {
  eachSeries(arr, iteratorFunction) {
    return arr.reduce(function(p, item) {
      return p.then(function() {
        return iteratorFunction(item);
      });
    }, Promise.resolve());
  }
}