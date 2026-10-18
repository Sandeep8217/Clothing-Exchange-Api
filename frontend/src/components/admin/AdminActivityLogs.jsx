
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminActivityLogs } from "../../api/admin";

const actionStyles = {
    USER_ACTIVATED: "bg-green-100 text-green-800",
    USER_DEACTIVATED: "bg-amber-100 text-amber-800",
    LISTING_DELETED: "bg-red-100 text-red-800",
};

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? "—"
        : parsed.toLocaleString("en-IN");
}

export default function AdminActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadLogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAdminActivityLogs();
            setLogs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const filteredLogs = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return logs;

        return logs.filter((log) =>
            [
                log.adminEmail,
                log.action,
                log.targetType,
                log.targetId,
                log.description,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                )
        );
    }, [logs, search]);

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Admin Activity Logs
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        History of administrative actions
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadLogs}
                    disabled={loading}
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by admin, action, or description..."
                className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-green-600"
            />

            {error && (
                <p role="alert" className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="py-8 text-center text-gray-500">
                    Loading activity logs...
                </p>
            ) : filteredLogs.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                    {search
                        ? "No matching activity logs found."
                        : "No admin activity recorded yet."}
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Administrator</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Target</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Date & Time</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredLogs.map((log) => (
                            <tr
                                key={log.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">
                                    {log.adminEmail || "—"}
                                </td>

                                <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                actionStyles[log.action] ||
                                                "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {log.action?.replaceAll("_", " ") ||
                                                "UNKNOWN"}
                                        </span>
                                </td>

                                <td className="px-4 py-3">
                                    <div>{log.targetType || "—"}</div>
                                    <div className="max-w-[150px] truncate text-xs text-gray-400">
                                        {log.targetId || "—"}
                                    </div>
                                </td>

                                <td className="px-4 py-3 text-gray-700">
                                    {log.description || "—"}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                    {formatDate(log.createdAt)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
