import type { option } from "@/components/Dropdown"
import Dropdown from "@/components/Dropdown"
import SearchBar from "@/components/SearchBar"
import { useId } from "react"
import styles from "./Main.module.css"

function Main() {
  const options: option = [
    { id: useId(), name: "Name", value: "name" },
    { id: useId(), name: "Last update", value: "last-update" },
    { id: useId(), name: "Stars", value: "stars" },
    { id: useId(), name: "Forks", value: "forks" },
  ]
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <SearchBar></SearchBar>
        <Dropdown options={options} defaultValue={options[0]}></Dropdown>
      </div>
    </main>
  )
}

export default Main
