import { useState } from "react"

import { ReactComponent as IconCancel } from "@/icons/IconCancel.svg"
import { getRepos, RateLimit, Repository, SortDirections } from "@/lib/github"
import RepoCard from "../RepoCard"
import SearchBar, { Fields } from "../SearchBar"
import styles from "./Main.module.css"

interface ContentProps {
  token: string
}

function Content({ token }: ContentProps) {
  const [repos, setRepos] = useState([] as Repository[])
  const [rateLimit, setRateLimit] = useState({} as RateLimit)
  const [error, setError] = useState("")

  const handleSubmit = async ({ username, sortBy, numRepo }: Fields) => {
    try {
      setError("")
      const res = await getRepos(
        token,
        username,
        { field: sortBy, direction: SortDirections.DSC },
        numRepo
      )
      if (!res) return
      const { repositories, rateLimit, error } = res
      repositories && setRepos(repositories)
      rateLimit && setRateLimit(rateLimit)

      if (error) {
        if (error.type === "NOT_FOUND") {
          const matches = error.message.match(
            /Could not resolve to a (\w+) with the login of '(\w*)'/
          )
          if (matches) {
            const [, entity, name] = [...matches]
            setError(`${entity} "${name}" not found`)
          }
        } else {
          setError(error.message)
        }
      }

      console.log(repositories, rateLimit)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.search("Could not resolve to a User with the login of") !== -1)
          setError(`User "${username}" not found`)
      }
    }
  }

  return (
    <>
      <SearchBar onSubmit={handleSubmit}></SearchBar>
      <div className={styles["error-container"]}>
        {error && (
          <p className={styles.error}>
            {error} <IconCancel style={{ fontSize: "1.5em" }} onClick={() => setError("")} />
          </p>
        )}
      </div>
      <div role="listbox" className={styles["repo-list"]}>
        {repos.map((repo) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
    </>
  )
}

export default Content
