import { Window } from "./components/right_window";
import { VariantKB } from "./components/variant_kb";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./components/token_input";
import { VariantSM } from "./components/variant_sm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/tasks",
    element: <Window />,
  },
  {
    path: "/mistakes",
    element: <Window />,
  },
  {
    path: "/skills",
    element: <Window />,
  },
  {
    path: "/variant_kb",
    element: <VariantKB />,
  },
  {
    path: "/variant_sm",
    element: <VariantSM />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
