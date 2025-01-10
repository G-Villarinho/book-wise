import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { SearchInput } from "./search-input";

export function Search() {
  return (
    <div>
      <Helmet title="Catálago" />
      <Header
        title="Catálago de Livros"
        subtitle="Explore e adicione os livros de seu interesse ao portal."
      >
        <SearchInput />
      </Header>
      <div className="mt-4">
        <h1></h1>
      </div>
    </div>
  );
}
