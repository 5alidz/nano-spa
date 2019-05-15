// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/htm.min.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var n = function n(t, r, u, e) {
  for (var p = 1; p < r.length; p++) {
    var s = r[p++],
        a = "number" == typeof s ? u[s] : s;
    1 === r[p] ? e[0] = a : 2 === r[p] ? (e[1] = e[1] || {})[r[++p]] = a : 3 === r[p] ? e[1] = Object.assign(e[1] || {}, a) : e.push(r[p] ? t.apply(null, n(t, a, u, ["", null])) : a);
  }

  return e;
},
    t = function t(n) {
  for (var t, r, u = 1, e = "", p = "", s = [0], a = function a(n) {
    1 === u && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? s.push(n || e, 0) : 3 === u && (n || e) ? (s.push(n || e, 1), u = 2) : 2 === u && "..." === e && n ? s.push(n, 3) : 2 === u && e && !n ? s.push(!0, 2, e) : 4 === u && r && (s.push(n || e, 2, r), r = ""), e = "";
  }, f = 0; f < n.length; f++) {
    f && (1 === u && a(), a(f));

    for (var h = 0; h < n[f].length; h++) {
      t = n[f][h], 1 === u ? "<" === t ? (a(), s = [s], u = 3) : e += t : p ? t === p ? p = "" : e += t : '"' === t || "'" === t ? p = t : ">" === t ? (a(), u = 1) : u && ("=" === t ? (u = 4, r = e, e = "") : "/" === t ? (a(), 3 === u && (s = s[0]), u = s, (s = s[0]).push(u, 4), u = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (a(), u = 2) : e += t);
    }
  }

  return a(), s;
},
    r = "function" == typeof Map,
    u = r ? new Map() : {},
    e = r ? function (n) {
  var r = u.get(n);
  return r || u.set(n, r = t(n)), r;
} : function (n) {
  for (var r = "", e = 0; e < n.length; e++) {
    r += n[e].length + "-" + n[e];
  }

  return u[r] || (u[r] = t(n));
};

function _default(t) {
  var r = n(this, e(t), arguments, []);
  return r.length > 1 ? r : r[0];
}

;
},{}],"../src/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _htmMin = _interopRequireDefault(require("./htm.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var minify_style = function minify_style(s) {
  return s.trim().split('\n').map(function (s) {
    return s.trim();
  }).join('');
};
/*
const typeOf = o => Object.prototype.toString
  .call(o)
  .replace(/[[\]]/g, '')
  .split(' ')[1]
  .toLowerCase()
*/


var _default = _htmMin.default.bind(function create_element(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var node = {
    type: type,
    props: props,
    children: children
  };
  node.props = node.props || {};

  function handle_custom_element(_node) {
    if (_node.type.constructor.name === 'AsyncFunction') {
      return create_element('__PROMISE__', {
        promise: _node
      }, []);
    }

    var render = _node.type(_node.props);

    var new_node = typeof render === 'function' ? render() : render;
    return create_element.apply(void 0, [new_node.type, new_node.props].concat(_toConsumableArray(new_node.children.concat(_node.children))));
  }

  if (node.props.style) node.props.style = minify_style(node.props.style);
  return typeof type === 'function' ? handle_custom_element(node) : node;
});

exports.default = _default;
},{"./htm.min.js":"../src/htm.min.js"}],"../src/head.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function () {
  var dom = document.getElementsByTagName('head')[0];

  var _clean = function _clean(maybe_arr) {
    return Array.isArray(maybe_arr) ? maybe_arr : [maybe_arr].filter(function (_) {
      return _;
    });
  };

  var append = function append(arr) {
    return arr.map(function (node) {
      return dom.appendChild(node);
    });
  };

  var _head = [];
  return {
    set: function set(arr, presis) {
      var clean = _clean(arr);

      if (!presis) {
        _head.map(function (el) {
          return dom.removeChild(el);
        });

        _head = clean;
      }

      append(clean);
    }
  };
}();

exports.default = _default;
},{}],"../src/parse_query.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var reducer = function reducer(acc, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];

  Object.defineProperty(acc, key, {
    value: value
  });
  return acc;
};

function _default(path) {
  var arr = path.split('?');
  var q = arr[1] ? arr[1].split('&') : undefined;
  return q ? q.map(function (str) {
    return str.split('=');
  }).reduce(reducer, {}) : undefined;
}
},{}],"../src/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = router;

var _head2 = _interopRequireDefault(require("./head.js"));

