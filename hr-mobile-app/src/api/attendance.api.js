import { apiGet, apiPost } from './client'

/* =========================
   GET: Attendance รายเดือน
========================= */
export function fetchAttendanceByMonth({
  employeeId,
  year,
  month
}) {
  return apiGet('attendance', {
    employeeId,
    year,
    month
  })
}

/* =========================
   POST: Check In / Check Out
========================= */
export function submitCheckInOut({
  employeeId,
  date
}) {
  return apiPost('attendance', {
    employeeId,
    date
  })
}

/* =========================
   GET: Holidays รายเดือน
========================= */
export function fetchHolidaysByMonth({
  year,
  month
}) {
  return apiGet('holidays', {
    year,
    month
  })
}

/* =========================
   GET: Employee by ID
========================= */
export function fetchEmployeeById(employeeId) {
  return apiGet('employee', {
    employeeId
  })
}

/* =========================
   LEAVE API
========================= */

// ➜ ขอ Leave ตามเดือน (ใช้ใน SummaryTab)
export function fetchLeaveByMonth({employeeId, year, month}) {
  return apiGet('leave', {employeeId, year, month })
}

// ➜ ส่งคำขอลา
export function submitLeaveRequest(payload) {
  return apiPost('leave', payload)
}

// ➜ อนุมัติ / ปฏิเสธ
export function updateLeaveStatus(data) {
  return apiPost('leave-approve', data)
}

// ➜ ดูโควตาลา
export function fetchLeaveQuota({ employeeId }) {
  return apiGet('leaveQuota', { employeeId })
}

// ➜ ดูคำขอลา (manager view)
export function fetchLeaveRequests({
  employeeId,
  managerId
}) {
  return apiGet('leaveRequests', {
    employeeId,
    managerId
  })
}

// Check password
export function mobileLogin(employeeId, password) {
  return apiPost('login', {
    employeeId,
    password
  });
}

export function changePassword(payload) {
  return apiPost('changePassword', payload)
}