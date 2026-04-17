export interface UserFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: "user" | "admin" | "superadmin";
  password: string;
  confirmPassword: string;
}

export const emptyUserFormData: UserFormData = {
  email: "",
  fullName: "",
  phoneNumber: "",
  role: "user",
  password: "",
  confirmPassword: "",
};
