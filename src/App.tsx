import "./styles.css";
import { TicketsPage } from "./tickets/TicketsPage";

// Mock branch: only the exercise renders. The user directory and signup form are still on main.
export default function App() {
  return (
    <div className="App">
      <TicketsPage />
    </div>
  );
}
