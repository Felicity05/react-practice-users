// Practice: build the signup form here. Requirements are in src/signup/EXERCISE.md.
import { signup, SignupError } from "./signupApi";
import React, { useState } from "react";

type Field = "name" | "email" | "password";
type FieldErrors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "success";

const validate = (
  name: string,
  email: string,
  password: string,
): FieldErrors => {
  const errors: FieldErrors = {};
  if (name.trim() === "") errors.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email";
  if (password.length < 8)
    errors.password = "Password must be at least 8 characters";
  return errors;
};

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [welcomeName, setWelcomeName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return; // blocks a double submit

    const errorsFound = validate(name, email, password);
    setErrors(errorsFound);
    setFormError(null);
    if (Object.keys(errorsFound).length > 0) return; // no API call

    setStatus("submitting");
    try {
      const user = await signup({ name, email, password });
      setWelcomeName(user.name);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("idle"); // values stay, so they can retry
      if (err instanceof SignupError && err.field) {
        setErrors({ [err.field]: err.message }); // 422: under that field
      } else if (err instanceof SignupError) {
        setFormError(err.message); // 409: top of the form
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  if (status === "success") return <h2>Welcome, {welcomeName}!</h2>;

  return (
    <div
      style={{
        maxWidth: "500px",
        border: "3px solid #aa3bff",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <form className="signupForm" onSubmit={handleSubmit} noValidate>
        {formError && <p role="alert">{formError}</p>}
        <label style={{ padding: "5px" }} htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            value={name}
            style={{ marginLeft: "5px" }}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </label>
        {errors.name && <p id="name-error">{errors.name}</p>}
        <label style={{ padding: "5px" }} htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            value={email}
            style={{ marginLeft: "5px" }}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </label>
        {errors.email && <p id="email-error">{errors.email}</p>}
        <label style={{ padding: "5px" }} htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            value={password}
            style={{ marginLeft: "5px" }}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prevErrors) => ({
                ...prevErrors,
                password: undefined,
              }));
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </label>
        {errors.password && <p id="password-error">{errors.password}</p>}
        <button
          type="submit"
          style={{
            padding: "5px 15px",
            width: "fit-content",
            background: "#aa3bff",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            border: "none",
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
            margin: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
