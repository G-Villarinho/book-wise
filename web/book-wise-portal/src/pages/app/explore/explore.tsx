import { Header } from "@/components/header";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function Explore() {
  return (
    <>
      <Helmet title="Explorar" />
      <Header title="Explorar" icon={Search} />
    </>
  );
}
