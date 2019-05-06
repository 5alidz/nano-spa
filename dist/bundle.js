var nano_spa = (function () {
  'use strict';

  var n = function(t,r,u,e){for(var p=1;p<r.length;p++){var s=r[p++],a="number"==typeof s?u[s]:s;1===r[p]?e[0]=a:2===r[p]?(e[1]=e[1]||{})[r[++p]]=a:3===r[p]?e[1]=Object.assign(e[1]||{},a):e.push(r[p]?t.apply(null,n(t,a,u,["",null])):a);}return e},t=function(n){for(var t,r,u=1,e="",p="",s=[0],a=function(n){1===u&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(n||e,0):3===u&&(n||e)?(s.push(n||e,1),u=2):2===u&&"..."===e&&n?s.push(n,3):2===u&&e&&!n?s.push(!0,2,e):4===u&&r&&(s.push(n||e,2,r),r=""),e="";},f=0;f<n.length;f++){f&&(1===u&&a(),a(f));for(var h=0;h<n[f].length;h++)t=n[f][h],1===u?"<"===t?(a(),s=[s],u=3):e+=t:p?t===p?p="":e+=t:'"'===t||"'"===t?p=t:">"===t?(a(),u=1):u&&("="===t?(u=4,r=e,e=""):"/"===t?(a(),3===u&&(s=s[0]),u=s,(s=s[0]).push(u,4),u=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(a(),u=2):e+=t);}return a(),s},r="function"==typeof Map,u=r?new Map:{},e=r?function(n){var r=u.get(n);return r||u.set(n,r=t(n)),r}:function(n){for(var r="",e=0;e<n.length;e++)r+=n[e].length+"-"+n[e];return u[r]||(u[r]=t(n))};function htm(t){var r=n(this,e(t),arguments,[]);return r.length>1?r:r[0]}

  const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('');
  var render = htm.bind(function create_element(type, props, ...children) {
    const node = {type, props, children};
    node.props = node.props || {};
    function handle_custom_element(_node) {
      const render = _node.type(_node.props);
      const new_node = typeof render === 'function' ? render() : render;
      return create_element(
        new_node.type,
        new_node.props,
        ...new_node.children.concat(_node.children)
      )
    }
    if(node.props.style) node.props.style = minify_style(node.props.style);
    return typeof type === 'function' ? handle_custom_element(node) : node
  });

  var _head = (() => {
    const dom = document.getElementsByTagName('head')[0];
    let _head = [];
    return {
      set: (arr) => {
        const clean = Array.isArray(arr) ? arr : [arr].filter(_ => _);
        _head.map(el => dom.removeChild(el));
        clean.map(node => dom.appendChild(node));
        _head = clean;
      }
    }
  })();

  const reducer = (acc, [key, value]) => {
    Object.defineProperty(acc, key, { value });
    return acc
  };
  function parse_query(path) {
    const arr = path.split('?');
    const q = arr[1] ? arr[1].split('&') : undefined;
    return q
      ? q.map(str => str.split('=')).reduce(reducer, {})
      : undefined
  }

  // TODO Link and Head.
  const get_pathname = () => window.location.pathname;
  const render_initial = (render_route) => () => {
    Array.from(document.querySelectorAll('.spa-nav')).map(element => {
      element.onclick = e => {
        e.preventDefault();
        if(get_pathname() === element.getAttribute('href')) {return}
        window.history.pushState({}, '', element.href);
        render_route(get_pathname());
      };
    });
  };
  function router(_container, config) {
    const {_config, ...routes} = config;
    const { plugins, head } = _config;
    function handle_props(props, element) {
      Object.entries(props).forEach(([key, value]) => {
        if (key.startsWith('on') && key.toLowerCase() === key) {
          element[key] = value;
        } else {
          element.setAttribute(key, value);
        }
      });
    }
    function handle_children(children, element) {
      children.forEach(child => {
        if (child === undefined || child === null) {
          return
        } else if (typeof child === 'string' || typeof child === 'number') {
          element.appendChild(document.createTextNode(child));
        } else if (Array.isArray(child)) {
          child.map(({type, props, children}) => {
            element.appendChild(create_dom_nodes({type, props, children}));
          });
        } else {
          element.appendChild(create_dom_nodes({...child}));
        }
      });
    }
    function create_dom_nodes(node) {
      let {type, props, children} = node;
      if(type == 'Link') {
        const node = children[0];
        const element = document.createElement(node.type);
        if(node.type == 'a') {
          element.href = props.as ? props.as : props.href;
        }
        const base = props.href.split('?')[0];
        const query = parse_query(props.href);
        if(query) {
          routes[props.as] = routes[base].bind(null, {query});
          head[props.as] = head[base].bind(null, {query});
        }
        element.onclick = e => {
          e.preventDefault();
          window.history.pushState({query}, '', props.as || props.href);
          render_route(props.as || props.href, {query});
        };
        handle_props(node.props, element);
        handle_children(node.children, element);
        return element
      }
      const element = document.createElement(type);
      handle_props(props, element);
      handle_children(children, element);
      return element
    }
    function render_route(path, ctx={}) {
      const route_component = routes[path] ? routes[path](ctx) : routes['*']();
      const head_component = head[path] ? head[path](ctx): [];
      _head.set(Array.isArray(head_component)
        ? head_component.map(vnode => create_dom_nodes(vnode))
        : create_dom_nodes(head_component)
      );
      _container.innerHTML = '';
      _container.appendChild(create_dom_nodes(route_component));
    }
    render_initial(render_route)();
    render_route(get_pathname());
    window.onpopstate = () => {render_route(get_pathname());};
  }

  var index = Object.freeze({render, router});

  return index;

}());
