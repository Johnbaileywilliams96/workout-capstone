import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ApplicationViews } from "./views/ApplicationViews";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Authorized } from "./views/Authorized";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="*"
                element={
                    <Authorized>
                        <ApplicationViews />
                    </Authorized>
                }
            />
        </Routes>
    );
}

export default App;
