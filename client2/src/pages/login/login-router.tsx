
import { LoginForm } from "./Login";
import { RegisterForm } from "./Register";

export const loginRouter = [
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "register",
    element: <RegisterForm />
  }
];