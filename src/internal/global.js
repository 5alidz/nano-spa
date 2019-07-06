function noop() {}

export default {
  root: undefined,
  routes: {},
  head: {},
  methods: {
    on_route_unmount: noop,
    on_route_mount: noop
  },
  handlers: {},
  cache: [],
  route_cache: {},
  head_cache: {},
}
