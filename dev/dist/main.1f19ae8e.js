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

var n = function (t, r, u, e) {
  for (var p = 1; p < r.length; p++) {
    var s = r[p++],
        a = "number" == typeof s ? u[s] : s;
    1 === r[p] ? e[0] = a : 2 === r[p] ? (e[1] = e[1] || {})[r[++p]] = a : 3 === r[p] ? e[1] = Object.assign(e[1] || {}, a) : e.push(r[p] ? t.apply(null, n(t, a, u, ["", null])) : a);
  }

  return e;
},
    t = function (n) {
  for (var t, r, u = 1, e = "", p = "", s = [0], a = function (n) {
    1 === u && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? s.push(n || e, 0) : 3 === u && (n || e) ? (s.push(n || e, 1), u = 2) : 2 === u && "..." === e && n ? s.push(n, 3) : 2 === u && e && !n ? s.push(!0, 2, e) : 4 === u && r && (s.push(n || e, 2, r), r = ""), e = "";
  }, f = 0; f < n.length; f++) {
    f && (1 === u && a(), a(f));

    for (var h = 0; h < n[f].length; h++) t = n[f][h], 1 === u ? "<" === t ? (a(), s = [s], u = 3) : e += t : p ? t === p ? p = "" : e += t : '"' === t || "'" === t ? p = t : ">" === t ? (a(), u = 1) : u && ("=" === t ? (u = 4, r = e, e = "") : "/" === t ? (a(), 3 === u && (s = s[0]), u = s, (s = s[0]).push(u, 4), u = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (a(), u = 2) : e += t);
  }

  return a(), s;
},
    r = "function" == typeof Map,
    u = r ? new Map() : {},
    e = r ? function (n) {
  var r = u.get(n);
  return r || u.set(n, r = t(n)), r;
} : function (n) {
  for (var r = "", e = 0; e < n.length; e++) r += n[e].length + "-" + n[e];

  return u[r] || (u[r] = t(n));
};

function _default(t) {
  var r = n(this, e(t), arguments, []);
  return r.length > 1 ? r : r[0];
}

;
},{}],"../src/create_element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _htmMin = _interopRequireDefault(require("./htm.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('');

var _default = _htmMin.default.bind(function create_element(type, props, ...children) {
  const node = {
    type,
    props,
    children
  };
  node.props = node.props || {};

  function handle_custom_element(_node) {
    if (_node.type.constructor.name === 'AsyncFunction') {
      return create_element('__PROMISE__', {
        promise: _node
      }, []);
    }

    const render = _node.type(_node.props);

    const new_node = typeof render === 'function' ? render() : render;
    return create_element(new_node.type, new_node.props, ...new_node.children.concat(_node.children));
  }

  if (node.props.style) node.props.style = minify_style(node.props.style);
  return typeof type === 'function' ? handle_custom_element(node) : node;
});

exports.default = _default;
},{"./htm.min.js":"../src/htm.min.js"}],"../src/create_dom_nodes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create_dom_nodes;

function handle_props(props, element) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && key.toLowerCase() === key) {
      element[key] = value;
    } else if (key === 'use_state') {
      return;
    } else {
      element.setAttribute(key, value);
    }
  });
}

function handle_children(children, element) {
  children.forEach(child => {
    if (child === undefined || child === null) {
      return;
    } else if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      child.map(({
        type,
        props,
        children
      }) => {
        element.appendChild(create_dom_nodes.call(this, {
          type,
          props,
          children
        }));
      });
    } else {
      element.appendChild(create_dom_nodes.call(this, { ...child
      }));
    }
  });
}

function create_dom_nodes(node) {
  let {
    type,
    props,
    children
  } = node;
  const children_with_handlers = handle_children.bind(this);

  if (type === 'Link') {
    return this['LINK'](node);
  }

  if (type === '__PROMISE__') {
    return this['PROMISE'](node);
  }

  const element = document.createElement(type);
  handle_props(props, element);
  children_with_handlers(children, element);
  return element;
}
},{}],"../src/router.utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init_render_route = exports.init_routes = exports.init_head = exports.init_root = void 0;

