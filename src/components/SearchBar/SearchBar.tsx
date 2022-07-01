import { useId, useState } from "react"

import type { options } from "@/components/Dropdown"
import { SortOptions } from "@/lib/github"
import Dropdown from "../Dropdown"
import styles from "./SearchBar.module.css"
import SearchInput from "./SearchInput"

export type Fields = {
  username: string
  sortBy: string
  numRepo: number
}
interface SearchBarProps {
  onSubmit: (fields: Fields) => void
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const [username, setUsername] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [numRepo, setNumRepo] = useState(0)

  const sortOptions: options<string> = [
    { id: useId(), name: "Name", value: SortOptions.NAME },
    { id: useId(), name: "Last update", value: SortOptions.LAST_UPDATE },
    { id: useId(), name: "Stars", value: SortOptions.STAR },
    { id: useId(), name: "Forks", value: "forks" },
  ]
  const numInPageOptions: options<number> = [
    { id: useId(), value: 5 },
    { id: useId(), value: 10 },
    { id: useId(), value: 20 },
    { id: useId(), value: 30 },
  ]

  const handleSubmit = () => {
    onSubmit({ username, sortBy, numRepo })
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
