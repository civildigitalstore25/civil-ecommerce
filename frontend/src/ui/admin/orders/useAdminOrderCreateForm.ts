import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCreateOrder } from "../../../api/adminOrderApi";
import type { IOrderItem } from "../../../api/types/orderTypes";
import { swalError, swalFire, swalSuccessBrief } from "../../../utils/swal";
import { axiosErrorMessage } from "../../../utils/axiosErrorMessage";

export type AdminOrderFormState = {
  email?: string;
  items: IOrderItem[];
  subtotal: number;
  discount?: number;
  totalAmount: number;
  notes?: string;
};

export function useAdminOrderCreateForm() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orderForm, setOrderForm] = useState<AdminOrderFormState>({
    items: [],
    subtotal: 0,
    discount: undefined,
    totalAmount: 0,
  });

  const handleAddProductToOrder = (product: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    discount?: number;
  }) => {
    setOrderForm((prev) => {
      const exists = prev.items.find((i) => i.productId === product.productId);
      if (exists) return prev;
      return { ...prev, items: [...prev.items, product as IOrderItem] };
    });
  };

  const handleRemoveOrderItem = (productId: string) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const handleOrderItemChange = (productId: string, field: string, value: string | number | undefined) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, [field]: value } : i,
      ),
    }));
  };

  useEffect(() => {
    const subtotal = orderForm.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalAmount = subtotal - (orderForm.discount || 0);
    setOrderForm((prev) => ({ ...prev, subtotal, totalAmount }));
  }, [orderForm.items, orderForm.discount]);

  const createOrderMutation = useMutation({
    mutationFn: (data: AdminOrderFormState) => adminCreateOrder(data),
    onSuccess: () => {
      void swalSuccessBrief("Order Created", "Order created successfully!", 2000);
      setShowCreateForm(false);
      setOrderForm({
        items: [],
        subtotal: 0,
        discount: 0,
        totalAmount: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: unknown) => {
      void swalError(axiosErrorMessage(error, "Failed to create order"), "Error");
    },
  });

  const submitCreateOrder = () => {
    if (!orderForm.email?.trim()) {
      void swalFire({
        icon: "error",
        title: "Required Field",
        text: "Please enter customer email",
      });
      return;
    }
    if (orderForm.items.length === 0) {
      void swalFire({
        icon: "error",
        title: "No Items",
        text: "Please add at least one product to the order",
      });
      return;
    }
    createOrderMutation.mutate(orderForm);
  };

  const validateAndAddProduct = () => {
    const productId = (document.getElementById("newProductId") as HTMLInputElement)?.value.trim();
    const name = (document.getElementById("newProductName") as HTMLInputElement)?.value.trim();
    const quantity = Number((document.getElementById("newProductQty") as HTMLInputElement)?.value);
    const price = Number((document.getElementById("newProductPrice") as HTMLInputElement)?.value);
    const discountValue = (document.getElementById("newProductDiscount") as HTMLInputElement)?.value;
    const discount = discountValue === "" ? undefined : Number(discountValue);

    if (!productId || !name) {
      void swalFire({
        icon: "error",
        title: "Required Fields",
        text: "Please fill in Product ID and Product Name",
      });
      return;
    }
    if (quantity <= 0) {
      void swalFire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Quantity must be greater than 0",
      });
      return;
    }

    handleAddProductToOrder({ productId, name, quantity, price, discount });
    (document.getElementById("newProductId") as HTMLInputElement).value = "";
    (document.getElementById("newProductName") as HTMLInputElement).value = "";
    (document.getElementById("newProductQty") as HTMLInputElement).value = "1";
    (document.getElementById("newProductPrice") as HTMLInputElement).value = "0";
    (document.getElementById("newProductDiscount") as HTMLInputElement).value = "";
  };

  return {
    showCreateForm,
    setShowCreateForm,
    orderForm,
    setOrderForm,
    handleRemoveOrderItem,
    handleOrderItemChange,
    createOrderMutation,
    submitCreateOrder,
    validateAndAddProduct,
  };
}

export type AdminCreateOrderFormApi = ReturnType<typeof useAdminOrderCreateForm>;
