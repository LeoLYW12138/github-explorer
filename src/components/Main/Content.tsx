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
  const [fields, setFields] = useState<Fields | null>(null)
  const [repos, setRepos] = useState([] as Repository[])
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const [pageInfo, setPageInfo] = useState<{
    pageInfos: Array<PageInfo>
    currPage: number
    totalPage: number
  } | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleError = (error?: { type: string; message: string }) => {
    if (!error) return

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

  const fetchRepo = async (args: Fields | null = null) => {
    if (!args) return
    const { username, sortBy, numRepo } = args
    // get repo
    const res = await getRepos(
      token,
      username,
      { field: sortBy, direction: SortDirections.DSC },
      numRepo,
      pageInfo ? pageInfo.pageInfos[pageInfo.currPage - 1].endCursor : null
    )
    console.log(res)
    if (!res) return
    const { repositories, pageInfo: cursors, totalCount, rateLimit, error } = res

    // append data
    repositories && setRepos((prev) => prev.concat(repositories))
    rateLimit && setRateLimit(rateLimit)
    // append pageInfo
    cursors &&
      totalCount &&
      setPageInfo((prev) => {
        // first fetch
        if (!prev)
          return {
            pageInfos: [cursors],
            currPage: 1,
            totalPage: Math.ceil(totalCount / numRepo),
          }

        return {
          ...prev,
          currPage: prev.currPage + 1,
          pageInfos: [...prev.pageInfos, cursors],
        }
      })

    // handleError
    handleError(error)
    await new Promise((resolve) => setTimeout(() => resolve(null), 100))
  }

  const handleSubmit = async ({ username, sortBy, numRepo }: Fields) => {
    try {
      setError("")
      setIsLoading(true)
      setFields({ username, sortBy, numRepo })
      await fetchRepo({ username, sortBy, numRepo })
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.search("Could not resolve to a User with the login of") !== -1)
          setError(`User "${username}" not found`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePage = async (page: number) => {
    // do not change page if the same
    if (!pageInfo || page === pageInfo?.currPage) return

    setIsLoading(true)
    const { currPage } = pageInfo
    if (page > currPage) {
      // fetch until reached target page
      // note this will change pageInfo state
      for (let i = 0; i < page - currPage; i++) await fetchRepo(fields)

      setIsLoading(false)
      return
    }

    // set current page to target page
    setPageInfo((prev) => ({
      // prev should not be null at this point
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...prev!,
      currPage: page,
    }))
    setIsLoading(false)
  }

  const repoList = (() => {
    if (repos.length === 0 || !fields) return []

    if (!pageInfo?.currPage) return repos

    const startIndex = (pageInfo.currPage - 1) * fields.numRepo
    return repos.slice(startIndex, startIndex + fields.numRepo)
  })()

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
        {repoList.map((repo) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </div>
      {pageInfo && (
        <Pagination
          numPages={pageInfo.totalPage}
          currPage={pageInfo.currPage}
          onChangePage={handleChangePage}
        />
      )}
    </>
  )
}

export default Content
