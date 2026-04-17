import type { IMenu } from "../../../api/menuApi";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

interface MenuManagementMenuTreeProps {
  menus: IMenu[];
  level?: number;
  colors: ThemeColors;
}

export function MenuManagementMenuTree({
  menus,
  level = 0,
  colors,
}: MenuManagementMenuTreeProps) {
  return (
    <>
      {menus.map((menu) => (
        <div key={menu._id} style={{ marginLeft: `${level * 24}px` }}>
          <div
            className="flex items-center justify-between p-3 mb-2 rounded-lg border"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className="font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {menu.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: menu.isActive ? "#10b981" : "#ef4444",
                      color: "#fff",
                    }}
                  >
                    {menu.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      color: colors.text.secondary,
                    }}
                  >
                    {menu.type}
                  </span>
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Slug: {menu.slug} | Order: {menu.order}
                </p>
              </div>
            </div>
          </div>
          {menu.children && menu.children.length > 0 && (
            <MenuManagementMenuTree
              menus={menu.children}
              level={level + 1}
              colors={colors}
            />
          )}
        </div>
      ))}
    </>
  );
}
