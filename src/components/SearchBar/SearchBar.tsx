import type { option } from "@/components/Dropdown"
import { useId } from "react"
import Dropdown from "../Dropdown"
import styles from "./SearchBar.module.css"
import SearchInput from "./SearchInput"

const SearchBar = () => {
  const options: option[] = [
    { id: useId(), name: "Name", value: "name" },
    { id: useId(), name: "Last update", value: "last-update" },
    { id: useId(), name: "Stars", value: "stars" },
    { id: useId(), name: "Forks", value: "forks" },
  ]
  return (
    <div className={styles.searchBar}>
      <SearchInput />
      <Dropdown options={options} defaultOption={options[0]} desc="Sort by"></Dropdown>
    </div>
  )
}

export default SearchBar