var _create_element = _interopRequireDefault(require("./create_element.js"));

var _create_dom_nodes = _interopRequireDefault(require("./create_dom_nodes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const init_root = root => {
  return {
    replace_with(dom_node) {
      root.innerHTML = '';
      root.appendChild(dom_node);
    },

    root
  };
};

exports.init_root = init_root;

const init_head = (components = {}) => {
  let prev_head = [];
  const head = document.head;
  const default_head = components['*'];

  if (default_head) {
    const rendered = default_head();

    if (Array.isArray(rendered)) {
      rendered.map(vnode => head.appendChild((0, _create_dom_nodes.default)(vnode)));
    } else {
      head.appendChild((0, _create_dom_nodes.default)(rendered));
    }
  }

  return {
    set(route) {
      if (!components[route]) {
        prev_head.map(node => head.removeChild(node));
        prev_head = [];
        return;
      }

      prev_head.map(dom_node => head.removeChild(dom_node));
      const rendered = components[route] ? components[route]() : undefined;

      if (!rendered) {
        return;
      }

      if (Array.isArray(rendered)) {
        const nodes = rendered.map(vnode => (0, _create_dom_nodes.default)(vnode));
        prev_head = nodes;
        nodes.map(dom_node => head.appendChild(dom_node));
      } else {
        const node = (0, _create_dom_nodes.default)(rendered);
        prev_head = [node];
        head.appendChild(node);
      }
    }

  };
};

exports.init_head = init_head;

const init_routes = (routes, root_handler, head_handler, methods) => {
  const NOT_FOUND = routes['*'] ? routes['*'] : () => _create_element.default`<h1 style='text-align: center;'>404</h1>`;
  const handlers = {
    'PROMISE': node => {
      const {
        props
      } = node;
      const {
        placeholder,
        ..._props
      } = props.promise.props;
      const new_node = props.promise.type(_props);

      const _placeholder = placeholder();

      const element = (0, _create_dom_nodes.default)(_placeholder);
      new_node.then(_node => {
        element.parentNode.replaceChild((0, _create_dom_nodes.default)(_node), element);
      });
      return element;
    },
    'LINK': node => {
      const target = node.children[0];
      const element = (0, _create_dom_nodes.default)(target);
      const href = node.props.href;
      const match_href = href.split('/').filter(_ => _);
      const source = Object.keys(routes).reduce((acc, curr) => {
        const match_arr = curr.split('*').map(s => s.replace(/\//g, ''));

        if (match_arr.length === match_href.length) {
          acc.src = '/' + match_arr.map(el => !el ? '*' : el).join('/');
          acc.params = match_href.filter(s => match_arr.indexOf(s) === -1);
          return acc;
        } else {
          return acc;
        }
      }, {});
      element.href = href;

      element.onclick = e => {
        e.preventDefault();
        methods['on_route_unmount'] && methods['on_route_unmount'](window.location.pathname, root_handler.root.children[0]);
        window.history.pushState({}, '', href);
        head_handler.set(href);
        const route_component = routes[href] ? routes[href]() : routes[source.src] ? routes[source.src](source.params) : NOT_FOUND();
        const route_dom = (0, _create_dom_nodes.default)(route_component);
        methods['on_route_mount'] && methods['on_route_mount'](href, route_dom);
        root_handler.replace_with(route_dom);
      };

      return element;
    }
  };
  return {
    get: route => {
      if (routes[route]) {
        return _create_dom_nodes.default.call(handlers, routes[route]());
      } else {
        return (0, _create_dom_nodes.default)(NOT_FOUND());
      }
    }
  };
};

exports.init_routes = init_routes;

const init_render_route = (root_handler, head_handler, route_handler, methods) => {
  return route => {
    const route_dom = route_handler.get(route);
    head_handler.set(route);
    root_handler.replace_with(route_dom);
    methods['on_route_mount'] && methods['on_route_mount'](route, route_dom);
  };
};

exports.init_render_route = init_render_route;
},{"./create_element.js":"../src/create_element.js","./create_dom_nodes.js":"../src/create_dom_nodes.js"}],"../src/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = router;

var _routerUtils = require("./router.utils.js");

const current_path = () => window.location.pathname;

const bind_initial = (render_route, root_handler, methods) => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      if (current_path() === href) {
        return;
      }

      methods['on_route_unmount'] && methods['on_route_unmount'](current_path(), root_handler.root.children[0]);
      window.history.pushState({}, '', href);
      render_route(href);
    };
  });
};

