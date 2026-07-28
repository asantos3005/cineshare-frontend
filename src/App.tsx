import { Route, Routes } from "react-router";
import MenuDrawer from "./components/Drawer";
import Home from "./pages/Home";

export default function App() {
  return (
    <main className="px-7 bg-neutral-100">
      <MenuDrawer />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
}