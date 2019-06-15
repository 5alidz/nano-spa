var nano_spa = (function () {
  'use strict';

  var n = function(t,r,u,e){for(var p=1;p<r.length;p++){var s=r[p++],a="number"==typeof s?u[s]:s;1===r[p]?e[0]=a:2===r[p]?(e[1]=e[1]||{})[r[++p]]=a:3===r[p]?e[1]=Object.assign(e[1]||{},a):e.push(r[p]?t.apply(null,n(t,a,u,["",null])):a);}return e},t=function(n){for(var t,r,u=1,e="",p="",s=[0],a=function(n){1===u&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(n||e,0):3===u&&(n||e)?(s.push(n||e,1),u=2):2===u&&"..."===e&&n?s.push(n,3):2===u&&e&&!n?s.push(!0,2,e):4===u&&r&&(s.push(n||e,2,r),r=""),e="";},f=0;f<n.length;f++){f&&(1===u&&a(),a(f));for(var h=0;h<n[f].length;h++)t=n[f][h],1===u?"<"===t?(a(),s=[s],u=3):e+=t:p?t===p?p="":e+=t:'"'===t||"'"===t?p=t:">"===t?(a(),u=1):u&&("="===t?(u=4,r=e,e=""):"/"===t?(a(),3===u&&(s=s[0]),u=s,(s=s[0]).push(u,4),u=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(a(),u=2):e+=t);}return a(),s},r="function"==typeof Map,u=r?new Map:{},e=r?function(n){var r=u.get(n);return r||u.set(n,r=t(n)),r}:function(n){for(var r="",e=0;e<n.length;e++)r+=n[e].length+"-"+n[e];return u[r]||(u[r]=t(n))};function htm(t){var r=n(this,e(t),arguments,[]);return r.length>1?r:r[0]}

  const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('');

  var render = htm.bind(function create_element(type, props, ...children) {
    const node = {type, props, children};
    node.props = node.props || {};
    function handle_custom_element(_node) {
      if(_node.type.constructor.name === 'AsyncFunction'){
        return create_element('__PROMISE__', {promise: _node}, [])
      }
      const render = _node.type(_node.props);
      const new_node =  typeof render === 'function' ? render() : render;
      return create_element(
        new_node.type,
        new_node.props,
        ...new_node.children.concat(_node.children)
      )
    }
    if(node.props.style) node.props.style = minify_style(node.props.style);
    return typeof type === 'function' ? handle_custom_element(node) : node
  });

  var _global = {
    root: undefined,
    routes: {},
    head: {},
    methods: {},
    cache: []
  };

  function handle_props(props, element) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && window.hasOwnProperty(key)) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  function handle_children(children, element) {
    children.forEach(child => {
      if (child == undefined) {
        return
      } else if (typeof child == 'string' || typeof child == 'number') {
        element.appendChild(document.createTextNode(child));
      } else if (Array.isArray(child)) {
        child.map(node => element.appendChild(
            create_dom_nodes.call(this, {...node})
          )
        );
      } else {
        element.appendChild(create_dom_nodes.call(this, {...child}));
      }
    });
  }

  function create_dom_nodes(node) {
    let {type, props, children} = node;
    const children_with_handlers = handle_children.bind(this);
    if(type === 'Link') { return this.LINK(node) }
    if(type === '__PROMISE__') { return this.PROMISE(node) }
    const element = document.createElement(type);
    handle_props(props, element);
    children_with_handlers(children, element);
    return element
  }

  const UNMOUNT = 'on_route_unmount';
  const MOUNT = 'on_route_mount';

  const get_current = () => window.location.pathname;

  const __PUSH_STATE__ = route => window.history.pushState({}, '', route);

  const on_unmount = (route) => _global.methods[UNMOUNT]
    && _global.methods[UNMOUNT](
      route || get_current(),
      _global.root.children[0]
    );

  const on_mount = (route_dom) => _global.methods[MOUNT]
    && _global.methods[MOUNT](get_current(), route_dom);

  const regex_match = (route, routes) => {
    let matched = undefined;
    if(routes[route]) {
      return matched
    } else {
      Object
        .keys(routes)
        .filter(key => key !== '*' || routes.hasOwnProperty(route))
        .map(key => {
          const regex = new RegExp(key);
          if(!regex.test(route)) { return }
          const regex_vals = regex.exec(route);
          if(regex.test(route) && regex_vals.length >= 2) {
            const [, ...matches] = regex_vals;
            matched = routes[key] ? [routes[key], matches] : undefined;
          }
        });
      return matched
    }
  };

  const head = document.head;
  let prev_head = [];

  const clear_prev = () => prev_head.map(node => head.removeChild(node));
  const render_arr = nodes => nodes.map(vnode => {
    const node = create_dom_nodes(vnode);
    head.appendChild(node);
    return node
  });

  const to_arr = comp => Array.isArray(comp) ? comp : [comp];
  const handle_component = (comp, is_to_prev) => is_to_prev
    ? prev_head = render_arr(to_arr(comp))
    : render_arr(to_arr(comp));


  const mount_first_head = () => handle_component(
    _global.head['*'] && _global.head['*'](),
    false
  );

  const set = (route) => {
    clear_prev();
    const matched = regex_match(route, _global.head);
    if(matched) {return handle_component(matched[0](matched[1]), true)}
    if(!_global.head[route]) {return (prev_head = [])}
    handle_component(_global.head[route](), true);
  };

  const replace_with = (dom_node) => {
    _global.root.innerHTML = '';
    _global.root.appendChild(dom_node);
  };

  const NOT_FOUND = () => _global.routes['*']
    ? _global.routes['*']
    : () => render`<h1 style='text-align: center;'>404</h1>`;

  const gen_tree = (route, matched) => _global.routes[route]
    ? _global.routes[route]()
    : matched ? matched[0](matched[1]) : NOT_FOUND()();

  const __FINAL__ = (route, dom) => {
    on_mount(dom);
    set(route);
    replace_with(dom);
  };

  const caches = {};

  const handlers = {
    PROMISE(node) {
      const with_handlers = create_dom_nodes.bind(this);
      const { props } = node;
      const { placeholder, ..._props } = props.promise.props;
      const new_node = props.promise.type(_props);
      const _placeholder = placeholder();
      const element = with_handlers(_placeholder);
      new_node.then(_node => {
        element.replaceWith(with_handlers(_node));
      });
      return element
    },
    LINK(node) {
      const with_handlers = create_dom_nodes.bind(this);
      const target = node.children[0];
      const element = with_handlers(target);
      const href = node.props.href;
      'href' in element && (element.href = href);
      const matched = regex_match(href, _global.routes);
      element.onclick = e => {
        e.preventDefault();
        if(get_current() == href) { return }
        on_unmount();
        __PUSH_STATE__(href);
        const route_tree = with_handlers(gen_tree(href, matched));
        __FINAL__(href, route_tree);
      };
      return element
    }
  };

  const render_route = () => {
    const with_handlers = create_dom_nodes.bind(handlers);
    const route = get_current();
    const DONT_CACHE = _global.cache.includes(route);
    const matched = regex_match(route, _global.routes);
    const route_tree = with_handlers(gen_tree(route, matched));
    if(!caches[route]) { caches[route] = route_tree; }
    __FINAL__(route, DONT_CACHE ? route_tree : caches[route]);
  };

  const bind_initial = (render_route) => {
    document.querySelectorAll('.LINK').forEach(link => {
      link.onclick = function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if(get_current() === href) {return}
        on_unmount();
        __PUSH_STATE__(href);
        render_route();
      };
    });
  };

  function router(o) {
    Object.assign(_global, o);

    bind_initial(render_route);
    mount_first_head();
    render_route();

    let prev = get_current();
    window.onpopstate = () => {
      on_unmount(prev);
      prev = get_current();
      render_route();
    };
  }

  var index = {render, router, to_dom: create_dom_nodes.bind(handlers)};

  return index;

}());
