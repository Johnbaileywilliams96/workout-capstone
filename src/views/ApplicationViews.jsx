import { Outlet, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { NavBar } from "../components/navbar/NavBar"
import { WorkoutLog } from "../components/WorkoutLog/WorkoutLog"
import { CommunityFeed } from "../components/CommunityFeed/CommunityFeed"
import { Profile } from "../components/Profile/Profile"
import { PostDetails } from "../components/PostDetails.jsx/PostDetails"



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
                <Route index element={<WorkoutLog currentUser={currentUser} />} />
               <Route path="workoutLog">
                    <Route index element={<WorkoutLog currentUser={currentUser} />} />
                </Route>
                <Route path="communityFeed">
                    <Route index element={<CommunityFeed currentUser={currentUser} />} />
                </Route>
                <Route path="postDetails/:postId">
                    <Route index element={<PostDetails currentUser={currentUser} />} />
                </Route>
                <Route path="profile">
                    <Route index element={<Profile currentUser={currentUser} />} />
                </Route>
            </Route>
        </Routes>
    )
}