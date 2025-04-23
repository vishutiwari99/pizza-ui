import { createBrowserRouter } from "react-router-dom";
import Categories from "./pages/Categories";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
]);
