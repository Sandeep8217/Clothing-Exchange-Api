import {useCallback, useEffect, useState} from "react";
import {getMyListings, deleteClothing} from "../api/clothing";

export default function MyWardrobe() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadWardrobe = useCallback(async () => {
        try {
            setError("");
            const data = await getMyListings();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load your wardrobe.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWardrobe();
    }, [loadWardrobe]);

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this clothing listing?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);
            await deleteClothing(id);
            setItems((current) =>
                current.filter((item) => item.id !== id && item._id !== id)
            );
        } catch (err) {
            setError(err.message || "Failed to delete the listing.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <p className="text-center text-gray-500">
                    Loading your wardrobe...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        Your collection
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Wardrobe
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage your clothing listings and see their current status.
                    </p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Total listings</p>
                        <p className="mt-2 text-3xl font-bold">{items.length}</p>
                    </div>

                    <div className="rounded-xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {items.filter((item) => item.status === "AVAILABLE").length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Swapped</p>
                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {items.filter((item) => item.status === "SWAPPED").length}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                        <button
                            onClick={loadWardrobe}
                            className="ml-3 font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Your wardrobe is empty
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Add your first clothing item to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => {
                            const id = item.id ?? item._id;
                            const swapped = item.status === "SWAPPED";

                            return (
                                <article
                                    key={id}
                                    className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title || item.name || "Clothing item"}
                                            className="h-56 w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
                                            No image available
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {item.title || item.name || "Untitled clothing"}
                                            </h2>

                                            <span
                                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    swapped
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-emerald-100 text-emerald-700"
                                                }`}
                                            >
                        {item.status || "AVAILABLE"}
                      </span>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            {item.category && <p>Category: {item.category}</p>}
                                            {item.size && <p>Size: {item.size}</p>}
                                            {item.brand && <p>Brand: {item.brand}</p>}
                                            {item.condition && <p>Condition: {item.condition}</p>}
                                            {item.city && <p>Location: {item.city}</p>}
                                        </div>

                                        <button
                                            onClick={() => handleDelete(id)}
                                            disabled={swapped || deletingId === id}
                                            className="mt-5 w-full rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {swapped
                                                ? "Item already swapped"
                                                : deletingId === id
                                                    ? "Deleting..."
                                                    : "Delete listing"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}