import { useEffect, useState } from "react";
import { getTickets, updateTicket } from "./api";
import { TicketSummary } from "./types";

export function TicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTickets()
      .then((data) => {
        if (!active) return;
        setTickets(data);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const handleToggle = async (ticket: TicketSummary) => {
    const nextStatus = ticket.status === "open" ? "closed" : "open";
    await updateTicket(ticket.id, { status: nextStatus });
    ticket.status = nextStatus;
    setTickets(tickets);
  };

  if (status === "loading") return <p>Loading tickets...</p>;
  if (status === "error") return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Support tickets</h1>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.title}</strong> · {ticket.customer} · {ticket.priority} · {ticket.status}
            <button onClick={() => handleToggle(ticket)}>
              {ticket.status === "open" ? "Close" : "Reopen"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
