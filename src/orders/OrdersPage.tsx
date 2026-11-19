import { useEffect, useState } from "react";
import { getOrder, getOrders, updateOrder } from "./api";
import { Order, OrderSummary, STATUSES } from "./types";

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState<OrderSummary[]>([]);
  const [details, setDetails] = useState<Order | null>(null);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    const result = statusFilter
      ? orders
          .filter((order) => order.status === statusFilter)
          .sort((a, b) =>
            sortNewest ? Number(b.date) - Number(a.date) : Number(a.date) - Number(b.date),
          )
      : orders;
    setFilteredOrders(result);
  }, [orders, statusFilter, sortNewest]);

  const handleCancel = async (order: OrderSummary) => {
    await updateOrder(order.id, { status: "cancelled" });
    order.status = "cancelled";
    setOrders([...orders]);
  };

  const handleShowDetails = async (id: string) => {
    const order = await getOrder(id);
    setDetails(order);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Orders</h1>

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button onClick={() => setSortNewest(!sortNewest)}>
        {sortNewest ? "Newest first" : "Oldest first"}
      </button>

      {filteredOrders.length === 0 && <p>No orders yet.</p>}
      {filteredOrders.length === 0 && <p>No {statusFilter} orders.</p>}

      <table>
        <thead>
          <th>Customer</th>
          <th>Status</th>
          <th>Total</th>
          <th>Date</th>
          <th></th>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>
                <button onClick={() => handleShowDetails(order.id)}>{order.customer}</button>
              </td>
              <td>${order.totalCents / 100}</td>
              <td>{order.status}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>
                {order.status === "pending" && <button onClick={() => handleCancel(order)}>Cancel</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {details && (
        <section>
          <h2>{details.customer}</h2>
          <p>{details.shippingAddress}</p>
          <ul>
            {details.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
