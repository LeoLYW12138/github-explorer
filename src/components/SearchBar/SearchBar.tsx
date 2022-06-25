import { useId, useState } from "react"

import type { option } from "@/components/Dropdown"
import Dropdown from "../Dropdown"
import styles from "./SearchBar.module.css"
import SearchInput from "./SearchInput"

const SearchBar = () => {
  const [username, setUsername] = useState("")
  const options: option[] = [
    { id: useId(), name: "Name", value: "name" },
    { id: useId(), name: "Last update", value: "last-update" },
    { id: useId(), name: "Stars", value: "stars" },
    { id: useId(), name: "Forks", value: "forks" },
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
      <Dropdown options={options} defaultOption={options[0]} desc="Sort by"></Dropdown>
    </div>
  )
}

export default SearchBar
