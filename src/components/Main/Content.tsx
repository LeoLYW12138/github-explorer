import { useState } from "react"

import { getRepos, RateLimit, Repository } from "@/lib/github"
import RepoCard from "../RepoCard"
import SearchBar, { Fields } from "../SearchBar"
import styles from "./Main.module.css"

interface ContentProps {
  token: string
}

function Content({ token }: ContentProps) {
  const [repos, setRepos] = useState([] as Repository[])
  const [rateLimit, setRateLimit] = useState({} as RateLimit)

  const handleSubmit = async ({ username, sortBy, numRepo }: Fields) => {
    const res = await getRepos(token, username, numRepo)
    if (!res) return
    const { repositories, rateLimit } = res
    setRepos(repositories)
    setRateLimit(rateLimit)

    console.log(repositories, rateLimit)
  }

  return (
    <>
      <SearchBar onSubmit={handleSubmit}></SearchBar>
      <div role="listbox" className={styles["repo-list"]}>
        {repos.map((repo) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
    </>
  )
}

export default Content
