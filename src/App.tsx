import "./styles.css";
import { UserList } from "./UserList";
import { SignupForm } from "./signup/SignupForm";

export default function App() {
  return (
    <div className="App">
      <SignupForm />
      <hr />
      {/*<UserList />*/}
    </div>
  );
}