var _parse_query = _interopRequireDefault(require("./parse_query.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var get_pathname = function get_pathname() {
  return window.location.pathname;
};

var bind_initial_nav = function bind_initial_nav(render_route, on_route_change) {
  return function () {
    Array.from(document.querySelectorAll('.spa-nav')).map(function (element) {
      element.onclick = function (e) {
        e.preventDefault();

        if (get_pathname() === element.getAttribute('href')) {
          return;
        }

        window.history.pushState({}, '', element.href);
        render_route(get_pathname());

        if (on_route_change) {
          on_route_change(get_pathname());
        }
      };
    });
  };
};

function router(_container, config) {
  var _config = config._config,
      routes = _objectWithoutProperties(config, ["_config"]);

  var head = _config.head || {}; //const plugins = _config.plugins || []

  var on_route_change = _config.on_route_change || undefined;

  function handle_props(props, element) {
    Object.entries(props).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  function handle_children(children, element) {
    children.forEach(function (child) {
      if (child === undefined || child === null) {
        return;
      } else if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child));
      } else if (Array.isArray(child)) {
        child.map(function (_ref3) {
          var type = _ref3.type,
              props = _ref3.props,
              children = _ref3.children;
          element.appendChild(create_dom_nodes({
            type: type,
            props: props,
            children: children
          }));
        });
      } else {
        element.appendChild(create_dom_nodes(_objectSpread({}, child)));
      }
    });
  }

  function create_dom_nodes(node) {
    var type = node.type,
        props = node.props,
        children = node.children;

    if (type == 'Link') {
      var _node2 = children[0];
      var element = document.createElement(_node2.type);

      if (_node2.type == 'a') {
        element.href = props.as ? props.as : props.href;
      }

      var base = props.href.split('?')[0];
      var query = (0, _parse_query.default)(props.href);

      if (query) {
        routes[props.as] = routes[base].bind(null, {
          query: query
        });
        head[props.as] = head[base].bind(null, {
          query: query
        });
      }

      element.onclick = function (e) {
        e.preventDefault();
        window.history.pushState({
          query: query
        }, '', props.as || props.href);
        render_route(props.as || props.href, {
          query: query
        });

        if (on_route_change) {
          on_route_change(props.href);
        }
      };

      handle_props(_node2.props, element);
      handle_children(_node2.children, element);
      return element;
    } else if (type === '__PROMISE__') {
      var _props$promise$props = props.promise.props,
          placeholder = _props$promise$props.placeholder,
          _props = _objectWithoutProperties(_props$promise$props, ["placeholder"]);

      var new_node = props.promise.type(_props);

      var _placeholder = placeholder();

      var _element = create_dom_nodes(_placeholder);

      new_node.then(function (_node) {
        _element.parentNode.replaceChild(create_dom_nodes(_node), _element);
      });
      return _element;
    } else {
      var _element2 = document.createElement(type);

      handle_props(props, _element2);
      handle_children(children, _element2);
      return _element2;
    }
  }

  var maybe_node_arr = function maybe_node_arr(arr) {
    return Array.isArray(arr) ? arr.map(function (vnode) {
      return create_dom_nodes(vnode);
    }) : create_dom_nodes(arr);
  };

  function render_route(path) {
    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var route_component = routes[path] ? routes[path](ctx) : routes['*']();
    var head_component = head[path] && path !== '*' ? head[path](ctx) : [];

    _head2.default.set(maybe_node_arr(head_component));

    _container.innerHTML = '';

    _container.appendChild(create_dom_nodes(route_component));
  }

  if (head['*']) {
    var head_component = typeof head['*'] === 'function' ? head['*']() : undefined;

    if (!head_component) {
      return;
    }

    _head2.default.set(maybe_node_arr(head_component), true);
  }

  bind_initial_nav(render_route, on_route_change)();
  render_route(get_pathname());

  window.onpopstate = function () {
    render_route(get_pathname());
  };
}
},{"./head.js":"../src/head.js","./parse_query.js":"../src/parse_query.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render.js"));

var _router = _interopRequireDefault(require("./router.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = Object.freeze({
  render: _render.default,
  router: _router.default
});

