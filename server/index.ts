import { createOAuthAppAuth } from "@octokit/auth-oauth-app"
import cors from "cors"
import type { Request, Response } from "express"
import express from "express"
import config from "./config"

const app = express()
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

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

  res.status(200).send({
    ok: true,
    data: {
      token: userAuthFromWebFlow.token,
    },
  })
})

app.get("/getToken", async (req: Request, res: Response) => {
  const { code } = req.query
  console.log(code)
  if (!code) {
    res.status(400).send({
      ok: false,
      error: "Error: no code is provided",
    })
  }

  try {
    const userAuth = await auth({
      type: "oauth-user",
      code: code as string,
      state: "myUniqueState12138",
    })

    res.status(200).send({
      ok: true,
      data: {
        token: userAuth.token,
      },
    })
  } catch (err) {
    res.status(400).send({ ok: false, err })
  }
})

app.listen(config.PORT, () => {
  console.log(`App running on port ${config.PORT}`)
})
