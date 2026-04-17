import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";
import { SWAL_BUTTON_COLORS } from "../constants/swalTheme";

type ConfirmOptions = {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export async function swalConfirm(opts: ConfirmOptions = {}): Promise<boolean> {
  const result = await Swal.fire({
    title: opts.title || "Are you sure?",
    text: opts.text || "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: opts.confirmButtonText || "Yes",
    cancelButtonText: opts.cancelButtonText || "Cancel",
  });
  return !!result.isConfirmed;
}

export async function swalSuccess(message: string, title?: string) {
  await Swal.fire({ icon: "success", title: title || "Success", text: message });
}

export async function swalError(message: string, title?: string) {
  await Swal.fire({ icon: "error", title: title || "Error", text: message });
}

export async function swalInfo(message: string, title?: string) {
  await Swal.fire({ icon: "info", title: title || "Info", text: message });
}

export function swalWarning(title: string, text?: string) {
  return text !== undefined
    ? Swal.fire(title, text, "warning")
    : Swal.fire({ icon: "warning", title });
}

export async function swalConfirmSimple(text: string, title = "Are you sure?") {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
  });
  return result.isConfirmed;
}

export async function swalConfirmDestructive(options: {
  title?: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) {
  const result = await Swal.fire({
    title: options.title ?? "Are you sure?",
    text: options.text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: SWAL_BUTTON_COLORS.dangerConfirm,
    cancelButtonColor: SWAL_BUTTON_COLORS.cancel,
    confirmButtonText: options.confirmButtonText ?? "Yes, delete!",
    cancelButtonText: options.cancelButtonText ?? "Cancel",
  });
  return result.isConfirmed;
}

export function swalSuccessBrief(title: string, text: string, timerMs = 2000) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    timer: timerMs,
    showConfirmButton: false,
  });
}

export function swalFire(options: SweetAlertOptions) {
  return Swal.fire(options);
}

export default { swalConfirm, swalSuccess, swalError, swalInfo };
