import SearchBar from "@/components/SearchBar"
import styles from "./Main.module.css"

function Main() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <SearchBar></SearchBar>
      </div>
    </main>
  )
}

export default Main
