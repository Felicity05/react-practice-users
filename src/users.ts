export type User = {
  id: number;
  name: string;
  email: string;
  role: "Engineer" | "Designer" | "Manager";
};

export const users: User[] = [
  { id: 1, name: "Anna", email: "anna@test.com", role: "Engineer" },
  { id: 2, name: "Ben", email: "ben@test.com", role: "Designer" },
  { id: 3, name: "Carlos", email: "carlos@test.com", role: "Engineer" },
  { id: 4, name: "Diana", email: "diana@test.com", role: "Manager" },
];
