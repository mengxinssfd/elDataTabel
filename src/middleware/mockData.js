function random(start, end) {
  let num = end - start + 1
  return parseInt(Math.random() * num + start)
}

const typeList = [
  '前端组件',
  '测试子组件',
  '分布式工具',
  '应用服务',
  '数据存储'
]
const languageList = ['javascript', 'java', 'python']
const status = ['上架', '下架']
const len = 100
const list = []
for (let i = 0; i < len; i++) {
  list.push({
    id: i + 1,
    name: ['eTest组件', '通信服务', 'test', 'fsdfsdf', '6666'][random(0, 4)],
    type: typeList[random(0, typeList.length - 1)],
    version: '1.0.0',
    language: languageList[random(0, languageList.length - 1)],
    time: '1550577852970',
    status: status[random(0, 1)]
  })
}

export {list, typeList, status}
