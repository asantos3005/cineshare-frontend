import { Route, Routes } from "react-router";
import AddReview from "./pages/AddReview";
import Home from "./pages/Home";
import StandardLayout from "./layouts/StandardLayout";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
        <Routes>
          <Route element={<StandardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reviews/add" element={<AddReview />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      
    </>
    
  );
}
