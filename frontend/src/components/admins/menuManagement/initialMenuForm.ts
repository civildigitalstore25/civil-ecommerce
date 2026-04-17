import type { CreateMenuDTO } from "../../../api/menuApi";

export const initialCreateMenuForm = (): CreateMenuDTO => ({
  name: "",
  slug: "",
  parentId: null,
  order: 0,
  isActive: true,
  icon: "",
  type: "category",
});
