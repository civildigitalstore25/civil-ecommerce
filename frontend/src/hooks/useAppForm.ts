import { useForm } from "react-hook-form";
import type { UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";

/**
 * useAppForm - Global wrapper for react-hook-form with consistent config
 * Use this instead of useForm directly for all forms.
 */
export function useAppForm<T extends FieldValues>(options?: UseFormProps<T>): UseFormReturn<T> {
    return useForm<T>({
        mode: "onBlur",
        reValidateMode: "onChange",
        ...options,
    });
}
