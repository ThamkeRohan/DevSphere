import { Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import { PostProvider } from "./pages/ViewPost/PostContext";
import { useAuth } from "./contexts/AuthContext";
import SearchPosts from "./pages/SearchPosts";
import ViewPost from "./pages/ViewPost";
import SignUp from "./pages/SignUp/index";
import Login from "./pages/Login";
import FollowTags from "./pages/FollowTags";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewProfile from "./pages/ViewProfile";
import Notifications from "./pages/Notifications";
import PrivateRoutes from "./components/PrivateRoutes";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import UserFollowers from "./pages/UserFollowers";
import UserFollowings from "./pages/UserFollowings";
import Home from "./pages/Home";
import Tags from "./pages/Tags";
import BookmarkedPosts from "./pages/BookmarketPosts";

function App() {
  const loggedInUser = useAuth();
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={!loggedInUser ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!loggedInUser ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/followTags"
          element={
            !loggedInUser ? (
              <Navigate to="/login" />
            ) : !loggedInUser.areTagsFollowed ? (
              <FollowTags />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route element={<PrivateRoutes />}>
        
          <Route path="/" element={<Home />} />

          <Route path="/search" element={<SearchPosts />} />

          <Route path="/posts/new" element={<CreatePost />} />

          <Route path="/posts/:postId/edit" element={<EditPost />} />

          <Route
            path="/posts/:postId"
            element={
              <PostProvider>
                <ViewPost />
              </PostProvider>
            }
          />

          <Route path="/users/:userId/profile" element={<ViewProfile />} />

          <Route path="/users/:userId/editProfile" element={<EditProfile />} />

          <Route path="/users/:userId/followers" element={<UserFollowers />} />

          <Route
            path="/users/:userId/followings"
            element={<UserFollowings />}
          />

          <Route path="/tags" element={<Tags />} />

          <Route path="/bookmarkedPosts" element={<BookmarkedPosts />} />

          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
