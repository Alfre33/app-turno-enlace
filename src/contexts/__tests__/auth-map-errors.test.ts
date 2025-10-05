import { mapFirebaseError } from "@/contexts/AuthContext";

test("credenciales inválidas", () => {
  expect(mapFirebaseError("auth/invalid-credential")).toMatch(/incorrectos/);
  expect(mapFirebaseError("auth/wrong-password")).toMatch(/incorrectos/);
});

test("expiración de token", () => {
  expect(mapFirebaseError("auth/id-token-expired")).toMatch(/sesión expiró/i);
  expect(mapFirebaseError("auth/token-expired")).toMatch(/sesión expiró/i);
});
