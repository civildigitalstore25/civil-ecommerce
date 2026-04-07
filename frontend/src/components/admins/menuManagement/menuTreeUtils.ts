import type { IMenu } from "../../../api/menuApi";

/** Flat list of menus that can act as parents in the create form. */
export function getAllParentMenus(menuList: IMenu[]): IMenu[] {
  let parents: IMenu[] = [];
  menuList.forEach((menu) => {
    if (!menu.parentId || menu.type === "category") {
      parents.push(menu);
    }
    if (menu.children && menu.children.length > 0) {
      parents = parents.concat(getAllParentMenus(menu.children));
    }
  });
  return parents;
}
