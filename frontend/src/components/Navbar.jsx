import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { selectProfileIsEditing } from "../store/slices/profileSlice";

function Navbar({ token, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isEditingProfile = useSelector(selectProfileIsEditing);

  const handleBlockedNav = (event) => {
    if (!isEditingProfile) return;
    event.preventDefault();
    toast.warn("Please click Submit to update profile before leaving.");
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, token]);

  const navItemClass = ({ isActive }) =>
    [
      "inline-flex items-center rounded-full px-5 py-2 text-base font-semibold tracking-wide transition-all duration-200",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
      isActive ? "text-white" : "text-slate-800 hover:text-slate-900",
      isEditingProfile ? "pointer-events-none opacity-50" : ""
    ].join(" ");

  const mobileNavItemClass = ({ isActive }) =>
    [
      "block rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
      isActive ? "bg-emerald-700/30 text-white" : "text-slate-800 hover:bg-white/60",
      isEditingProfile ? "pointer-events-none opacity-50" : ""
    ].join(" ");

  return (
    <header className="sticky top-0 z-20 border-b border-[#8E977D]/60 bg-gradient-to-r from-[#8E977D] via-[#A8B596] to-[#D8E2C8] shadow-[0_10px_40px_-20px_rgba(62,72,49,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_25%,rgba(255,255,255,0.42),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(214,226,200,0.36),transparent_40%)]" />
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-slate-900">Magnet</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/50 p-2 text-slate-800 shadow-sm transition hover:bg-white/70 sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <div className="hidden items-center gap-1.5 rounded-full bg-transparent p-1.5 sm:flex">
          {token ? (
            <>
              <NavLink
                to="/"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                Home
              </NavLink>
              <NavLink
                to="/cart"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                Cart
              </NavLink>
              <NavLink
                to="/orders"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                  Profile
                </span>
              </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isEditingProfile}
                  className="inline-flex items-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-[0_6px_18px_-8px_rgba(225,29,72,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Logout
                </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                Signin
              </NavLink>
              <NavLink
                to="/signup"
                className={navItemClass}
                onClick={handleBlockedNav}
                aria-disabled={isEditingProfile}
                tabIndex={isEditingProfile ? -1 : 0}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="relative border-t border-white/30 bg-white/25 px-4 pb-4 pt-3 backdrop-blur sm:hidden">
          <div className="mx-auto w-full max-w-6xl space-y-2">
            {token ? (
              <>
                <NavLink
                  to="/"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/cart"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  Cart
                </NavLink>
                <NavLink
                  to="/orders"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/profile"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="8" r="4" />
                    </svg>
                    Profile
                  </span>
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isEditingProfile}
                  className="mt-1 w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/signin"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  Signin
                </NavLink>
                <NavLink
                  to="/signup"
                  className={mobileNavItemClass}
                  onClick={handleBlockedNav}
                  aria-disabled={isEditingProfile}
                  tabIndex={isEditingProfile ? -1 : 0}
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
