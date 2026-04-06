import request from '../utils/request'

export function getStudentList(params?: any) {
  return request.get('/students', { params })
}

export function createStudent(data: any) {
  return request.post('/students', data)
}

export function updateStudent(id: number, data: any) {
  return request.put(`/students/${id}`, data)
}

export function deleteStudent(id: number) {
  return request.delete(`/students/${id}`)
}