import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { SearchBookResponse } from "@/@types/search-book-response";

const bookSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  totalPages: z
    .number()
    .min(1, { message: "Total de páginas deve ser maior que 0" }),
  description: z.string(),
  coverImageURL: z.string().url(),
  authors: z.array(
    z.object({
      name: z.string().min(1, { message: "Nome do autor é obrigatório" }),
    })
  ),
  categories: z.array(
    z.object({
      name: z.string().min(1, { message: "Categoria é obrigatório" }),
    })
  ),
});

export type BookSchemaData = z.infer<typeof bookSchema>;

interface CreateBookFormProps {
  book: SearchBookResponse;
}

export function CreateBookForm({ book }: CreateBookFormProps) {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<BookSchemaData>({
    resolver: zodResolver(bookSchema),
  });

  const {
    fields: authorsFields,
    append: appendAuthor,
    remove: removeAuthor,
  } = useFieldArray({
    control,
    name: "authors",
  });

  const {
    fields: categoriesFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        totalPages: book.totalPages,
        description: book.description,
        coverImageURL: book.coverImageURL,
        authors: book.authors.map((author) => ({ name: author })),
        categories: book.categories.map((category) => ({ name: category })),
      });
    }
  }, [book, reset]);

  const onSubmit = (data: BookSchemaData) => {
    console.log("Dados do livro enviados:", data);
    reset(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 grid grid-cols-2 gap-4 px-12"
    >
      <div className="flex flex-col gap-1">
        <label>Título</label>
        <Input
          {...register("title")}
          placeholder="Insira um novo título para o livro"
          className="border p-2"
        />
        <p>{errors.title?.message}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label>Total de Páginas</label>
        <Input
          {...register("totalPages", { valueAsNumber: true })}
          placeholder="Insira o total de páginas do livro"
          type="number"
          className="border p-2"
        />
        <p>{errors.totalPages?.message}</p>
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>Descrição</label>
        <Textarea
          {...register("description")}
          placeholder="Descrição do livro"
          className="border p-2"
        />
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>URL da Capa</label>
        <Input
          {...register("coverImageURL")}
          placeholder="URL da imagem da capa"
          className="border p-2"
          disabled
        />
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>Autores</label>
        {authorsFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input
              {...register(`authors.${index}.name` as const)}
              defaultValue={field.name}
              placeholder="Nome do autor"
              className="border p-2"
            />
            {authorsFields.length > 1 && (
              <Button
                className="font-semibold"
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeAuthor(index)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="font-medium"
          onClick={() => appendAuthor({ name: "" })}
        >
          <PlusCircle size={22} />
          Adicionar Autor
        </Button>
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>Categorias</label>
        {categoriesFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input
              {...register(`categories.${index}.name` as const)}
              defaultValue={field.name}
              placeholder="Nome da categoria"
              className="border p-2"
            />
            {categoriesFields.length > 1 && (
              <Button
                className="font-semibold"
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeCategory(index)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="font-medium"
          onClick={() => appendCategory({ name: "" })}
        >
          <PlusCircle size={22} />
          Adicionar categoria
        </Button>
      </div>

      <div className="col-span-2 flex justify-end mt-4">
        <Button className="font-bold" type="submit">
          Salvar Livro
        </Button>
      </div>
    </form>
  );
}
