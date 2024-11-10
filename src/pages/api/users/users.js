import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Email and password are required." });
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ success: false, error: "Email already in use." });
      }

      // Hash the new password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user in the database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error("Error creating user:", error);

      // Handle Prisma's unique constraint violation error
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ success: false, error: "Email already in use." });
      }

      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === 'GET') {
    try {
      // Get page and limit from query parameters, with defaults
      const { page = 1, limit = 5 } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      // Fetch the total number of users
      const totalUsers = await prisma.user.count();

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);

      // Fetch the users for the current page
      const users = await prisma.user.findMany({
        skip: (pageNumber - 1) * pageSize, // Skip the users from previous pages
        take: pageSize,                    // Limit the number of users fetched
        orderBy: { id: 'asc' },            // Order by id (or any other field)
      });

      // Return the users along with pagination data
      res.status(200).json({
        data: users,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
 
}