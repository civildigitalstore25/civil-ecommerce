import Swal from "sweetalert2";

const toastBase = {
  toast: true as const,
  position: "top-end" as const,
  showConfirmButton: false,
  timerProgressBar: true,
};

export function showCartSuccessToast(message: string): void {
  void Swal.fire({
    ...toastBase,
    icon: "success",
    title: message,
    timer: 2000,
  });
}

export function showCartErrorToast(message: string): void {
  void Swal.fire({
    ...toastBase,
    icon: "error",
    title: message,
    timer: 3000,
  });
}
