import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export function Authors() {
  const navigate = useNavigate();

  function handleCreateAuthor() {
    navigate("/authors/new");
  }

  return (
    <>
      <Helmet title="Autores" />
      <Header
        title="Biblioteca"
        subtitle="Explore e  gerencie todos os livros adicionados."
      >
        <Button className="font-bold" onClick={handleCreateAuthor}>
          <Plus />
          Add new
        </Button>
      </Header>
    </>
  );
}
