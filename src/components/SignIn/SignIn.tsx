import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

function SignIn() {
  const [token, setToken] = useState("")
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const code = query.get("code")

  useEffect(() => {
    fetch(`http://localhost:5000/getToken/dev?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("")
        return res.json()
      })
      .then((json) => {
        setToken(json.data.token)
        console.log(json.data.token)
        navigate("/", { replace: true })
      })
      .catch((error) => {
        console.error(error)
        navigate("/", { replace: true })
      })
  }, [])

  return <div>Logging in</div>
}

export default SignIn
