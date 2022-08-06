import request from '@/utils/request'

// 查询任务列表
export function qingBoPlanlist(query) {
  return request({
    url: '/api/v1/sys-business',
    method: 'get',
    params: query
  })
}

// 新增个人任务列表
export function addqingBoPlanlist(data) {
  return request({
    url: '/api/v1/sys-business',
    method: 'post',
    data: data
  })
}

// 修改个人任务
export function upqingBoPlan(data) {
  return request({
    url: '/api/v1/sys-business',
    method: 'put',
    data: data
  })
}

// 删除个人任务
export function deleteqingBoPlan(data) {
  return request({
    url: '/api/v1/sys-business',
    method: 'delete',
    data: data
  })
}

// 新增公司任务列表
export function addqingBoPlanInsertlist(data) {
  return request({
    url: '/api/v1/sys-business/insert-list',
    method: 'post',
    data: data
  })
}

// 查询公司名列表
export function qingBoCompanylist(query) {
  return request({
    url: '/api/v1/sys-company-list',
    method: 'get',
    params: query
  })
}

// 新增公司
export function addqingBoCompanyName(data) {
  return request({
    url: '/api/v1/sys-company-list',
    method: 'post',
    data: data
  })
}

// 删除公司名
export function deleteCompanyName(data) {
  return request({
    url: '/api/v1/sys-company-list',
    method: 'delete',
    data: data
  })
}

// 上传excel
export function uploadExcel(data) {
  return request({
    url: '/api/v1/sys-business/upload-excel',
    method: 'post',
    data: data
  })
}
