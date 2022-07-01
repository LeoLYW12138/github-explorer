import { useLocalStorage } from "@/hooks"
import { User } from "@/lib/github"
import { useLayoutEffect } from "react"
import { useSearchParams } from "react-router-dom"
import TokenAbsence from "../TokenAbsence"
import UserCard from "../UserCard"
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

  const handleSignOut = () => setToken(null)

  const user: User = {
    avatarUrl: "https://avatars.githubusercontent.com/u/52589810?s=48&v=4",
    login: "LeoLYW12138",
  }

  return (
    <main className={styles.main}>
      {token && (
        <UserCard user={user} className={styles.userCard} onSignOut={handleSignOut}></UserCard>
      )}
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
