import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm";

export function Signup() {
  const navigate = useNavigate();

  async function handleSignup(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    const res = await fetch("http://127.0.0.1:8000/api/user/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      navigate("/login");
    } if(res.status === 404) {
      navigate("/signup");
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  );
}
