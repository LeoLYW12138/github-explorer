import Intro from "@/components/Intro"
import SearchBar from "@/components/SearchBar"
import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [result, setResult] = useState("")

  useEffect(() => {
    // logIn()
    // getRepos("leolyw12138", 2).then((res) => setResult(JSON.stringify(res, null, 2)))
  }, [])

  return (
    <>
      <Intro />
      <SearchBar></SearchBar>
      <pre>{result}</pre>
    </>
  )
}

export default App
