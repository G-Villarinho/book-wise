import { Header } from "@/components/header";
import { User } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function Profile() {
  return (
    <>
      <Helmet title="Perfil" />
      <Header title="Explorar" icon={User} />
    </>
  );
}
