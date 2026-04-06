import request from '../utils/request'

export function getCourseList(params?: any) {
  return request.get('/courses', { params })
}

export function createCourse(data: any) {
  return request.post('/courses', data)
}

export function updateCourse(id: number, data: any) {
  return request.put(`/courses/${id}`, data)
}

export function deleteCourse(id: number) {
  return request.delete(`/courses/${id}`)
}

export function toggleCourseStatus(id: number) {
  return request.patch(`/courses/${id}/status`)
}