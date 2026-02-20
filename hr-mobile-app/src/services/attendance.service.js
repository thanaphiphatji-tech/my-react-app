export function mapAttendanceByDate(apiData = []) {
  const result = {};

  apiData.forEach(row => {
    result[row.date] = {
      type: row.type,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      totalHours: row.totalHours
    };
  });

  return result;
}