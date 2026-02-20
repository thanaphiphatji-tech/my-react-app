import { apiGet } from './client';

/**
 * ดึงรายการวันลาของพนักงาน (ตามเดือน)
 * ใช้สำหรับ:
 * - Summary (dot / detail)
 * - หน้า Request (รายการที่รออนุมัติ)
 */
export function fetchLeavesByMonth({
  employeeId,
  year,
  month // 1-12
}) {
  return apiGet('/leaves', {
    employeeId,
    year,
    month
  });
}

/**
 * ดึงคำขอลาที่ยังไม่อนุมัติ
 * (ใช้ในหน้า RequestTab)
 */
export function fetchPendingLeaves({ employeeId }) {
  return apiGet('/leaves/pending', {
    employeeId
  });
}

/**
 * ดึงสิทธิ์วันลาคงเหลือ
 * (progress bar)
 */
export function fetchLeaveBalance({ employeeId }) {
  return apiGet('/leaves/balance', {
    employeeId
  });
}
