import { createOAuthAppAuth } from "@octokit/auth-oauth-app"
import cors from "cors"
import express, { Request, Response } from "express"
import morgan from "morgan"
import config from "./config"

const app = express()
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(morgan("tiny"))

const auth = createOAuthAppAuth({
  clientType: "oauth-app",
  clientId: config.GITHUB_OAUTH_CLIENT_ID,
  clientSecret: config.GITHUB_OAUTH_CLIENT_SECRET,
})

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello there!")
})

app.get("/signIn/callback", async (req: Request, res: Response) => {
  // /signIn/callback?=code=1232543152
  const { code } = req.query

  if (!code) {
    res.redirect("http://localhost:3000")
    // send({
    //   ok: false,
    //   error: "Error: no code in callback",
    // })
  }

  const userAuthFromWebFlow = await auth({
    type: "oauth-user",
    code: code as string,
    state: "myUniqueState12138",
  })

  res.status(200).json({
    success: true,
    data: {
      token: userAuthFromWebFlow.token,
    },
  })
})

let prevCode = ""
app.get("/getToken", async (req: Request, res: Response) => {
  const { code } = req.query

  // skip if got called with same code consecutively
  if (prevCode === code) return

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Error: no code is provided",
    })
  }

  prevCode = code as string
  try {
    const userAuth = await auth({
      type: "oauth-user",
      code: code as string,
      state: "myUniqueState12138",
    })

    res.status(200).json({
      success: true,
      data: {
        token: userAuth.token,
      },
    })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

app.get("/getToken/dev", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      token: "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",
    },
  })
})

app.listen(config.PORT, () => {
  console.log(`App running on port ${config.PORT}`)
})
