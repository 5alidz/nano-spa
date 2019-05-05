var nano_spa = (function () {
  'use strict';

  var n = function(t,r,u,e){for(var p=1;p<r.length;p++){var s=r[p++],a="number"==typeof s?u[s]:s;1===r[p]?e[0]=a:2===r[p]?(e[1]=e[1]||{})[r[++p]]=a:3===r[p]?e[1]=Object.assign(e[1]||{},a):e.push(r[p]?t.apply(null,n(t,a,u,["",null])):a);}return e},t=function(n){for(var t,r,u=1,e="",p="",s=[0],a=function(n){1===u&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(n||e,0):3===u&&(n||e)?(s.push(n||e,1),u=2):2===u&&"..."===e&&n?s.push(n,3):2===u&&e&&!n?s.push(!0,2,e):4===u&&r&&(s.push(n||e,2,r),r=""),e="";},f=0;f<n.length;f++){f&&(1===u&&a(),a(f));for(var h=0;h<n[f].length;h++)t=n[f][h],1===u?"<"===t?(a(),s=[s],u=3):e+=t:p?t===p?p="":e+=t:'"'===t||"'"===t?p=t:">"===t?(a(),u=1):u&&("="===t?(u=4,r=e,e=""):"/"===t?(a(),3===u&&(s=s[0]),u=s,(s=s[0]).push(u,4),u=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(a(),u=2):e+=t);}return a(),s},r="function"==typeof Map,u=r?new Map:{},e=r?function(n){var r=u.get(n);return r||u.set(n,r=t(n)),r}:function(n){for(var r="",e=0;e<n.length;e++)r+=n[e].length+"-"+n[e];return u[r]||(u[r]=t(n))};function htm(t){var r=n(this,e(t),arguments,[]);return r.length>1?r:r[0]}

  const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('');

  var render = htm.bind(function create_element(type, props, ...children) {
    const node = {type, props, children};
    node.props = node.props || {};
    function handle_custom_element(_node) {
      const new_node = _node.type(_node.props)();
      return create_element(
        new_node.type,
        new_node.props,
        ...new_node.children.concat(_node.children)
      )
    }
    if(node.props.style) node.props.style = minify_style(node.props.style);
    return typeof type === 'function' ? handle_custom_element(node) : node
  });

  function create_dom_nodes(node) {
    let {type, props, children} = node;
    const element = document.createElement(type);
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });
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
    return element
  }

  function render_route(container, routes, path) {
    const route_component = routes[path] ? routes[path]() : routes['*']();
    container.innerHTML = '';
    container.appendChild(create_dom_nodes(route_component));
  }
  function router(_container, config) {
    const {_config, ...routes} = config;
    const initial_nav_elements = Array.from(document.querySelectorAll('.spa-nav'));
    const nav_onclick = dom_element => dom_element.onclick = e => {
      e.preventDefault();
      window.history.pushState({}, '', dom_element.href);
      render_route(_container, routes, window.location.pathname);
    };
    initial_nav_elements.map(nav_onclick);
    render_route(_container, routes, window.location.pathname);
    window.onpopstate = () =>
      // handle back and forward history.
      render_route(_container, routes, window.location.pathname);
  }

  var index = Object.freeze({render, router});

  return index;

}());
