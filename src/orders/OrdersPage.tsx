import { useEffect, useState } from "react";
import { getOrder, getOrders, updateOrder } from "./api";
import { Order, OrderSummary, STATUSES } from "./types";

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [details, setDetails] = useState<Order | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((err: any) => {
        setError(err.message);
      }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if(!selectedId) return;
    let active = true;

    getOrder(selectedId)
        .then((order) => {
          if (active) { //ignore is a new click came
            setDetails(order);
          }
        });

    return () => {
      active = false;
    };
  }, [selectedId]);

    const result = statusFilter ? orders.filter((order) => order.status === statusFilter) : [...orders];
    const filteredAndSorted = result.sort((a, b) =>
            sortNewest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
        );

  const handleCancel = async (order: OrderSummary) => {
    setCancelError("");
    //update the orders array with the cancelled order optimistically before it happens on the server
    setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, status:"cancelled"} : o));
    try {
      await updateOrder(order.id, { status: "cancelled" });
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Unknown error");
      //go back to the previous state if the update fails
      setOrders(prev => prev.map((o) => o.id === order.id ? { ...o, status: order.status} : o));
      setCancelError(`Couldn't cancel the order for ${order.customer}`);
    }
  };

  // const handleShowDetails = async (id: string) => {
  //
  //   setDetails(order);
  // };

  const toDollar = (amount: number) => {
    return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

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

      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.length > 0 && filteredAndSorted.length === 0 && <p>No {statusFilter} orders.</p>}

      <table>
        <thead>
        <tr>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          {filteredAndSorted.map((order) => (
            <tr key={order.id}>
              <td>
                <button onClick={() => setSelectedId(order.id)}>{order.customer}</button>
              </td>
              <td>{toDollar(order.totalCents)}</td>
              <td>{order.status}</td>
              <td>{formatDate(order.date)}</td>
              <td>
                {order.status === "pending" && <button onClick={() => handleCancel(order)}>Cancel</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cancelError && <p>{cancelError}</p>}

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
