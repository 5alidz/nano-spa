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

  function handle_props(props, element) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value;
      } else if(key === 'use_state'){
        return
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
          element.appendChild(
            create_dom_nodes.call(this, {type, props, children})
          );
        });
      } else {
        element.appendChild(
          create_dom_nodes.call(this, {...child})
        );
      }
    });
  }

  function create_dom_nodes(node) {
    let {type, props, children} = node;
    const children_with_handlers = handle_children.bind(this);
    if(type === 'Link') { return this['LINK'](node) }
    if(type === '__PROMISE__') { return this['PROMISE'](node) }
    const element = document.createElement(type);
    handle_props(props, element);
    children_with_handlers(children, element);
    return element
  }

  const init_root = (root) => {
    return {
      replace_with(dom_node) {
        root.innerHTML = '';
        root.appendChild(dom_node);
      },
      root
    }
  };

  const init_head = (components={}) => {
    let prev_head = [];
    const head = document.head;
    const default_head = components['*'];
    if(default_head) {
      const rendered = default_head();
      if(Array.isArray(rendered)) {
        rendered.map(vnode => head.appendChild(create_dom_nodes(vnode)));
      } else {
        head.appendChild(create_dom_nodes(rendered));
      }
    }
    return {
      set(route) {
        if(!components[route]) {
          prev_head.map(node => head.removeChild(node));
          prev_head = [];
          return
        }
        prev_head.map(dom_node => head.removeChild(dom_node));
        const rendered = components[route] ? components[route]() : undefined;
        if(!rendered) {return}
        if(Array.isArray(rendered)) {
          const nodes = rendered.map(vnode => create_dom_nodes(vnode));
          prev_head = nodes;
          nodes.map(dom_node => head.appendChild(dom_node));
        } else {
          const node = create_dom_nodes(rendered);
          prev_head = [node];
          head.appendChild(node);
        }
      }
    }
  };

  const init_routes = (routes, root_handler, head_handler, methods) => {
    const NOT_FOUND = routes['*']
      ? routes['*']
      : () => render`<h1 style='text-align: center;'>404</h1>`;

    const handlers = {
      'PROMISE': (node) => {
        const { props } = node;
        const { placeholder, ..._props } = props.promise.props;
        const new_node = props.promise.type(_props);
        const _placeholder = placeholder();
        const element = create_dom_nodes(_placeholder);
        new_node.then(_node => {
          element.parentNode.replaceChild(create_dom_nodes(_node), element);
        });
        return element
      },
      'LINK': (node) => {
        const target = node.children[0];
        const element = create_dom_nodes(target);
        const href = node.props.href;
        const match_href = href.split('/').filter(_ => _);
        const source = Object.keys(routes).reduce((acc, curr) => {
          const match_arr = curr.split('*').map(s => s.replace(/\//g, ''));
          if(match_arr.length === match_href.length) {
            acc.src = '/' + match_arr.map(el => !el ? '*' : el).join('/');
            acc.params = match_href.filter(s => match_arr.indexOf(s) === -1);
            return acc
          } else {return acc}
        }, {});
        element.href = href;
        element.onclick = e => {
          e.preventDefault();
          methods['on_route_unmount']&&methods['on_route_unmount'](
            window.location.pathname,
            root_handler.root.children[0]
          );
          window.history.pushState({}, '', href);
          head_handler.set(href);
          const route_component = routes[href]
            ? routes[href]()
            : routes[source.src]
              ? routes[source.src](source.params)
              : NOT_FOUND();
          const route_dom = create_dom_nodes(route_component);
          methods['on_route_mount']&&methods['on_route_mount'](href, route_dom);
          root_handler.replace_with(route_dom);
        };
        return element
      }
    };

    return {
      get: (route) => {
        if(routes[route]) {
          return create_dom_nodes.call(handlers, routes[route]())
        } else {
          return create_dom_nodes(NOT_FOUND())
        }
      }
    }
  };

  const init_render_route = (
    root_handler,
    head_handler,
    route_handler,
    methods
  ) => {
    return (route) => {
      const route_dom = route_handler.get(route);
      head_handler.set(route);
      root_handler.replace_with(route_dom);
      methods['on_route_mount']&&methods['on_route_mount'](route, route_dom);
    }
  };

  const current_path = () => window.location.pathname;

  const bind_initial = (render_route, root_handler, methods) => {
    document.querySelectorAll('.LINK').forEach(link => {
      link.onclick = function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if(current_path() === href) {return}
        methods['on_route_unmount']&&methods['on_route_unmount'](
          current_path(),
          root_handler.root.children[0]
        );
        window.history.pushState({}, '', href);
        render_route(href);
      };
    });
  };

  function router(o) {
    const { root, routes, head, methods } = o;

    const root_handler = init_root(root);
    const head_handler = init_head(head);
    const route_handler = init_routes(routes, root_handler, head_handler, methods);
    const render_route = init_render_route(
      root_handler,
      head_handler,
      route_handler,
      methods
    );

    bind_initial(render_route, root_handler, methods);

    render_route(current_path());

    window.onpopstate = () => {
      methods['on_route_unmount']&&methods['on_route_unmount'](
        window.location.pathname,
        root_handler.root.children[0]
      );
      render_route(current_path());
    };
  }

  var index = Object.freeze({render, router});

  return index;

}());
