import { Header } from "@/components/header";
import { LayoutDashboard } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function Home() {
  return (
    <>
      <Helmet title="Home" />
      <Header title="Início" icon={LayoutDashboard} />
    </>
  );
}
