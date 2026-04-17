type OrderLike = { paymentStatus?: string; totalAmount?: number; createdAt?: string };
type ProductLike = { category?: string; company?: string };

export type DashboardStats = {
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
  todayOrders: number;
  topCompanies: { name: string; products: number }[];
  topCategories: { name: string; products: number }[];
};

type ProductsPayload = { products?: ProductLike[] } | undefined;
type OrdersPayload = { data?: { orders?: OrderLike[] } } | undefined;
type UsersPayload = { users?: unknown[]; total?: number } | undefined;

export function buildDashboardStats(
  productsData: ProductsPayload,
  ordersData: OrdersPayload,
  usersData: UsersPayload,
): DashboardStats {
  const products = productsData?.products || [];
  const orders = ordersData?.data?.orders || [];
  const users = usersData?.users || [];
  const totalUsers =
    typeof usersData?.total === "number" ? usersData.total : users.length;

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + (order.totalAmount ?? 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt ?? 0);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  }).length;

  const categories = [...new Set(products.map((p) => p.category))];

  const companyCounts: Record<string, number> = {};
  products.forEach((product) => {
    const company = product.company || "Unknown";
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

  const categoryCounts: Record<string, number> = {};
  products.forEach((product) => {
    const category = product.category || "Unknown";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return {
    totalRevenue,
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers,
    totalOrders: orders.length,
    todayOrders,
    topCompanies: Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, products: count })),
    topCategories: Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, products: count })),
  };
}
