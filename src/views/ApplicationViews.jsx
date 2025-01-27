import { Outlet, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { NavBar } from "../components/navbar/NavBar"
import { WorkoutLog } from "../components/WorkoutLog/WorkoutLog"



export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({})



    useEffect(() => {
      const localLearningUser = localStorage.getItem("users_user")
      const learningUserObject = JSON.parse(localLearningUser)
      setCurrentUser(learningUserObject)
    }, [])


    return (
        <Routes>
            <Route path="/" element={
                <>
                    <NavBar />
                    <Outlet />
                </>
            }>
               <Route path="workoutLog">
                    <Route index element={<WorkoutLog currentUser={currentUser} />} />
                </Route>
            </Route>
        </Routes>
    )
}