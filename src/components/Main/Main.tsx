import { useLocalStorage } from "@/hooks"
import { getUser, User } from "@/lib/github"
import { useEffect, useLayoutEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import TokenAbsence from "../TokenAbsence"
import UserCard from "../UserCard"
import Content from "./Content"
import styles from "./Main.module.css"

function Main() {
  const [query, setQuery] = useSearchParams()
  const [token, setToken] = useLocalStorage("user-explorer:token", null)
  const [user, setUser] = useState({} as User)

  let tokenInvalid = true
  useLayoutEffect(() => {
    const newToken = query.get("token")
    tokenInvalid = newToken === null || newToken.startsWith("__invalid__")
    if (tokenInvalid) return

    setToken(newToken)
    setQuery({}, { replace: true })
  }, [query])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser(token)
      if (!res) return
      const { user } = res
      user && setUser(user)
    }

    fetchUser()
  }, [token])

  const handleSignOut = () => setToken(null)

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
