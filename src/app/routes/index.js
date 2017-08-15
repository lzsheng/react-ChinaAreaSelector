
const routes = [
  {
    path: '/pc',
    getComponents: (a, cb) => import("../../component/ChinaAreaSelectorPC/demo").then(mod => cb(null, mod.default))
  },
  {
    path: '/mobile',
    getComponents: (a, cb) => import("../../component/ChinaAreaSelector/demo").then(mod => cb(null, mod.default))
  }
]

export default routes
