import { setLocalStorage } from "@/hooks"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

function OauthCallback() {
  const [token, setToken] = useState(null)
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const code = query.get("code")

  useEffect(() => {
    fetch(`http://localhost:5000/getToken/${import.meta.env.DEV ? "dev" : ""}?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Bad request: code provided should be valid")
        return res.json()
      })
      .then((json) => {
        setToken(json.data.token)
        setLocalStorage("user-explorer:token", json.data.token)
        navigate("/", { replace: true })
      })
      .catch((error) => {
        console.error(error)
        navigate("/", { replace: true })
      })
  }, [])

  return <div>{token ? "Authenticated and redirecting you back to home page" : "Logging in"}</div>
}

export default OauthCallback
