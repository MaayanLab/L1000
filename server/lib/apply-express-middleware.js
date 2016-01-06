export default function applyExpressMiddleware(fn, req, res) {
  const originalEnd = res.end;

  return function doneFunc(done) {
    // Need to reassign to res here
    /* eslint no-param-reassign: 0 */
    res.end = function resEnd() {
      originalEnd.apply(this, arguments);
      done(null, 0);
    };
    fn(req, res, function cb() {
      done(null, 1);
    });
  };
}
