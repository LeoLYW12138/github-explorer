import { useId, useState } from "react"

import type { options } from "@/components/Dropdown"
import { getRepos } from "@/lib/github"
import Dropdown from "../Dropdown"
import styles from "./SearchBar.module.css"
import SearchInput from "./SearchInput"

const SearchBar = () => {
  const [username, setUsername] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [numRepo, setNumRepo] = useState(0)

  const sortOptions: options<string> = [
    { id: useId(), name: "Name", value: "name" },
    { id: useId(), name: "Last update", value: "last-update" },
    { id: useId(), name: "Stars", value: "stars" },
    { id: useId(), name: "Forks", value: "forks" },
  ]
  const numInPageOptions: options<number> = [
    { id: useId(), value: 5 },
    { id: useId(), value: 10 },
    { id: useId(), value: 20 },
    { id: useId(), value: 30 },
  ]

  const handleSubmit = async () => {
    const res = await getRepos("", username)
    if (!res) return
    const { repositories, rateLimit } = res
    console.log(repositories, rateLimit)
  }

  return (
    <div className={styles.searchBar}>
      <SearchInput
        id="github-username"
        name="github-username"
        placeholder="Search User"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onSubmit={handleSubmit}
      />
      <Dropdown
        className={styles["dropdown-sort"]}
        iconType="sort"
        options={sortOptions}
        defaultOption={sortOptions[0]}
        desc="Sort by"
        onSelect={(option) => setSortBy(option.value)}
      ></Dropdown>
      <Dropdown
        className={styles["dropdown-repo"]}
        iconType="number"
        options={numInPageOptions}
        defaultOption={numInPageOptions[1]}
        suffix=" repos"
        desc="# Repo in one page"
        onSelect={(option) => setNumRepo(option.value)}
      ></Dropdown>
    </div>
  )
}

export default SearchBar
