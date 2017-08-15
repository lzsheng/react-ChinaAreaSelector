
const routes = [
  {
    path: '/',
    getComponents: (a, cb) => import("../../component/ChinaAreaSelectorPC/demo").then(mod => cb(null, mod.default))
  }
]

export default routes
