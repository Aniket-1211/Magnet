import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectAuthToken } from "../store/slices/authSlice";
import {
  fetchProfile,
  selectProfileIsEditing,
  selectProfileError,
  selectProfileStatus,
  selectProfileUpdateError,
  selectProfileUpdateStatus,
  selectProfileUser,
  setProfileEditing,
  updateProfile
} from "../store/slices/profileSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectProfileUser);
  const status = useSelector(selectProfileStatus);
  const error = useSelector(selectProfileError);
  const isEditing = useSelector(selectProfileIsEditing);
  const updateStatus = useSelector(selectProfileUpdateStatus);
  const updateError = useSelector(selectProfileUpdateError);
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const editableKeys = useMemo(() => new Set(["firstName", "lastName", "email", "phone"]), []);
  const validators = useMemo(
    () => ({
      firstName: (value) => {
        if (!value?.trim()) return "First name is required.";
        if (value.trim().length < 2) return "First name must be at least 2 characters.";
        if (value.trim().length > 60) return "First name must be 60 characters or less.";
        return "";
      },
      lastName: (value) => {
        if (!value?.trim()) return "Last name is required.";
        if (value.trim().length < 1) return "Last name must be at least 1 character.";
        if (value.trim().length > 60) return "Last name must be 60 characters or less.";
        return "";
      },
      email: (value) => {
        if (!value?.trim()) return "Email is required.";
        const normalized = value.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(normalized)) return "Enter a valid email address.";
        return "";
      },
      phone: (value) => {
        const digits = (value || "").replace(/[^\d]/g, "");
        if (digits.length !== 10) return "Phone number must be exactly 10 digits.";
        return "";
      }
    }),
    []
  );

  const validateField = (key, value) => (validators[key] ? validators[key](value) : "");
  const isFormValid = useMemo(() => {
    if (!isEditing) return true;
    return !Object.values(formErrors).some(Boolean);
  }, [formErrors, isEditing]);

  useEffect(() => {
    dispatch(fetchProfile(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(user);
      setFormErrors({});
    }
  }, [user, isEditing]);

  const handleToggleEdit = () => {
    if (!isEditing) {
      setFormData(user || {});
      const initialErrors = {};
      editableKeys.forEach((key) => {
        initialErrors[key] = validateField(key, user?.[key] ?? "");
      });
      setFormErrors(initialErrors);
      dispatch(setProfileEditing(true));
      return;
    }

    const hasErrors = Object.values(formErrors).some(Boolean);
    if (hasErrors) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    const payload = {};
    editableKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(formData || {}, key)) {
        payload[key] = typeof formData[key] === "string" ? formData[key].trim() : formData[key];
      }
    });

    dispatch(updateProfile({ token, payload }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to update profile");
      });
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...(prev || {}), [key]: value }));
    if (editableKeys.has(key)) {
      setFormErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/40 bg-white/85 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Profile</h1>
        </div>
        <button
          type="button"
          onClick={handleToggleEdit}
          disabled={updateStatus === "loading" || (isEditing && !isFormValid)}
          className={`rounded-full px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_-12px_rgba(16,185,129,0.8)] transition disabled:cursor-not-allowed disabled:opacity-70 ${
            isEditing ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
          }`}
        >
          {isEditing ? (updateStatus === "loading" ? "Submitting..." : "Submit") : "Update"}
        </button>
      </div>

      {status === "loading" ? <p className="mt-6 text-center text-sm text-slate-600">Loading profile...</p> : null}
      {status === "failed" ? <p className="mt-6 text-center text-sm font-semibold text-rose-700">{error}</p> : null}
      {updateStatus === "failed" ? <p className="mt-4 text-center text-sm font-semibold text-rose-700">{updateError}</p> : null}

      {status === "succeeded" && (formData || user) ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(formData || user).map(([key, value]) => {
            const isEditable = isEditing && editableKeys.has(key);
            const inputType = key.toLowerCase().includes("email")
              ? "email"
              : key.toLowerCase().includes("phone")
                ? "tel"
                : "text";
            const fieldError = formErrors[key];

            const displayValue =
              (key === "createdAt" || key === "updatedAt") && value
                ? new Date(value).toLocaleDateString()
                : String(value);

            return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</p>
              {isEditable ? (
                <>
                  <input
                    type={inputType}
                    value={value ?? ""}
                    onChange={(event) => handleChange(key, event.target.value)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                      fieldError
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
                    }`}
                  />
                  {fieldError ? <p className="mt-2 text-xs font-medium text-rose-600">{fieldError}</p> : null}
                </>
              ) : (
                <p className="mt-2 text-sm font-semibold text-slate-900">{displayValue}</p>
              )}
            </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default ProfilePage;
