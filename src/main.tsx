import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter, Route, Routes } from "react-router-dom"

import OauthCallback from "@/components/OauthCallback"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/oauth/callback" element={<OauthCallback />}></Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
