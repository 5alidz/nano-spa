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
},{}],"../src/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _htmMin = _interopRequireDefault(require("./htm.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('');
/*
const typeOf = o => Object.prototype.toString
  .call(o)
  .replace(/[[\]]/g, '')
  .split(' ')[1]
  .toLowerCase()
*/


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
},{"./htm.min.js":"../src/htm.min.js"}],"../src/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = router;

// what a mess!
const _head = (() => {
  const dom = document.getElementsByTagName('head')[0];
  let _head = [];
  return {
    set: (arr, presis) => {
      const clean = Array.isArray(arr) ? arr : [arr].filter(_ => _);

      if (!presis) {
        _head.map(el => dom.removeChild(el));

        _head = clean;
      }

      clean.map(node => dom.appendChild(node));
    }
  };
})();

const is_fn = maybe_fn => typeof maybe_fn === 'function';

const get_pathname = () => window.location.pathname;

function router(_container, _) {
  function handle_props(props, element) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value;
      } else if (key == '__INTERNAL_RERENDER__') {
        console.log('has rerender => ', element);
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
          element.appendChild(create_dom_nodes({
            type,
            props,
            children
          }));
        });
      } else {
        element.appendChild(create_dom_nodes({ ...child
        }));
      }
    });
  }

  function handle_link(_node) {
    const {
      props,
      children
    } = _node;
    const node = children[0];
    const element = document.createElement(node.type);

    if (node.type == 'a') {
      element.href = props.href;
    }

    element.onclick = e => {
      e.preventDefault();
      window.history.pushState({}, '', props.href);
      render_route(props.href);

      if (_._config.on_route_change) {
        _._config.on_route_change(props.href);
      }
    };

    handle_props(node.props, element);
    handle_children(node.children, element);
    return element;
  }

  function handle_promise(node) {
    const {
      props
    } = node;
    const {
      placeholder,
      ..._props
    } = props.promise.props;
    const new_node = props.promise.type(_props);

    const _placeholder = placeholder();

    const element = create_dom_nodes(_placeholder);
    new_node.then(_node => {
      element.parentNode.replaceChild(create_dom_nodes(_node), element);
    });
    return element;
  }

  function handle_default(node) {
    let {
      type,
      props,
      children
    } = node;
    const element = document.createElement(type);
    handle_props(props, element);
    handle_children(children, element);
    return element;
  }

  function create_dom_nodes(node) {
    if (node.type == 'Link') {
      return handle_link(node);
    } else if (node.type === '__PROMISE__') {
      return handle_promise(node);
    } else {
      return handle_default(node);
    }
  }

  function maybe_node_arr(arr) {
    return Array.isArray(arr) ? arr.map(vnode => create_dom_nodes(vnode)) : create_dom_nodes(arr);
  }

  function render_route(path) {
    const route_component = _[path] ? _[path]() : _['*']();
    const head_component = _._config.head[path] && path !== '*' ? _._config.head[path]() : [];

    _head.set(maybe_node_arr(head_component));

    _container.innerHTML = '';

    _container.appendChild(create_dom_nodes(route_component));
  }

  if (_._config && _._config.head['*']) {
    const head_component = is_fn(_._config.head['*']) ? _._config.head['*']() : 0;

    if (head_component) {
      _head.set(maybe_node_arr(head_component), true);
    }
  }

  Array.from(document.querySelectorAll('.spa-nav')).map(element => {
    element.onclick = e => {
      e.preventDefault();
      const href = element.getAttribute('href');

      if (get_pathname() === href) {
        return;
      }

      window.history.pushState({}, '', href);
      render_route(get_pathname());

      if (_._config.on_route_change) {
        _._config.on_route_change(get_pathname());
      }
    };
  });
  render_route(get_pathname());

  window.onpopstate = () => {
    render_route(get_pathname());
  };
}
},{}],"../src/index.js":[function(require,module,exports) {
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

const {
  render,
  router
} = _index.default;
router(document.getElementById('app'), {
  '/': () => render`<${Home} content='Hello World'/>`,
  '/about': () => render`<${About} />`,
  '/contact': () => render`<${Contact} />`,
  '/post': ({
    query
  }) => render`<${Post} query=${query}/>`,
  '/posts': () => render`<${Posts} />`,
  '*': () => render`<${NotFound} />`,
  _config: {
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
    on_route_change: current => {
      console.log(current);
    }
  }
});

function Post({
  query
}) {
  return render`
    <div>
      <h3>${query.num}</h3>
      <p>${query.title}</p>
    </div>
  `;
}

function Posts() {
  return render`
    <div>
      <h1>all the posts you want</h1>
      <Link href='/post?num=100&title=img' as='/posts/product'>
        <img src="https://via.placeholder.com/150" />
      </Link>
      ${[...Array(20).keys()].map(n => render`
        <div>
          <h3>i'm post number-${n}</h3>
          <Link href=${`/post?num=${n}&title=hiiiii`} as=${`/posts/${n}`}>
            <a>Read More</a>
          </Link>
        </div>
      `)}
    </div>
  `;
}

async function test_async({
  timer
}) {
  const msg = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, timer);
  });
  return render`
    <div>${msg}</div>
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
    <div>
      <h1>Home</h1>
      <p>${content}</p>
      <${todo} id=1 />
      <${todo} id=2 />
      <${todo} id=3 />
      <${test_async}
        timer=${500}
        placeholder=${() => render`<${spinner} />`} />
      <Link href='/posts'>
        <a>all posts</a>
      </Link>
    </div>
  `;
}

function About() {
  return () => render`
    <div>
      <h1>About</h1>
    </div>
  `;
}

function Contact() {
  return () => render`
    <div>
      <h1>Contact</h1>
    </div>
  `;
}

function NotFound() {
  return render`
    <h1 style='margin: 0 auto;'>404</h1>
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65335" + '/');

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