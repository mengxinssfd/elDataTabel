/**
 * Created by levy on 2018/4/24.
 */
// 这里写页面路径
module.exports = function extendRoutes(routes, resolve) {
  routes.push({
    name: 'custom',
    path: '*',
    component: resolve(__dirname, '../pages/table.vue')
  })
}
