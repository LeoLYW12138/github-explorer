import { createOAuthAppAuth } from "@octokit/auth-oauth-app"
import { request } from "@octokit/request"

import cors from "cors"
import express, { Request, Response } from "express"
import morgan from "morgan"
import config from "./config"

const app = express()
const corsOptions = {
  origin: [config.FRONTEND_HOST],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(express.json())

const auth = createOAuthAppAuth({
  clientType: "oauth-app",
  clientId: config.GITHUB_OAUTH_CLIENT_ID,
  clientSecret: config.GITHUB_OAUTH_CLIENT_SECRET,
})

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello there!")
})

app.get("/oauth/callback", async (req: Request, res: Response) => {
  // /oauth/callback?code=1232543152
  const { code } = req.query

  if (!code) {
    console.error("No code in callback")
    res.redirect(`${config.FRONTEND_HOST}?token=${encodeURIComponent("__invalid__NO_CODE")}`)
    // send({
    //   ok: false,
    //   error: "Error: no code in callback",
    // })
  }

  try {
    const userAuthFromWebFlow = await auth({
      type: "oauth-user",
      code: code as string,
      state: config.GITHUB_OAUTH_UNIQUE_STATE,
    })

    console.log("Authenticated and redirect user to ", config.FRONTEND_HOST)
    res.redirect(`${config.FRONTEND_HOST}?token=${userAuthFromWebFlow.token}`)
    // res.status(200).json({
    //   success: true,
    //   data: {
    //     token: userAuthFromWebFlow.token,
    //   },
    // })
  } catch (error) {
    console.error("Error during authentication, redirecting user back to ", config.FRONTEND_HOST)
    res.redirect(`${config.FRONTEND_HOST}?token=${encodeURIComponent("__invalid__AUTH_ERROR")}`)
  }
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
      state: config.GITHUB_OAUTH_UNIQUE_STATE,
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
      token: process.env.GITHUB_OAUTH_TOKEN_DEV,
    },
  })
})

app.delete("/revoke", async (req: Request, res: Response) => {
  const { token } = req.body
  console.log(req.body)

  if (!token) {
    return res.sendStatus(400)
  }
  const result = await auth.hook(request, "DELETE /applications/{client_id}/grant", {
    client_id: config.GITHUB_OAUTH_CLIENT_ID,
    access_token: token,
  })

  res.sendStatus(result.status)
})

app.listen(config.PORT, () => {
  console.log(`App running on port ${config.PORT}`)
})
