import React, { useRef } from "react"

import { useKeyPress } from "@/hooks"
import { ReactComponent as IconSearch } from "@/icons/IconSearch.svg"
import styles from "./SearchInput.module.css"

export interface SearchInputProps {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  shortcutKey?: readonly string[]
}

const SearchInput = ({
  onSubmit,
  shortcutKey = ["Control", "k"],
  ...rest
}: SearchInputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const searchInput = useRef<HTMLInputElement>(null)
  useKeyPress(
    shortcutKey,
    () => {
      searchInput.current?.focus()
    },
    true
  )

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit && onSubmit(e)
  }

  return (
    <form onSubmit={formOnSubmit}>
      {/* <label htmlFor="search" className={styles.label}>
        Search:
      </label> */}
      <div className={styles.search}>
        <input type="search" ref={searchInput} className={styles.input} {...rest} />
        <button type="submit" className={styles["search-button"]}>
          <IconSearch />
        </button>
      </div>
    </form>
  )
}

export default SearchInput
