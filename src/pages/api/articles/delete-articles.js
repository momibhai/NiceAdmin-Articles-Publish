import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body; // Extract id from the request body

    if (!id) {
      return res.status(400).json({ error: "Article ID is required" });
    }

    try {
      // Fetch the article with the image path
      const article = await prisma.article.findUnique({
        where: { id: id },
        select: { image: true }, // Only get the image path
      });

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Delete the article from the database
      const deletedArticle = await prisma.article.delete({
        where: { id: id },
      });

      // Construct the full image file path
      const imagePath = path.join(process.cwd(), "public", article.image);

      // Check if the image exists and delete it
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Image deleted: ${imagePath}`);
      } else {
        console.log(`Image not found: ${imagePath}`);
      }

      return res.status(200).json({
        status: true,
        message: "Article and image deleted successfully",
        deletedArticle,
      });
    } catch (error) {
      console.error("Error while deleting Article:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
