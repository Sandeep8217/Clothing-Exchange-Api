import { useCallback, useEffect, useRef, useState } from "react";
import { connectToChat } from "../../api/chat";
import {
    getChatHistory,
    markMessagesAsRead,
} from "../../api/chatHistory";

export default function ChatWindow({ swapRequestId, onClose }) {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const chatRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const bottomRef = useRef(null);

    const currentUserId = (() => {
        try {
            const user = JSON.parse(
                localStorage.getItem("rewearUser") || "null"
            );
            return user?.id || user?._id || "";
        } catch {
            return "";
        }
    })();

    // Load history only when the selected swap changes.
    useEffect(() => {
        let cancelled = false;

        async function loadHistory() {
            setLoading(true);
            setError("");

            try {
                const history = await getChatHistory(swapRequestId);

                if (cancelled) return;

                setMessages(Array.isArray(history) ? history : []);

                try {
                    await markMessagesAsRead(swapRequestId);
                } catch (readError) {
                    console.error("Failed to mark messages as read:", readError);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Failed to load chat history.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (swapRequestId) {
            loadHistory();
        }

        return () => {
            cancelled = true;
        };
    }, [swapRequestId]);

    // Connect to this swap's real-time chat.
    useEffect(() => {
        if (!swapRequestId) return;

        let connection;
        let cancelled = false;

        setConnected(false);

        try {
            connection = connectToChat({
                swapRequestId,

                onMessage: (message) => {
                    if (cancelled) return;

                    setMessages((previous) => {
                        if (
                            message.id &&
                            previous.some((item) => item.id === message.id)
                        ) {
                            return previous;
                        }

                        return [...previous, message];
                    });
                },

                onConnected: () => {
                    if (!cancelled) {
                        setConnected(true);
                        setError("");
                    }
                },

                onError: (message) => {
                    if (!cancelled) {
                        setConnected(false);
                        setError(message || "Chat connection failed.");
                    }
                },
            });

            chatRef.current = connection;
        } catch (err) {
            setError(err.message || "Could not initialize chat.");
        }

        return () => {
            cancelled = true;
            setConnected(false);
            chatRef.current = null;

            if (connection) {
                connection.disconnect();
            }
        };
    }, [swapRequestId]);

    // Scroll only the message list, not the entire page.
    useEffect(() => {
        const container = messagesContainerRef.current;

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleSend = useCallback(
        (event) => {
            event.preventDefault();

            const text = content.trim();
            const connection = chatRef.current;

            if (!text || !connection || !connected || sending) {
                return;
            }

            setError("");

            try {
                connection.sendMessage(text);
                setContent("");
            } catch (err) {
                setError(err.message || "Could not send message.");
            }
        },
        [content, connected, sending]
    );

    return (
        <section className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
            <header className="flex shrink-0 items-center justify-between bg-emerald-800 px-5 py-4 text-white">
                <div>
                    <h2 className="font-semibold">Swap chat</h2>
                    <p className="text-xs text-emerald-100">
                        {connected ? "Connected" : "Connecting..."}
                    </p>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 hover:bg-emerald-700"
                    >
                        Close
                    </button>
                )}
            </header>

            <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4"
            >
                {loading ? (
                    <p className="text-center text-sm text-stone-500">
                        Loading messages...
                    </p>
                ) : messages.length === 0 ? (
                    <p className="py-10 text-center text-sm text-stone-500">
                        No messages yet. Say hello!
                    </p>
                ) : (
                    messages.map((message, index) => {
                        const mine = message.senderId === currentUserId;

                        return (
                            <div
                                key={
                                    message.id ||
                                    message._id ||
                                    `${message.sentAt}-${index}`
                                }
                                className={`flex w-full ${
    mine ? "justify-end" : "justify-start"
}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
    mine
        ? "rounded-br-md bg-emerald-700 text-white"
        : "rounded-bl-md border border-stone-200 bg-white text-stone-800"
}`}
                                >
                                    <p className="whitespace-pre-wrap break-words text-sm">
                                        {message.content}
                                    </p>

                                    <p
                                        className={`mt-1 text-right text-[10px] ${
    mine
        ? "text-emerald-100"
        : "text-stone-400"
}`}
                                    >
                                        {message.sentAt
                                            ? new Date(
                                                  message.sentAt
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={bottomRef} />
            </div>

            {error && (
                <p className="shrink-0 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSend}
                className="flex shrink-0 gap-2 border-t border-stone-200 bg-white p-3"
            >
                <input
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Type a message..."
                    maxLength={2000}
                    className="min-w-0 flex-1 rounded-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
                />

                <button
                    type="submit"
                    disabled={!connected || !content.trim() || sending}
                    className="shrink-0 rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </section>
    );
}
