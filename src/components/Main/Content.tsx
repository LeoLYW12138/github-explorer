import { useState } from "react"

import { ReactComponent as IconCancel } from "@/icons/IconCancel.svg"
import { getRepos, RateLimit, Repository, SortDirections } from "@/lib/github"
import { PageInfo } from "@/lib/github/graphql"
import Loading from "../Loading"
import Pagination from "../Pagination"
import RepoCard from "../RepoCard"
import SearchBar, { Fields } from "../SearchBar"
import styles from "./Main.module.css"

interface ContentProps {
  token: string
}

function Content({ token }: ContentProps) {
  const [repos, setRepos] = useState([] as Repository[])
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const [pageInfo, setPageInfo] = useState<
    (PageInfo & { totalPage: number; currPage: number }) | null
  >(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async ({ username, sortBy, numRepo }: Fields) => {
    try {
      setError("")
      setIsLoading(true)
      const res = await getRepos(
        token,
        username,
        { field: sortBy, direction: SortDirections.DSC },
        numRepo
      )
      console.log(res)
      if (!res) return
      const { repositories, pageInfo: cursors, totalCount, rateLimit, error } = res
      repositories && setRepos(repositories)
      rateLimit && setRateLimit(rateLimit)
      cursors &&
        totalCount &&
        setPageInfo({ ...cursors, totalPage: Math.ceil(totalCount / numRepo), currPage: 1 })

      if (error) {
        if (error.type === "NOT_FOUND") {
          const matches = error.message.match(
            /Could not resolve to an? (\w+) with the login of '(\w*)'/
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SearchBar onSubmit={handleSubmit} rateLimit={rateLimit}></SearchBar>
      <div className={styles["error-container"]}>
        {error && (
          <p className={styles.error}>
            {error} <IconCancel style={{ fontSize: "1.5em" }} onClick={() => setError("")} />
          </p>
        )}
      </div>
      <div role="listbox" aria-label="Repository list" className={styles["repo-list"]}>
        {isLoading && <Loading />}
        {repos.map((repo) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
      {pageInfo && (
        <Pagination
          numPages={pageInfo.totalPage}
          currPage={pageInfo.currPage}
          onChangePage={(page) => {}}
        />
      )}
    </>
  )
}

export default Content
