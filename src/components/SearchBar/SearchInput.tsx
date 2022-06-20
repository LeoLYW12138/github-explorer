import React, { useState } from "react"

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("")

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(searchInput)
  }

  return (
    <form onSubmit={formOnSubmit}>
      <label htmlFor="search">Search:</label>
      <input
        type="search"
        name="search"
        id="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchInput
