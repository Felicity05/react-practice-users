import "./styles.css";
import { ExpensesPage } from "./expenses/ExpensesPage";

// Mock branch: only the exercise renders. The user directory and signup form are still on main.
export default function App() {
  return (
    <div className="App">
      <ExpensesPage />
    </div>
  );
}
