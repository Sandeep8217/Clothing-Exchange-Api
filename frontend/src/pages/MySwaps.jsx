import {useCallback, useEffect, useState} from "react";
import ChatWindow from "../components/chat/ChatWindow";
import { getUnreadMessageCount } from "../api/chatHistory";
import {
    getMySwapRequests,
    getIncomingSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    confirmSwapCompletion,
} from "../api/swaps";

export default function MySwaps() {
    const [activeTab, setActiveTab] = useState("incoming");
    const [sentRequests, setSentRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [chatSwapId, setChatSwapId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadRequests = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [sent, incoming] = await Promise.all([
                getMySwapRequests(),
                getIncomingSwapRequests(),
            ]);
          console.log("SENT SWAP REQUESTS:", sent);
          console.log("INCOMING SWAP REQUESTS:", incoming);

            setSentRequests(Array.isArray(sent) ? sent : []);
            setIncomingRequests(Array.isArray(incoming) ? incoming : []);
        } catch (err) {
            setError(err.message || "Could not load swap requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);
    useEffect(() => {
        let cancelled = false;

        async function loadUnreadCount() {
            try {
                const count = await getUnreadMessageCount();

                if (!cancelled) {
                    setUnreadCount(Number(count) || 0);
                }
            } catch (error) {
                console.error("Failed to load unread message count:", error);
            }
        }

        loadUnreadCount();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleAction(id, action) {
        setBusyId(id);
        setError("");
        setNotice("");

        try {
            if (action === "accept") {
                await acceptSwapRequest(id);
                setNotice("Swap request accepted!");
            } else {
                await rejectSwapRequest(id);
                setNotice("Swap request rejected.");
            }

            await loadRequests();
        } catch (err) {
            setError(err.message || "Unable to update this request.");
        } finally {
            setBusyId(null);
        }
    }


    async function handleConfirmCompletion(id) {
        setBusyId(id);
        setError("");
        setNotice("");

        try {
            const updatedSwap = await confirmSwapCompletion(id);

            await loadRequests();

            if (updatedSwap.status === "COMPLETED") {
                setNotice("Exchange completed successfully!");
            } else {
                setNotice(
                    "Your confirmation is recorded. Waiting for the other participant."
                );
            }
        } catch (err) {
            setError(err.message || "Unable to confirm the exchange.");
        } finally {
            setBusyId(null);
        }
    }


    function getId(request) {
        return request.id ?? request._id;
    }

    function getStatus(request) {
        return request.status || "PENDING";
    }

    function getItemTitle(item) {
        if (!item) return "Clothing item";
        return item.title || item.name || item.brand || "Clothing item";
    }

    function getItemImage(item) {
        return (
            item?.imageUrl ||
            item?.imageUrls?.[0] ||
            item?.images?.[0] ||
            item?.image ||
            item?.photoUrl ||
            ""
        );
    }

    function getItem(request, keys) {
        for (const key of keys) {
            if (request[key] && typeof request[key] === "object") {
                return request[key];
            }
        }
        return null;
    }

    const requests =
        activeTab === "incoming" ? incomingRequests : sentRequests;

    function renderItem(item, label) {
        const image = getItemImage(item);

        return (
            <div className="flex items-center gap-3">
                {image ? (
                    <img
                        src={image}
                        alt={getItemTitle(item)}
                        className="h-16 w-16 rounded-lg object-cover"
                    />
                ) : (
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">
                        No image
                    </div>
                )}

                <div>
                    <p className="text-xs text-stone-500">{label}</p>
                    <p className="font-semibold text-stone-800">
                        {getItemTitle(item)}
                    </p>
                    {item?.size && (
                        <p className="text-sm text-stone-500">Size: {item.size}</p>
                    )}
                </div>
            </div>
        );
    }

    function renderRequest(request) {
        const id = getId(request);
        const status = getStatus(request).toUpperCase();

        const requestedItem = getItem(request, [
            "requestedItem",
            "requestedClothing",
            "targetItem",
        ]);

        const offeredItem = getItem(request, [
            "offeredItem",
            "offeredClothing",
            "exchangeItem",
        ]);

        const pending = status === "PENDING";
        const busy = busyId === id;

        return (
            <article
                key={id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-stone-500">
                        Swap request
                    </p>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "ACCEPTED"
                                ? "bg-emerald-100 text-emerald-800"
                                : status === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-800"
                        }`}
                    >
            {status}
          </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        {renderItem(requestedItem, "Requested item")}
                    </div>
                    <div>
                        {renderItem(offeredItem, "Offered item")}
                    </div>
                </div>

                {request.message && (
                    <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                        {request.message}
                    </p>
                )}

                {activeTab === "incoming" && pending && (
                    <div className="mt-5 flex gap-3 border-t border-stone-100 pt-4">
                        <button
                            onClick={() => handleAction(id, "accept")}
                            disabled={busy}
                            className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                            {busy ? "Please wait..." : "Accept"}
                        </button>

                        <button
                            onClick={() => handleAction(id, "reject")}
                            disabled={busy}
                            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                        >
                            Reject
                        </button>
                    </div>
                )}
                {status === "ACCEPTED" && (
                    <div className="mt-5 border-t border-stone-100 pt-4">
                        <p className="mb-3 text-sm text-stone-600">
                            Confirm that you have completed the physical clothing exchange.
                        </p>

                        <button
                            type="button"
                            onClick={() => handleConfirmCompletion(id)}
                            disabled={busy}
                            className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                            {busy ? "Please wait..." : "Confirm Exchange"}
                        </button>
                    </div>
                )}
                <div className="mt-5 border-t border-stone-100 pt-4">
                    <button
                        type="button"
                        onClick={() => setChatSwapId(id)}
                        className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                    >
                        Open Chat
                    </button>

                    {chatSwapId === id && (
                        <div className="mt-4">
                            <ChatWindow
                                swapRequestId={chatSwapId}
                                onClose={async () => {
                                    setChatSwapId(null);

                                    try {
                                        const count = await getUnreadMessageCount();
                                        setUnreadCount(Number(count) || 0);
                                    } catch (error) {
                                        console.error("Failed to refresh unread count:", error);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </article>
        );
    }

    return (
        <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Exchange center
                    </p>
                    <div className="flex items-center gap-3">
                        <h2>My Swaps</h2>

                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
      {unreadCount} unread
    </span>
                        )}
                    </div>
                    <p className="mt-2 text-stone-600">
                        Track your exchanges and manage incoming offers.
                    </p>
                </div>

                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setActiveTab("incoming")}
                        className={`rounded-full px-5 py-3 text-sm font-semibold ${
                            activeTab === "incoming"
                                ? "bg-emerald-800 text-white"
                                : "border border-stone-300 bg-white text-stone-700"
                        }`}
                    >
                        Incoming ({incomingRequests.length})
                    </button>

                    <button
                        onClick={() => setActiveTab("sent")}
                        className={`rounded-full px-5 py-3 text-sm font-semibold ${
                            activeTab === "sent"
                                ? "bg-emerald-800 text-white"
                                : "border border-stone-300 bg-white text-stone-700"
                        }`}
                    >
                        Sent ({sentRequests.length})
                    </button>
                </div>

                {notice && (
                    <div className="mb-5 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                        {notice}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                        <button
                            onClick={loadRequests}
                            className="ml-3 font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <p className="py-12 text-center text-stone-500">
                        Loading swap requests...
                    </p>
                ) : requests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-stone-800">
                            No {activeTab} requests yet
                        </h2>
                        <p className="mt-2 text-stone-500">
                            Your swap activity will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {requests.map(renderRequest)}
                    </div>
                )}

                <div className="mt-6 text-right">
                    <button
                        onClick={loadRequests}
                        disabled={loading}
                        className="rounded-full border border-stone-300 bg-white px-5 py-2 text-sm font-semibold hover:bg-stone-100 disabled:opacity-50"
                    >
                        Refresh requests
                    </button>
                </div>
            </div>
        </main>
    );
}
