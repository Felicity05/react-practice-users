import "./styles.css";
import { PostSearch } from "./mock/PostSearch";

// Mock branch: only the exercise renders, so the Network tab shows only its requests.
// The user directory and signup form are still in their files and on main.
export default function App() {
  return (
    <div className="App">
      <PostSearch />
    </div>
  );
}
