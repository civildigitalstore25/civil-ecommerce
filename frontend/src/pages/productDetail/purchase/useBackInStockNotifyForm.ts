import { useEffect, useState, type FormEvent } from "react";
import { useUser } from "../../../api/userQueries";
import { useBackInStockSubscribe } from "../../../api/backInStockApi";

export type BackInStockProductRef = {
  productId: string;
  productName: string;
};

export function useBackInStockNotifyForm({ productId }: BackInStockProductRef) {
  const { data: user } = useUser();
  const subscribe = useBackInStockSubscribe();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user?.fullName && !name) setName(user.fullName);
    if (user?.email && !email) setEmail(user.email);
  }, [user?.fullName, user?.email, name, email]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    subscribe.mutate({
      productId,
      name: name.trim(),
      email: email.trim(),
    });
  };

  return {
    name,
    setName,
    email,
    setEmail,
    handleSubmit,
    isSubmitting: subscribe.isPending,
  };
}
