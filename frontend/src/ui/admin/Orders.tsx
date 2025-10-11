import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

// Types
interface Order {
  id: number;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

// Sample data
const sampleOrders: Order[] = [
  { id: 1001, customer: "John Doe", product: "AutoCAD 2024", amount: 1999, status: "completed", date: "2024-09-10" },
  { id: 1002, customer: "Jane Smith", product: "3ds Max 2024", amount: 2399, status: "pending", date: "2024-09-09" },
  { id: 1003, customer: "Mike Johnson", product: "ANSYS Workbench", amount: 4999, status: "completed", date: "2024-09-08" },
  { id: 1004, customer: "Sarah Wilson", product: "Adobe Creative Suite", amount: 2399, status: "cancelled", date: "2024-09-07" },
  { id: 1005, customer: "Tom Brown", product: "ETABS", amount: 2999, status: "pending", date: "2024-09-06" },
  { id: 1006, customer: "Emily Davis", product: "Revit 2024", amount: 3499, status: "completed", date: "2024-09-05" },
  { id: 1007, customer: "Robert Chen", product: "SolidWorks Premium", amount: 5299, status: "pending", date: "2024-09-04" },
  { id: 1008, customer: "Lisa Anderson", product: "Maya 2024", amount: 2799, status: "cancelled", date: "2024-09-03" },
  { id: 1009, customer: "David Kumar", product: "SketchUp Pro", amount: 1899, status: "completed", date: "2024-09-02" },
  { id: 1010, customer: "Maria Garcia", product: "Blender Studio", amount: 999, status: "pending", date: "2024-09-01" }
];

const Orders: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Orders
        </h2>
        <div className="flex items-center space-x-3">
          <select
            className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary
            }}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <button
            className="px-4 py-2 rounded-lg transition-colors font-medium"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.interactive.primaryHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.interactive.primary}
          >
            Export Orders
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="text-center">
            <h3
              className="text-2xl font-bold"
              style={{ color: colors.status.success }}
            >
              {sampleOrders.filter(order => order.status === 'completed').length}
            </h3>
            <p style={{ color: colors.text.secondary }}>Completed Orders</p>
          </div>
        </div>
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="text-center">
            <h3
              className="text-2xl font-bold"
              style={{ color: colors.status.warning }}
            >
              {sampleOrders.filter(order => order.status === 'pending').length}
            </h3>
            <p style={{ color: colors.text.secondary }}>Pending Orders</p>
          </div>
        </div>
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="text-center">
            <h3
              className="text-2xl font-bold"
              style={{ color: colors.status.error }}
            >
              {sampleOrders.filter(order => order.status === 'cancelled').length}
            </h3>
            <p style={{ color: colors.text.secondary }}>Cancelled Orders</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="border-b transition-colors duration-200"
              style={{
                backgroundColor: colors.background.tertiary,
                borderBottomColor: colors.border.primary
              }}
            >
              <tr>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Order ID
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Customer
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Product
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Amount
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Status
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Date
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y transition-colors duration-200"
              style={{ borderColor: colors.border.secondary }}
            >
              {sampleOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors duration-200"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    className="py-4 px-4 font-medium"
                    style={{ color: colors.interactive.primary }}
                  >
                    #{order.id}
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {order.customer}
                    </div>
                  </td>
                  <td
                    className="py-4 px-4"
                    style={{ color: colors.text.primary }}
                  >
                    {order.product}
                  </td>
                  <td
                    className="py-4 px-4 font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: colors.background.accent,
                        color:
                          order.status === 'completed' ? colors.status.success :
                            order.status === 'pending' ? colors.status.warning :
                              colors.status.error
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            order.status === 'completed' ? colors.status.success :
                              order.status === 'pending' ? colors.status.warning :
                                colors.status.error
                        }}
                      ></span>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td
                    className="py-4 px-4"
                    style={{ color: colors.text.secondary }}
                  >
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{
                          color: colors.text.secondary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.interactive.primary;
                          e.currentTarget.style.backgroundColor = colors.background.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.secondary;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{
                          color: colors.text.secondary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.status.success;
                          e.currentTarget.style.backgroundColor = colors.background.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.secondary;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div
        className="rounded-xl p-4 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="text-sm"
            style={{ color: colors.text.secondary }}
          >
            Showing 1 to {sampleOrders.length} of {sampleOrders.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded-lg transition-colors duration-200"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded-lg font-medium"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse
              }}
            >
              1
            </button>
            <button
              className="px-3 py-1 border rounded-lg transition-colors duration-200"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              2
            </button>
            <button
              className="px-3 py-1 border rounded-lg transition-colors duration-200"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              3
            </button>
            <button
              className="px-3 py-1 border rounded-lg transition-colors duration-200"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;