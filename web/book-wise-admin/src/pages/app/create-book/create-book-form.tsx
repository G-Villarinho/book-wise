import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { SearchBookResponse } from "@/@types/search-book-response";
import { useMutation } from "@tanstack/react-query";
import { CreateBook } from "@/api/create-book";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SelectAuthor } from "./select-author";
import { Author } from "@/@types/author";
import { AuthorChip } from "./author-chip";

interface CreateBookFormProps {
  book: SearchBookResponse;
}

const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(500, "O Título não pode passar de 500 caracteres."),
  totalPages: z
    .number({
      invalid_type_error: "Total de páginas deve ser um número válido",
    })
    .min(1, "Total de páginas deve ser maior que 0"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(2000, "A descrição não pode passar de 2000 caracteres"),
  coverImageURL: z.string().url({ message: "URL da capa deve ser válida" }),
  categories: z.array(
    z.object({
      name: z.string().min(1, { message: "Categoria é obrigatória" }),
    })
  ),
  authors: z
    .array(z.object({ id: z.string().min(1) }))
    .min(1, { message: "Pelo menos um autor deve ser selecionado" }),
});

export type BookSchemaData = z.infer<typeof bookSchema>;

export function CreateBookForm({ book }: CreateBookFormProps) {
  const [isSelectAuthorsOpen, setIsSelectAuthorsOpen] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const navigate = useNavigate();

  const methods = useForm<BookSchemaData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      totalPages: book.totalPages,
      description: book.description,
      coverImageURL: book.coverImageURL,
      categories: book.categories.map((category) => ({ name: category })),
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const {
    fields: categoriesFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const { mutateAsync: createBook } = useMutation({
    mutationFn: CreateBook,
  });

  const handleCreateBook = async (data: BookSchemaData) => {
    const uniqueCategories = new Set(
      data.categories.map((category) => category.name)
    );
    if (uniqueCategories.size !== data.categories.length) {
      toast.error(
        "Existem categorias duplicadas. Por favor, remova os duplicados."
      );
      return;
    }

    await createBook({
      totalPages: data.totalPages,
      title: data.title,
      description: data.description,
      coverImageURL: data.coverImageURL,
      authorsIds: selectedAuthors.map((author) => author.id),
      categories: data.categories.map((category) => category.name),
    });

    toast.success("Livro criado com sucesso!");
    navigate("/library");
  };

  const handleRemoveAuthor = (authorId: string) => {
    setSelectedAuthors((prev) =>
      prev.filter((author) => author.id !== authorId)
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleCreateBook)}
        className="mt-8 grid grid-cols-2 gap-4 px-12"
      >
        <div className="flex flex-col gap-1">
          <label>Título</label>
          <Input
            {...register("title")}
            placeholder="Insira um novo título para o livro"
            className={`border p-2 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 ">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Total de Páginas</label>
          <Input
            {...register("totalPages", { valueAsNumber: true })}
            placeholder="Insira o total de páginas do livro"
            type="number"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
            className={`border p-2 ${
              errors.totalPages ? "border-red-500" : ""
            }`}
          />
          {errors.totalPages && (
            <p className="text-sm text-red-500 ">{errors.totalPages.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label>Descrição</label>
          <Textarea
            {...register("description")}
            placeholder="Descrição do livro"
            className={`border p-2 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500 ">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label>Autores</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedAuthors.map((author) => (
              <AuthorChip
                key={author.id}
                author={author}
                onRemove={() => handleRemoveAuthor(author.id)}
              />
            ))}
          </div>
          <Dialog
            onOpenChange={setIsSelectAuthorsOpen}
            open={isSelectAuthorsOpen}
          >
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="font-medium">
                <PlusCircle size={22} />
                Adicionar Autor
              </Button>
            </DialogTrigger>
            <SelectAuthor
              open={isSelectAuthorsOpen}
              selectedAuthors={selectedAuthors}
              onAuthorsChange={setSelectedAuthors}
              onClose={() => setIsSelectAuthorsOpen(false)}
            />
          </Dialog>
          {errors.authors && (
            <p className="text-sm text-red-500 ">{errors.authors.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label>Categorias</label>
          {categoriesFields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex gap-2">
                <Input
                  {...register(`categories.${index}.name` as const)}
                  defaultValue={field.name}
                  placeholder="Nome da categoria"
                  className={`border p-2 w-full ${
                    errors.categories?.[index]?.name ? "border-red-500" : ""
                  }`}
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
              {errors.categories?.[index]?.name && (
                <p className="text-sm text-red-500 ">
                  {errors.categories[index].name?.message}
                </p>
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
            Adicionar Categoria
          </Button>
        </div>

        <div className="col-span-2 flex justify-end mt-4">
          <Button className="font-bold" type="submit">
            Salvar Livro
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
