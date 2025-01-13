import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateBook } from "@/api/create-book";
import { toast } from "sonner";
import { BookResponse } from "@/api/get-books";

const bookSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  totalPages: z
    .number({
      invalid_type_error: "Total de páginas deve ser um número válido",
    })
    .min(1, { message: "Total de páginas deve ser maior que 0" }),
  description: z.string(),
  coverImageURL: z.string().url(),
  authors: z.array(
    z.object({
      name: z.string().min(1, { message: "Nome do autor é obrigatório" }),
    })
  ),
  categories: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Categoria é obrigatório" }),
      })
    )
    .refine(
      (categories) => {
        const uniqueCategories = new Set(
          categories.map((category) => category.name)
        );
        return uniqueCategories.size === categories.length;
      },
      { message: "Existem categorias duplicadas" }
    ),
});
export type BookSchemaData = z.infer<typeof bookSchema>;

interface UpdateBookFormProps {
  book: BookResponse;
}

export function UpdateBookForm({ book }: UpdateBookFormProps) {
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

  const { mutateAsync: createBook } = useMutation({
    mutationFn: CreateBook,
  });

  const onSubmit = async (data: BookSchemaData) => {
    await createBook({
      totalPages: data.totalPages,
      title: data.title,
      description: data.description,
      coverImageURL: data.coverImageURL,
      authors: data.authors.map((author) => author.name),
      categories: data.categories.map((category) => category.name),
    });

    toast.success("Livro criado com sucesso!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 grid grid-cols-2 gap-4 px-12 mr-4"
    >
      <div className="flex flex-col gap-1">
        <label>Título</label>
        <Input
          {...register("title")}
          placeholder="Insira um novo título para o livro"
          className={`border p-2 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
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
          className={`border p-2 ${errors.totalPages ? "border-red-500" : ""}`}
        />
        {errors.totalPages && (
          <p className="text-sm text-red-500 mt-1">
            {errors.totalPages.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>Descrição</label>
        <Textarea
          {...register("description")}
          placeholder="Descrição do livro"
          className={`border p-2 ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>URL da Capa</label>
        <Input
          {...register("coverImageURL")}
          placeholder="URL da imagem da capa"
          className={`border p-2 ${
            errors.coverImageURL ? "border-red-500" : ""
          }`}
          disabled
        />
        {errors.coverImageURL && (
          <p className="text-sm text-red-500 mt-1">
            {errors.coverImageURL.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <label>Autores</label>
        {authorsFields.map((field, index) => (
          <div key={field.id} className="mb-4">
            <div className="flex gap-2">
              <Input
                {...register(`authors.${index}.name` as const)}
                defaultValue={field.name}
                placeholder="Nome do autor"
                className={`border p-2 w-full ${
                  errors.authors?.[index]?.name ? "border-red-500" : ""
                }`}
              />
              {authorsFields.length > 1 && (
                <Button
                  className="font-semibold"
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeAuthor(index)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
            {errors.authors?.[index]?.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.authors[index].name?.message}
              </p>
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
              <p className="text-sm text-red-500 mt-1">
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
  );
}
