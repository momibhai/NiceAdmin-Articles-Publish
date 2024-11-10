import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req,res) {

    if(req.method === 'GET'){
        try{
            const articles = await prisma.article.findMany();
            return res.status(201).json({status:true, data:articles})
        }
        catch(error){
            console.error("Error while fetching Articles",error);
            return res.status(500).json({error:"Internal server error"});
        }
    }
    else{
        return json({fail:"not"});
    }
}