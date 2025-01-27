import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
// import { ApplicationViews } from "./views/ApplicationViews.jsx"
import App from "./App.jsx"

const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
