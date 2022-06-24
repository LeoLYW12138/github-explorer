import { useKeyPress } from "@/hooks"
import { ReactComponent as IconSearch } from "@/icons/IconSearch.svg"
import React, { useRef, useState } from "react"
import styles from "./SearchInput.module.css"

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("")
  const searchInput = useRef<HTMLInputElement>(null)
  useKeyPress(
    ["Control", "k"],
    () => {
      searchInput.current?.focus()
    },
    true
  )

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(searchValue)
  }

  return (
    <form onSubmit={formOnSubmit}>
      {/* <label htmlFor="search" className={styles.label}>
        Search:
      </label> */}
      <div className={styles.search}>
        <input
          type="search"
          name="search"
          id="search"
          ref={searchInput}
          className={styles.input}
          placeholder="Search User"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit" className={styles["search-button"]}>
          <IconSearch />
        </button>
      </div>
    </form>
  )
}

export default SearchInput
