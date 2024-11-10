import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.otp === otp && user.otpExpiry > new Date()) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear OTP fields
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp: null,
          otpExpiry: null,
        },
      });

      return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
}
