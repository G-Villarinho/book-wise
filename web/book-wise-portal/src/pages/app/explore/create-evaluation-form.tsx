import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "@/components/user-provider";
import { Check, X } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RateStarForm } from "./rate-star-form";
import { evaluateBook } from "@/api/evaluate-book";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginateResponse } from "@/api/interfaces/paginate-response";
import { PublishedBookResponse } from "@/api/get-published-book";

const createEvaluationSchema = z.object({
  rate: z
    .number()
    .min(1, { message: "A avaliação deve ser entre 0 e 5" })
    .max(5, { message: "A avaliação deve ser entre 0 e 5" }),
  description: z
    .string()
    .nonempty("A descrição é obrigatória!")
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres" }),
});

type CreateEvaluationSchema = z.infer<typeof createEvaluationSchema>;

interface CreateEvaluationFormProps {
  bookId: string;
  onClose: () => void;
}

export function CreateEvaluationForm({
  bookId,
  onClose,
}: CreateEvaluationFormProps) {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [rate, setRate] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEvaluationSchema>({
    resolver: zodResolver(createEvaluationSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      rate: 0,
    },
  });

  function updateBookHasReadOnCache(bookId: string) {
    const publishedBooksListingCache = queryClient.getQueriesData<
      PaginateResponse<PublishedBookResponse>
    >({ queryKey: ["books"] });

    publishedBooksListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return;
      }

      queryClient.setQueryData<PaginateResponse<PublishedBookResponse>>(
        cacheKey,
        {
          ...cached,
          data: cached.data.map((book) => {
            if (bookId !== book.id) {
              return book;
            }

            return {
              ...book,
              hasRead: true,
            };
          }),
        }
      );
    });
  }

  const { mutateAsync: evaluateBookfn } = useMutation({
    mutationFn: evaluateBook,
  });

  async function handleEvaluateBook(data: CreateEvaluationSchema) {
    try {
      await evaluateBookfn({
        bookId,
        rate: data.rate,
        description: data.description,
      });

      updateBookHasReadOnCache(bookId);
      queryClient.invalidateQueries({
        queryKey: ["evaluations"],
        exact: false,
        filters: { page: 1 },
      });
      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  function handleRateChange(newRate: number) {
    setRate(newRate);
    setValue("rate", newRate, { shouldValidate: true });
  }

  return (
    user && (
      <form
        onSubmit={handleSubmit(handleEvaluateBook)}
        className="flex flex-col bg-app-gray-700 rounded-lg p-5 gap-4"
      >
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt="User Avatar" />
              <AvatarFallback className="font-extrabold text-lg">
                {user.fullName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-sm font-semibold">{user.fullName}</h4>
          </div>

          <RateStarForm rate={rate} onRateChange={handleRateChange} />
        </div>

        <Textarea
          maxLength={500}
          placeholder="Escreva sua avaliação"
          {...register("description")}
        />
        {errors.rate && (
          <small className="text-red-500 text-sm">{errors.rate.message}</small>
        )}
        {errors.rate && (
          <p className="text-red-500 text-sm">{errors.rate.message}</p>
        )}

        <div className="flex items-center gap-2 self-end">
          <Button size="icon" onClick={onClose}>
            <X className="text-app-purple-100" strokeWidth={3} />
          </Button>
          <Button type="submit" size="icon" disabled={!isValid}>
            <Check className="text-app-green-100" strokeWidth={3} />
          </Button>
        </div>
      </form>
    )
  );
}
