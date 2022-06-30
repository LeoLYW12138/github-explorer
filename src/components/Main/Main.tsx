import { useLocalStorage } from "@/hooks"
import { useLayoutEffect } from "react"
import { useSearchParams } from "react-router-dom"
import TokenAbsence from "../TokenAbsence"
import Content from "./Content"
import styles from "./Main.module.css"

function Main() {
  const [query, setQuery] = useSearchParams()
  const [token, setToken] = useLocalStorage("user-explorer:token", null)

  let tokenInvalid = true
  useLayoutEffect(() => {
    const newToken = query.get("token")
    tokenInvalid = newToken === null || newToken.startsWith("__invalid__")
    if (tokenInvalid) return

    setToken(newToken)
    setQuery({}, { replace: true })
  }, [query])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {token === null && tokenInvalid ? (
          <TokenAbsence token={token}></TokenAbsence>
        ) : (
          <Content token={token}></Content>
        )}
      </div>
    </main>
  )
}

export default Main
