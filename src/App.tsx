import { Route, Routes } from "react-router";
import AddReview from "./pages/AddReview";
import Home from "./pages/Home";
import StandardLayout from "./layouts/StandardLayout";
import NotFoundPage from "./pages/NotFoundPage";
import MyReviews from "./pages/MyReviews";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
        <Routes>
          <Route element={<StandardLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />

              <Route path="/reviews">
                <Route index element={<MyReviews />} />
                <Route path="add-review" element={<AddReview />} />
              </Route>

              <Route path="/profile/:username" element={<Profile />} />
            </Route>
          <Route path="*" element={<NotFoundPage />} />

            
            
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          
        </Routes>
      
    </>
    
  );
}
