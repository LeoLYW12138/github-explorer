import { useState } from "react"
import { useSearchParams } from "react-router-dom"

function SignIn() {
  const [token, setToken] = useState("")
  const [query] = useSearchParams()
  const code = query.get("code")

  console.log(code)
  fetch(`http://localhost:5000/getToken?code=${code}`)
    .then((res) => {
      if (!res.ok) throw new Error("")
      return res.json()
    })
    .then(({ data }) => setToken(data.token))
    .catch(console.error)

  return <div>{token}</div>
}

export default SignIn
