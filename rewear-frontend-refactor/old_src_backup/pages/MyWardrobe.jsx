
import { useEffect, useState } from "react";
import { getMyListings, deleteClothing } from "../api/clothing";

export default function MyWardrobe({ user }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadListings() {
        setLoading(true);
        setError("");

        try {
            const data = await getMyListings();
            setListings(data);
        } catch (err) {
            setError(err.message || "Failed to load your wardrobe.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadListings();
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this clothing item?"
        );

        if (!confirmed) return;

        try {
            await deleteClothing(id);
            setListings((previous) =>
                previous.filter((item) => item.id !== id)
            );
        } catch (err) {
            setError(err.message || "Failed to delete the item.");
        }
    }

    if (loading) {
        return <p className="p-8 text-center">Loading your wardrobe...</p>;
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-2 text-3xl font-bold">My Wardrobe</h1>
            <p className="mb-8 text-gray-500">
                Manage the clothes you've listed for swapping.
            </p>

            {error && (
                <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </p>
            )}

            {listings.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <h2 className="mb-2 text-xl font-semibold">
                        Your wardrobe is empty
                    </h2>
                    <p className="text-gray-500">
                        Add clothing from the marketplace to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.map((item) => (
                        <article
                            key={item.id}
                            className="overflow-hidden rounded-xl border bg-white shadow-sm"
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="h-52 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                                    No image available
                                </div>
                            )}

                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {item.category} · {item.size} · {item.condition}
                                </p>

                                <p className="mt-3 text-sm">
                                    Status:{" "}
                                    <span className="font-semibold">{item.status}</span>
                                </p>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={item.status === "SWAPPED"}
                                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {item.status === "SWAPPED" ? "Already swapped" : "Delete"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
