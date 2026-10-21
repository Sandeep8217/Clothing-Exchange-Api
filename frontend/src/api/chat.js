
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.PROD
    ? "https://rewear-backend-5z47.onrender.com/ws"
    : "http://localhost:8080/ws";

export function connectToChat({
                                  swapRequestId,
                                  onMessage,
                                  onConnected,
                                  onError,
                              }) {
    const token = localStorage.getItem("rewearToken");

    if (!token) {
        throw new Error("Please log in to use chat.");
    }

    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        onConnect: () => {
            client.subscribe(
                `/topic/swaps/${swapRequestId}`,
                (frame) => {
                    onMessage?.(JSON.parse(frame.body));
                }
            );

            onConnected?.();
        },

        onStompError: (frame) => {
            onError?.(
                frame.headers.message || "Chat connection failed."
            );
        },

        onWebSocketError: () => {
            onError?.("Unable to connect to the chat server.");
        },
    });

    client.activate();

    return {
        sendMessage(content) {
            if (!client.connected) {
                throw new Error("Chat is not connected yet.");
            }

            client.publish({
                destination: `/app/chat/${swapRequestId}`,
                body: JSON.stringify({ content }),
            });
        },

        disconnect() {
            return client.deactivate();
        },
    };
}
