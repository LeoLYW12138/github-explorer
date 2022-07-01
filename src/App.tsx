import Intro from "@/components/Intro"
import Main from "@/components/Main"
import "./App.css"

function App() {
  return (
    <>
      <Intro />
      <Main />
      <footer className="footer">
        <p>{new Date().getFullYear()} &copy; LeoLYW12138</p>
      </footer>
    </>
  )
}

export default App
