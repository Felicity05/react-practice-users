import "./styles.css";
import { OrdersPage } from "./orders/OrdersPage";

// Mock branch: only the exercise renders. The user directory and signup form are still on main.
export default function App() {
  return (
    <div className="App">
      <OrdersPage />
    </div>
  );
}
