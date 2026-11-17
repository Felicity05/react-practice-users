import type {Role} from "./dummyApi";

export type User = {
  id: number;
  name: string;
  email: string;
  role: StaticRole | Role;
  details: string;
};

type StaticRole = "Engineer" | "Designer" | "Manager";

export const users: User[] = [
  { id: 1, name: "Anna", email: "anna@test.com", role: "Engineer", details: " lorem ipsum dolor sit amet" },
  { id: 2, name: "Ben", email: "ben@test.com", role: "Designer", details: "lorem ipsum dolor sit amet" },
  { id: 3, name: "Carlos", email: "carlos@test.com", role: "Engineer", details: "lorem ipsum dolor sit amet" },
  { id: 4, name: "Diana", email: "diana@test.com", role: "Manager", details: "lorem ipsum dolor sit amet" },
];
