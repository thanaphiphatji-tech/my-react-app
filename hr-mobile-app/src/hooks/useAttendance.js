import { useEffect, useState, useCallback } from 'react';
import {
  fetchAttendanceByMonth,
  submitCheckInOut
} from '../api/attendance.api';
import { mapAttendanceByDate } from '../services/attendance.service';

/**
 * Attendance Hook
 * โหลดข้อมูลรายเดือน + check in / check out
 */
export function useAttendance({ employeeId, year, month }) {

  const [attendanceByDate, setAttendanceByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  /* =========================================
     LOAD MONTH DATA
  ========================================= */

  const loadAttendance = useCallback(async () => {

    if (!employeeId || !year || !month) return;

    try {

      setLoading(true);
      setError(null);

      const res = await fetchAttendanceByMonth({
        employeeId,
        year,
        month
      });

      if (!Array.isArray(res)) {
        throw new Error('Invalid attendance format');
      }

      const mapped = mapAttendanceByDate(res);
      setAttendanceByDate(mapped);

    } catch (err) {

      console.error('Load attendance error:', err);
      setError(err.message || 'Load attendance failed');
      setAttendanceByDate({});

    } finally {
      setLoading(false);
    }

  }, [employeeId, year, month]);


  /* =========================================
     AUTO LOAD WHEN MOUNT / MONTH CHANGE
  ========================================= */

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);


  /* =========================================
     CHECK IN / CHECK OUT
  ========================================= */

  const checkInOut = useCallback(async () => {

    if (!employeeId) return null;

    try {

      setLoading(true);
      setError(null);

      // yyyy-MM-dd (timezone safe)
      const today = new Date();
      const date = today.toLocaleDateString('sv-SE');

      const result = await submitCheckInOut({
        employeeId,
        date
      });

      if (!result) {
        throw new Error('Submit failed');
      }

      // reload month data after submit
      await loadAttendance();

      return result;

    } catch (err) {

      console.error('CheckInOut error:', err);
      setError(err.message || 'Submit failed');
      return null; // ❗ ไม่ throw เพื่อไม่ให้ UI crash

    } finally {
      setLoading(false);
    }

  }, [employeeId, loadAttendance]);


  /* =========================================
     MANUAL REFRESH
  ========================================= */

  const refresh = useCallback(() => {
    loadAttendance();
  }, [loadAttendance]);


  /* =========================================
     RETURN
  ========================================= */

  return {
    attendanceByDate,
    loading,
    error,
    checkInOut,
    refresh
  };
}
