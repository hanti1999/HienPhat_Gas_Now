const moment = require('moment');

const checkTokenExpiry = (expiry: string | null) => {
  const now = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
  // Lấy timestamp từ chuỗi để so sánh
  const nowTimestamp = new Date(now).getTime();
  const expiryTimestamp = new Date(expiry as string).getTime();
  console.log(nowTimestamp);
  console.log(expiryTimestamp);

  return expiryTimestamp > nowTimestamp;
};

export default checkTokenExpiry;
