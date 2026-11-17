// Mock signup API. Do not edit while practicing — treat it like a real server.
//
// Deterministic scenarios (pick by email):
//   taken@test.com   -> rejects with SignupError, status 409, "That email is already registered"
//   invalid@test.com -> rejects with SignupError, status 422, field "email", "Email domain is not allowed"
//   fail@test.com    -> rejects with a plain Error("Network error") (simulates a dropped connection)
//   slow@test.com    -> succeeds after 3000 ms (use it to test double submits)
//   anything else    -> succeeds after 800 ms

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  id: number;
  name: string;
  email: string;
};

export class SignupError extends Error {
  status: number;
  field?: keyof SignupRequest;

  constructor(message: string, status: number, field?: keyof SignupRequest) {
    super(message);
    this.name = "SignupError";
    this.status = status;
    this.field = field;
  }
}

let nextId = 1;
export let signupCallCount = 0; // lets you check you never submit twice

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup(request: SignupRequest): Promise<SignupResponse> {
  signupCallCount += 1;
  const email = request.email.trim().toLowerCase();

  await wait(email === "slow@test.com" ? 3000 : 800);

  if (email === "taken@test.com") {
    throw new SignupError("That email is already registered", 409);
  }
  if (email === "invalid@test.com") {
    throw new SignupError("Email domain is not allowed", 422, "email");
  }
  if (email === "fail@test.com") {
    throw new Error("Network error");
  }

  return { id: nextId++, name: request.name.trim(), email };
}
