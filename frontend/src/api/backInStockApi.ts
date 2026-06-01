import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type BackInStockSubscribePayload = {
  productId: string;
  name: string;
  email: string;
};

export type BackInStockSubscribeResponse = {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
};

export async function subscribeBackInStock(
  data: BackInStockSubscribePayload,
): Promise<BackInStockSubscribeResponse> {
  const response = await axios.post<BackInStockSubscribeResponse>(
    `${API_BASE_URL}/api/back-in-stock/subscribe`,
    data,
  );
  return response.data;
}

export function useBackInStockSubscribe() {
  return useMutation({
    mutationFn: subscribeBackInStock,
    onSuccess: (data) => {
      void Swal.fire({
        icon: "success",
        title: data.alreadySubscribed ? "Already subscribed" : "You're on the list!",
        text: data.message,
        confirmButtonColor: "#0a2a6b",
      });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Something went wrong. Please try again.";
      void Swal.fire({
        icon: "error",
        title: "Could not submit",
        text: message,
        confirmButtonColor: "#0a2a6b",
      });
    },
  });
}
