async function generateOTP(length) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    const number = Math.floor(Math.random() * 10); // ✅ fixed
    otp += number;
  }
  return otp;
}

export default generateOTP;
