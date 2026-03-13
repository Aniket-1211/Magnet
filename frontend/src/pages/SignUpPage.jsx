import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signupUser } from "../store/slices/authSlice";

const initialSignup = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: ""
};

function SignUpPage() {
  const [form, setForm] = useState(initialSignup);
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
      if (form.password.trim().length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      const response = await dispatch(signupUser(form)).unwrap();
      toast.success(response.message || "Signup successful");
      setForm(initialSignup);
      navigate("/");
    } catch (error) {
      const message =
        typeof error === "string" ? error : error?.message || "Signup failed";
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-3xl border border-white/25 bg-white/95 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.7)] backdrop-blur">
      <p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
        Join Magnet
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-600">Start by entering your basic details.</p>

      <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="auth-label" htmlFor="signup-firstName">First name</label>
          <input
            id="signup-firstName"
            className="auth-input"
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="auth-label" htmlFor="signup-lastName">Last name</label>
          <input
            id="signup-lastName"
            className="auth-input"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="auth-label" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
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
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            className="auth-input"
            name="password"
            type="password"
            placeholder="Choose a strong password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="auth-label" htmlFor="signup-phone">Phone</label>
          <input
            id="signup-phone"
            className="auth-input"
            name="phone"
            placeholder="Optional"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-teal-600 hover:to-emerald-500"
          >
            {authLoading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-teal-700 underline underline-offset-4" to="/signin">
          Sign in
        </Link>
      </p>
    </section>
  );
}

export default SignUpPage;
