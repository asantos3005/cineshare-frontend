import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import StandardLayout from "./layouts/StandardLayout";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <main className="px-7 bg-neutral-100">
      <Routes>
        <Route element={<StandardLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}