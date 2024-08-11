import { PrismaClient } from "@prisma/client"
import express,{Request, Response} from "express"

const app = express();
app.use(express.json());

const client = new PrismaClient();

app.get("/",async (req: Request, res: Response) => {
  res.json({
    message: "We have received response",
  })
})

app.post("/",async (req: Request, res: Response) => {
  await client.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    }
  })

  res.json({
    message: "Stuff is done"
  })
})

app.listen(3000);