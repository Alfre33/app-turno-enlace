import { Redirect } from "expo-router";

export default function Index() {
  // aquí puedes poner tu lógica real de sesión
  const isLoggedIn = false;

  return <Redirect href={"/login"} />;
}