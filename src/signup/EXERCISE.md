# Signup form — timed practice (target: 30 minutes)

Build `SignupForm` in `SignupForm.tsx`. Call `signup()` from `signupApi.ts` — don't edit the API.
Work in priority order. Get each feature working in the browser before starting the next.

## Features (priority order)

1. **Fields.** Name, Email, Password, and a "Create account" button. Every input has a visible label.
2. **Submit.** Pressing the button or Enter calls `signup()` with the values. The page must not reload.
3. **Client validation (on submit).** Show an error under each field that fails:
   - Name: required (spaces only counts as empty)
   - Email: required, must look like an email
   - Password: at least 8 characters
   Don't call the API if any field is invalid.
4. **Submitting state.** While the request is in flight, the button says "Creating account..." and is disabled. A user must not be able to submit twice.
5. **Success.** Replace the form with "Welcome, {name}!" using the name the API returns.
6. **Server errors.**
   - 409 (`taken@test.com`): show the message near the top of the form.
   - 422 with a `field` (`invalid@test.com`): show the message under that field.
   - Any other error (`fail@test.com`): show "Something went wrong. Please try again."
   Keep everything the user typed. They can fix it and submit again.
7. **Clear an error when the user edits that field.**
8. **Accessibility.** Errors are linked to their inputs (`aria-describedby`), invalid inputs have `aria-invalid`, and the form-level error is announced (`role="alert"`).

## Stretch (only if time remains)

- Validate a field when it loses focus (`onBlur`), not only on submit.
- A "Show password" toggle button.
- Move the validation into a pure `validate(values)` function and explain why that's easier to test.

## Check it like the interviewers will

| Do this | Expect |
| --- | --- |
| Submit the empty form | Three errors, no API call |
| Name = "   " | Name error |
| Email = "anna" | Email error |
| Valid form, `anna@test.com` | Button disabled + "Creating account...", then "Welcome, …!" |
| `slow@test.com`, click the button 5 times fast | Only one request |
| `taken@test.com` | Form-level message; values kept |
| `invalid@test.com` | Message under Email |
| `fail@test.com` | Generic message; you can retry |
| Type in a field that has an error | That error disappears |

## Say out loud while you build

- What state you need and why (and what you don't need to store).
- How you type the status (hint: a union, not several booleans).
- Why the caught error is `unknown`, and how you narrow it.
