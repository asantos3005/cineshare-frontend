import { Route, Routes } from "react-router";
import AddReview from "./pages/AddReview";
import Home from "./pages/Home";
import StandardLayout from "./layouts/StandardLayout";
import NotFoundPage from "./pages/NotFoundPage";
import MyReviews from "./pages/MyReviews";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <>
        <Routes>
          <Route element={<StandardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFoundPage />} />

            <Route path="/reviews">
              <Route index element={<MyReviews />} />
              <Route path="add-review" element={<AddReview />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            
          </Route>

          
        </Routes>
      
    </>
    
  );
}
