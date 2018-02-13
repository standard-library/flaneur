"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _kefir = require("kefir");

var _moveto = require("moveto");

var _moveto2 = _interopRequireDefault(_moveto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REASONABLE_MODIFIER = _kefir.Kefir.constant(function (d) {
  return d / 4;
});

function offsetTop(element) {
  if (!element.getClientRects().length) {
    return 0;
  }

  var rect = element.getBoundingClientRect();
  var win = element.ownerDocument.defaultView;

  return rect.top + win.pageYOffset;
}

function flâneur(_ref, scrollY) {
  var _ref$modifier = _ref.modifier,
      modifier = _ref$modifier === undefined ? REASONABLE_MODIFIER : _ref$modifier;

  var manager = new _moveto2.default();

  var destinationStream = _kefir.Kefir.pool();
  var requestedPath = _kefir.Kefir.combine([scrollY, destinationStream]).sampledBy(destinationStream);

  var requestPlan = _kefir.Kefir.combine([modifier, requestedPath], function (m, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        from = _ref3[0],
        to = _ref3[1];

    var destination = typeof to === "number" ? to : offsetTop(to);
    var delta = destination - from;
    var duration = m(Math.abs(delta));

    return {
      duration: duration,
      delta: delta
    };
  });

  requestPlan.observe(function (plan) {
    manager.move(plan.delta, {
      duration: plan.duration
    });
  });

  var regard = function regard(s) {
    return destinationStream.plug(s);
  };

  return { regard: regard };
}

exports.default = flâneur;