import React, { useRef } from "react"

import { useKeyPress } from "@/hooks"
import { ReactComponent as IconCancel } from "@/icons/IconCancel.svg"
import { ReactComponent as IconSearch } from "@/icons/IconSearch.svg"
import styles from "./SearchInput.module.css"

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSubmit"> {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  shortcutKey?: readonly string[]
}

const SearchInput = ({ onSubmit, shortcutKey = ["Control", "k"], ...rest }: SearchInputProps) => {
  const searchInput = useRef<HTMLInputElement>(null)

  // listen for keyboard shortcut
  useKeyPress(shortcutKey, () => {
    searchInput.current?.focus()
  })

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
        <button
          type="reset"
          aria-label="clear search"
          className={styles["reset-button"]}
          onClick={() => {
            // trigger React's onChange event by manually dispatching a new input event
            // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
            const nativeValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value"
            )?.set
            nativeValueSetter?.call(searchInput.current, "")
            const inputEvent = new Event("input", { bubbles: true })
            searchInput.current?.dispatchEvent(inputEvent)
          }}
        >
          <IconCancel />
        </button>
        <button type="submit" aria-label="search" className={styles["search-button"]}>
          <IconSearch />
        </button>
      </div>
    </form>
  )
}

export default SearchInput
