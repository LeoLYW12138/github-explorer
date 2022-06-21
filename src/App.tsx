import SearchBar from "@/components/SearchBar"
import { getRepos } from "@/lib/github"
import { useEffect, useState } from "react"

function App() {
  const [result, setResult] = useState("")

  useEffect(() => {
    getRepos("leolyw12138", 2).then((res) => setResult(JSON.stringify(res, null, 2)))
  }, [])
  return (
    <>
      <SearchBar></SearchBar>
      <pre>{result}</pre>
    </>
  )
}

export default App
