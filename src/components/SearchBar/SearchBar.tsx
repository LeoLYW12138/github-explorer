import { useId, useState } from "react"

import type { options } from "@/components/Dropdown"
import Dropdown from "../Dropdown"
import styles from "./SearchBar.module.css"
import SearchInput from "./SearchInput"

const SearchBar = () => {
  const [username, setUsername] = useState("")
  const sortOptions: options = [
    { id: useId(), name: "Name", value: "name" },
    { id: useId(), name: "Last update", value: "last-update" },
    { id: useId(), name: "Stars", value: "stars" },
    { id: useId(), name: "Forks", value: "forks" },
  ]
  const numInPageOptions: options = [
    { id: useId(), name: "5", value: "5" },
    { id: useId(), name: "10", value: "10" },
    { id: useId(), name: "20", value: "20" },
    { id: useId(), name: "30", value: "30" },
  ]

  return (
    <div className={styles.searchBar}>
      <SearchInput
        id="github-username"
        name="github-username"
        placeholder="Search User"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onSubmit={() => console.log(username)}
      />
      <Dropdown
        className={styles["dropdown-sort"]}
        iconType="sort"
        options={sortOptions}
        defaultOption={sortOptions[0]}
        desc="Sort by"
        onSelect={(option) => console.log(option.name)}
      ></Dropdown>
      <Dropdown
        className={styles["dropdown-repo"]}
        iconType="number"
        options={numInPageOptions}
        defaultOption={numInPageOptions[0]}
        suffix=" repos"
        desc="# Repo in one page"
      ></Dropdown>
    </div>
  )
}

export default SearchBar
