import { HomePage } from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import CreatePage from "./pages/CreatePage";

const AppRoutes = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: '/order',
    element: <OrderPage />
  },
  {
    path: '/create',
    element: <CreatePage />
  },
  {
    path: '/edit',
    element: <CreatePage />
  }
];

export default AppRoutes;
