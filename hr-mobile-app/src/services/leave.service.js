/**
 * แปลง leave array → object keyed by YYYY-MM-DD
 */
export function mapLeavesByDate(apiData = []) {
  const result = {};

  if (!Array.isArray(apiData)) return result;

  apiData.forEach(row => {
    if (!row.date) return;

    result[row.date] = {
      type: 'LEAVE',
      leaveType: row.leaveType
    };
  });

  return result;
}

/**
 * แปลง pending leave สำหรับ RequestTab
 */
export function mapPendingLeaves(apiData = []) {
  if (!Array.isArray(apiData)) return [];

  return apiData.map(item => ({
    id: item.id,
    leaveType: item.leaveType,
    from: item.from,
    to: item.to,
    status: item.status
  }));
}

/**
 * แปลง leave balance สำหรับ progress bar
 */
export function mapLeaveBalance(apiData = {}) {
  return Object.entries(apiData).map(([key, value]) => ({
    key,
    used: value.used,
    total: value.total,
    remaining: value.total - value.used
  }));
}
