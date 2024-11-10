import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;  // Get the user ID from the query parameter

  // Handle the PUT request (Update User)
  if (req.method === 'PUT') {
    const { email, password } = req.body;

    try {
      // Ensure at least one field is provided for update
      if (!email && !password) {
        return res.status(400).json({ success: false, message: 'Email or password must be provided' });
      }

      // Prepare data object for update
      const updateData = {};
      if (email) updateData.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        updateData.password = hashedPassword;
      }

      // Update the user's email and/or password in the database
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Handle the DELETE request (Delete User)
  if (req.method === 'DELETE') {
    try {
      // Attempt to delete the user by ID
      const user = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ success: true, message: 'User deleted successfully', user });
    } catch (error) {
      console.error('Error deleting user:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  }

  // Handle the PATCH request (Update User Role)
  if (req.method === 'PATCH') {
    const { user_role } = req.body;

    try {
      // Ensure the role is provided
      if (!id || !user_role) {
        return res.status(400).json({ success: false, message: 'User ID and role are required' });
      }

      // Update the user's role in the database
      const updatedUserPermission = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { user_role }
      });

      return res.status(200).json({ success: true, data: updatedUserPermission });
    } catch (error) {
      console.error('Error updating user role:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Method not allowed for other HTTP verbs
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