function router(o) {
  const {
    root,
    routes,
    head,
    methods
  } = o;
  const root_handler = (0, _routerUtils.init_root)(root);
  const head_handler = (0, _routerUtils.init_head)(head);
  const route_handler = (0, _routerUtils.init_routes)(routes, root_handler, head_handler, methods);
  const render_route = (0, _routerUtils.init_render_route)(root_handler, head_handler, route_handler, methods);
  bind_initial(render_route, root_handler, methods);
  render_route(current_path());

  window.onpopstate = () => {
    methods['on_route_unmount'] && methods['on_route_unmount'](window.location.pathname, root_handler.root.children[0]);
    render_route(current_path());
  };
}
},{"./router.utils.js":"../src/router.utils.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create_element = _interopRequireDefault(require("./create_element.js"));

var _router = _interopRequireDefault(require("./router.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = Object.freeze({
  render: _create_element.default,
  router: _router.default
});

exports.default = _default;
},{"./create_element.js":"../src/create_element.js","./router.js":"../src/router.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("../src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  render,
  router
} = _index.default;
router({
  root: document.getElementById('app'),
  routes: {
    '/': () => render`<${Home} content='Hello World'/>`,
    '/about': () => render`<${About} />`,
    '/contact': () => render`<${Contact} />`,
    '*': () => render`<${NotFound} />`
  },
  head: {
    '/': () => render`
      <title>Home</title>
      <meta name='description' content='our home page'/>
    `,
    '/about': () => render`<title>About</title>`,
    '/post': ({
      query
    }) => render`<title>${query.title}-${query.num}</title>`,
    '*': () => render`
      <meta name='author' content='5alidz' />
      <meta name='author' content='5alidz' />
    `
  },
  methods: {
    on_route_mount: (current, element) => {
      return;
    },
    on_route_unmount: (route, element) => {
      return;
    }
  }
});

async function test_async({
  timer
}) {
  const msg = await new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
    }, timer);
  });

  const say_hi = () => console.log('hi');

  return render`
    <div onload=${say_hi}>${msg}</div>
  `;
}

async function with_data({
  id
}) {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/' + id);
  const json = await data.json();
  return render`
    <div>
      <h3>${json.title}</h3>
      <p>${json.completed ? 'completed' : 'progress'}</p>
    </div>
  `;
}

function spinner() {
  return render`
    <p>...</p>
  `;
}

function todo({
  id
}) {
  return render`
    <${with_data}
      id=${id}
      placeholder=${() => render`<${spinner} />`}/>
  `;
}

function Home({
  content
}) {
  return () => render`
    <div id='home'>
      <h1>Home</h1>
      <p>${content}</p>
      <${todo} id=1 />
      <${todo} id=2 />
      <${todo} id=3 />
      <${test_async}
        timer=${500}
        placeholder=${() => render`<${spinner} />`} />
      <Link href='/about'>
        <a>read more...</a>
      </Link>
    </div>
  `;
}

function About() {
  return () => render`
    <div id='about'>
      <h1>About</h1>
    </div>
  `;
}

function Contact() {
  return () => render`
    <div id='contact'>
      <h1>Contact</h1>
    </div>
  `;
}

function NotFound() {
  return render`
    <h1 style='text-align: center; color: red;'>404</h1>
  `;
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56545" + '/');

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