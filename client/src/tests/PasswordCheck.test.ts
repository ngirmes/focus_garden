import { expect, test } from "vitest";

function checkPassword(password: string) {
  const expressions: RegExp[] = [/[A-Z]/, /[a-z]/, /\d/, /\W/];
  for (const expression of expressions) {
    if (!expression.test(password)) return false;
  }
  return true;
}

const password = "Test1@";
test("Test1@ should pass and return true", () => {
  expect(checkPassword(password)).toBe(true);
});
