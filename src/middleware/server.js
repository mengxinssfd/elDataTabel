import {list, typeList, status as statusList} from './mockData'

function getQueryObj(query) {
  return query.split('&').reduce((obj, item) => {
    let arr = item.split('=')
    obj[arr[0]] = arr[1]
    return obj
  }, {})
}

function search(req, res, query) {
  let size = +(query.size || 10)
  let page = +(query.page || 1)
  let type = query.type ? decodeURIComponent(query.type) : ''
  let status = query.status ? decodeURIComponent(query.status) : ''
  let name = query.name ? decodeURIComponent(query.name) : ''
  let start = (page - 1) * size
  let end = start + size
  let filterList = list.filter(i => {
    console.log(i.name, name, i.name.includes(name))
    return (
      i.name.includes(name) &&
      (!status || i.status === status) &&
      (!type || i.type === type)
    )
  })
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(
    JSON.stringify({
      code: 0,
      msg: 'ok',
      payload: {
        content: filterList.slice(start, end),
        totalElements: filterList.length // total count
      }
    })
  )
}

function getConfig(req, res, query) {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(
    JSON.stringify({
      code: 0,
      msg: 'ok',
      typeList,
      statusList
    })
  )
}

function getAllList(req, res, query) {
  let size = +(query.size || 10)
  let page = +(query.page || 1)
  let start = (page - 1) * size
  let end = start + size
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(
    JSON.stringify({
      code: 0,
      msg: 'ok',
      payload: {
        content: list.slice(start, end),
        totalElements: list.length // total count
      }
    })
  )
}

function update(data) {
  let target = list.find(i => i.id === +data.id)
  if (target) {
    Object.assign(target, data, {time: Date.now()})
  }
}

function updateStatus(data) {
  let target = list.find(i => i.id === +data.id)
  if (target) {
    target.status = data.status
  }
}

function create(data) {
  data.id = list[list.length - 1].id + 1
  data.time = Date.now()
  list.push(data)
}

function del(data) {
  let arr = data.data
  arr.forEach(i => {
    let listIndex = list.findIndex(item => i == item.id)
    if (listIndex > -1) {
      list.splice(listIndex, 1)
    }
  })
}

let match = {
  getAllList,
  getConfig,
  search,
  update,
  create,
  updateStatus,
  delete: del
}

function get(req, res, next) {
  let url = req._parsedUrl
  let pathname = url.pathname
  if (!/api\/(\w+)/.test(pathname)) {
    res.writeHead(404)
    res.end('')
    next()
    return
  }
  let query = getQueryObj(url.query)

  let fn = match[RegExp.$1]
  fn && fn(req, res, query)
  next()
}

function post(req, res, next) {
  let alldata = ''
  req.on('data', function(chunk) {
    alldata += chunk
  })

  req.on('end', function() {
    let data = JSON.parse(alldata)
    let url = req._parsedUrl
    let pathname = url.pathname
    console.log('ssssssssss', pathname)
    if (/api\/(\w+)/.test(pathname)) {
      let fn = match[RegExp.$1]
      fn && fn(data)
    }
    res.end('success')
    next()
  })
}

export default function(req, res, next) {
  let method = {post, get}[req.method.toLowerCase()]
  method ? method(req, res, next) : next()
}
