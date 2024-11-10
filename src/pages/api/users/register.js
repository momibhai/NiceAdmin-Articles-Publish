import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Ensure bcryptjs is used

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Hash the password using bcryptjs
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create a new record in the 'user' table
      const newUser = await prisma.User.create({
        data: { email, password: hashedPassword },
      });

      // Return the newly created user data with a 201 status code
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      // Return a 500 status code in case of an error
      return res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    // Return a 405 status code if the method is not POST
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
