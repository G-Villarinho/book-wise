import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

let displayedNetworkFailureError = false;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount) {
        if (failureCount >= 3) {
          if (displayedNetworkFailureError === false) {
            displayedNetworkFailureError = true;

            toast.error(
              "A aplicação está demorando mais que o esperado para carregar, tente novamente em alguns minutos.",
              {
                onDismiss: () => {
                  displayedNetworkFailureError = false;
                },
              }
            );
          }

          return false;
        }

        return true;
      },
    },
    mutations: {
      onError(error) {
        if (isAxiosError(error)) {
          const apiError = error.response?.data;

          if (apiError && apiError.details) {
            toast.error(apiError.details);
          } else if (apiError && apiError.message) {
            toast.error(apiError.message);
          } else {
            toast.error("Erro ao processar operação!");
          }
        } else {
          toast.error("Erro inesperado, tente novamente.");
        }
      },
    },
  },
});