exports.default = _default;
},{"./render.js":"../src/render.js","./router.js":"../src/router.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("../src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject23() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h3>", "</h3>\n      <p>", "</p>\n    </div>\n  "]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = _taggedTemplateLiteral(["\n    <div>", "</div>\n  "]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = _taggedTemplateLiteral(["\n    <h1 style='margin: 0 auto;'>404</h1>\n  "]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h1>Contact</h1>\n    </div>\n  "]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h1>About</h1>\n    </div>\n  "]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h1>Home</h1>\n      <p>", "</p>\n      <", " id=1 />\n      <", " id=2 />\n      <", " id=3 />\n      <", "\n        timer=", "\n        placeholder=", " />\n      <Link href='/posts'>\n        <a>all posts</a>\n      </Link>\n    </div>\n  "]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["\n    <", "\n      id=", "\n      placeholder=", "/>\n  "]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral(["\n    <p>...</p>\n  "]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _templateObject13() {
  var data = _taggedTemplateLiteral(["\n        <div>\n          <h3>i'm post number-", "</h3>\n          <Link href=", " as=", ">\n            <a>Read More</a>\n          </Link>\n        </div>\n      "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject12() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h1>all the posts you want</h1>\n      <Link href='/post?num=100&title=img' as='/posts/product'>\n        <img src=\"https://via.placeholder.com/150\" />\n      </Link>\n      ", "\n    </div>\n  "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <h3>", "</h3>\n      <p>", "</p>\n    </div>\n  "]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n        <meta name='author' content='5alidz' />\n        <meta name='author' content='5alidz' />\n      "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["<title>", "-", "</title>"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["<title>About</title>"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n        <title>Home</title>\n        <meta name='description' content='our home page'/>\n      "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["<", " query=", "/>"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<", " content='Hello World'/>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var render = _index.default.render,
    router = _index.default.router;
router(document.getElementById('app'), {
  '/': function _() {
    return render(_templateObject(), Home);
  },
  '/about': function about() {
    return render(_templateObject2(), About);
  },
  '/contact': function contact() {
    return render(_templateObject3(), Contact);
  },
  '/post': function post(_ref) {
    var query = _ref.query;
    return render(_templateObject4(), Post, query);
  },
  '/posts': function posts() {
    return render(_templateObject5(), Posts);
  },
  '*': function _() {
    return render(_templateObject6(), NotFound);
  },
  _config: {
    head: {
      '/': function _() {
        return render(_templateObject7());
      },
      '/about': function about() {
        return render(_templateObject8());
      },
      '/post': function post(_ref2) {
        var query = _ref2.query;
        return render(_templateObject9(), query.title, query.num);
      },
      '*': function _() {
        return render(_templateObject10());
      }
    },
    on_route_change: function on_route_change(current) {
      console.log(current);
    }
  }
});

function Post(_ref3) {
  var query = _ref3.query;
  return render(_templateObject11(), query.num, query.title);
}

function Posts() {
  return render(_templateObject12(), _toConsumableArray(Array(20).keys()).map(function (n) {
    return render(_templateObject13(), n, "/post?num=".concat(n, "&title=hiiiii"), "/posts/".concat(n));
  }));
}

function test_async(_x) {
  return _test_async.apply(this, arguments);
}

function _test_async() {
  _test_async = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref4) {
    var timer, msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            timer = _ref4.timer;
            _context.next = 3;
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve('hello');
              }, timer);
            });

          case 3:
            msg = _context.sent;
            return _context.abrupt("return", render(_templateObject22(), msg));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _test_async.apply(this, arguments);
}

function with_data(_x2) {
  return _with_data.apply(this, arguments);
}

function _with_data() {
  _with_data = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref5) {
    var id, data, json;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = _ref5.id;
            _context2.next = 3;
            return fetch('https://jsonplaceholder.typicode.com/todos/' + id);

          case 3:
            data = _context2.sent;
            _context2.next = 6;
            return data.json();

          case 6:
            json = _context2.sent;
            return _context2.abrupt("return", render(_templateObject23(), json.title, json.completed ? 'completed' : 'progress'));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _with_data.apply(this, arguments);
}

function spinner() {
  return render(_templateObject14());
}

function todo(_ref6) {
  var id = _ref6.id;
  return render(_templateObject15(), with_data, id, function () {
    return render(_templateObject16(), spinner);
  });
}

function Home(_ref7) {
  var content = _ref7.content;
  return function () {
    return render(_templateObject17(), content, todo, todo, todo, test_async, 500, function () {
      return render(_templateObject18(), spinner);
    });
  };
}

function About() {
  return function () {
    return render(_templateObject19());
  };
}

function Contact() {
  return function () {
    return render(_templateObject20());
  };
}

function NotFound() {
  return render(_templateObject21());
}
},{"../src/index.js":"../src/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64327" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map