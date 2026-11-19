import { useEffect, useState } from "react";
import {getTicket, getTickets, updateTicket} from "./api";
import {Ticket, TicketSummary} from "./types";

type Tab = "all" | "open" | "closed";
const tabs: Tab[] = ["all", "open", "closed"];
const PAGE_SIZE = 5;

type DetailsState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; ticket: Ticket };

export function TicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<DetailsState>({ status: "idle" });

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

  useEffect(() => {
    if(!selectedId) return;
    let active = true;

    setDetails({ status: "loading" });

    getTicket(selectedId)
        .then((ticket) => {
          if(active){
            setDetails({ status: "success", ticket });
          }
        }).catch((error: unknown) => {
          if(active){
            setDetails({ status: "error", message: error instanceof Error ? error.message : "Something went wrong" });
          }
    })

    return() =>{
      active = false;
    }
  }, [selectedId]);

  const handleTicketState = async (ticket: TicketSummary) => {
    const nextStatus = ticket.status === "open" ? "closed" : "open";
    setUpdateError("");

    try {
      await updateTicket(ticket.id, { status: nextStatus });
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status: nextStatus } : t)));
    } catch (err: unknown) {
      setUpdateError(`Couldn't update ${ticket.title}`);
    }

  };

  if (status === "loading") return <p>Loading tickets...</p>;
  if (status === "error") return <p role="alert">{error}</p>;

  const counts = {
    all: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "open").length,
    closed: tickets.filter((ticket) => ticket.status === "closed").length,
  };
  const visibleTickets = tickets.filter((ticket) => activeTab === "all" || ticket.status === activeTab);

  const searchedTicketsResult =  visibleTickets.filter((ticket) => ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
      || ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(searchedTicketsResult.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTickets = searchedTicketsResult.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <h1>Support tickets</h1>
      {tickets.length === 0 && <p>No tickets yet</p>}
      <div>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={activeTab === tab}
            style={{ fontWeight: activeTab === tab ? "bold" : "normal" }}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>
      <label htmlFor="search">Search</label>
      <input id="search" type="text" value={searchTerm} placeholder="Search tickets..."
             onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }} />
      {updateError && <p role="alert">{updateError}.</p>}
      {tickets.length > 0 && searchedTicketsResult.length === 0 && <p>No tickets match the filter "{searchTerm}".</p>}
      <ul>
        {pagedTickets.map((ticket) => (
          <li key={ticket.id}>
            <button onClick={() => setSelectedId(ticket.id)}><strong>{ticket.title}</strong></button>
            {" "} · {ticket.customer} · {ticket.priority} · {ticket.status}
            <button onClick={() => handleTicketState(ticket)}>
              {ticket.status === "open" ? "Close" : "Reopen"}
            </button>
          </li>
        ))}
      </ul>
      {details.status === "loading" && <p>Loading ticket details...</p>}
      {details.status === "error" && <p role="alert">{details.message}</p>}
      {details.status === "success" && <p>{details.ticket.description} · {details.ticket.customerEmail}</p>}
      <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</button>
    </div>
  );
}
