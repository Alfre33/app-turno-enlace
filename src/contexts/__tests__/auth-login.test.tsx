import React from "react";
import { render, act } from "@testing-library/react-native";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: (_auth: any, cb: any) => { cb(null); return () => {}; },
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
}));
jest.mock("@/src/libs/firebase", () => ({ auth: {} as any }));

const { signInWithEmailAndPassword } = jest.requireMock("firebase/auth");

test("login llama a Firebase", async () => {
  (signInWithEmailAndPassword as jest.Mock)
  .mockResolvedValue({ user: { emailVerified: true } });


  let loginFn!: (p: { email: string; password: string }) => Promise<void>;
  const Grabber = () => { loginFn = useAuthContext().login; return null; };

  render(<AuthProvider><Grabber /></AuthProvider>);

  await act(async () => {
    await expect(loginFn({ email: "a@b.com", password: "123456" })).resolves.toBeUndefined();
  });

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "a@b.com", "123456");
});

test("login propaga error si Firebase rechaza", async () => {
  (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({ code: "auth/invalid-credential" });

  let loginFn!: (p: { email: string; password: string }) => Promise<void>;
  const Grabber = () => { loginFn = useAuthContext().login; return null; };

  render(<AuthProvider><Grabber /></AuthProvider>);

  await act(async () => {
    await expect(loginFn({ email: "a@b.com", password: "bad" })).rejects.toBeDefined();
  });
});
