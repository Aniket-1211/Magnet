import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signinUser } from "../store/slices/authSlice";

const initialSignin = {
  email: "",
  password: ""
};

function SignInPage() {
  const [form, setForm] = useState(initialSignin);
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(signinUser(form)).unwrap();
      toast.success(response.message || "Signin successful");
      setForm(initialSignin);
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Signin failed");
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-white/25 bg-white/95 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.7)] backdrop-blur">
      <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
        Welcome back
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in to Magnet</h1>
      <p className="mt-2 text-sm text-slate-600">Use your account credentials to continue.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="auth-label" htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            className="auth-input"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="auth-label" htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            className="auth-input"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-500"
        >
          {authLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{" "}
        <Link className="font-semibold text-blue-700 underline underline-offset-4" to="/signup">
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default SignInPage;
