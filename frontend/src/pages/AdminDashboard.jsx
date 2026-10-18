import {useCallback, useEffect, useMemo, useState} from "react";
import {
    getAdminDashboardStats,
    getAdminUsers,
    updateAdminUserStatus,
    getAdminListings,
    deleteAdminListing,
    getAdminAnalyticsSummary,
} from "../api/admin";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import AdminActivityLogs from "../components/admin/AdminActivityLogs";

const metrics = [
    {
        key: "totalUsers",
        label: "Total users",
        description: "Registered accounts",
        icon: "♙",
    },
    {
        key: "activeUsers",
        label: "Active users",
        description: "Currently enabled accounts",
        icon: "✓",
    },
    {
        key: "totalListings",
        label: "Clothing listings",
        description: "All listed items",
        icon: "♧",
    },
    {
        key: "pendingSwaps",
        label: "Pending swaps",
        description: "Awaiting a decision",
        icon: "⇄",
    },
];

export default function AdminDashboard({onExit}) {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState("");
    const [usersError, setUsersError] = useState("");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState("");
    const [pendingUser, setPendingUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [listingsError, setListingsError] = useState("");
    const [listingSearch, setListingSearch] = useState("");
    const [deletingListingId, setDeletingListingId] = useState(null);
    const [pendingListing, setPendingListing] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState("");

    const loadAnalytics = useCallback(async () => {
        setAnalyticsLoading(true);
        setAnalyticsError("");

        try {
            const data = await getAdminAnalyticsSummary();
            setAnalytics(data);
        } catch (err) {
            setAnalyticsError(
                err.message || "Unable to load analytics."
            );
        } finally {
            setAnalyticsLoading(false);
        }
    }, []);

    const loadListings = useCallback(async () => {
        setListingsLoading(true);
        setListingsError("");

        try {
            const data = await getAdminListings();
            setListings(Array.isArray(data) ? data : []);
        } catch (err) {
            setListingsError(err.message || "Unable to load listings.");
        } finally {
            setListingsLoading(false);
        }
    }, []);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAdminDashboardStats();
            setStats(data);
        } catch (err) {
            setError(err.message || "Unable to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    }, []);

    const loadUsers = useCallback(async () => {
        setUsersLoading(true);
        setUsersError("");

        try {
            const data = await getAdminUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setUsersError(err.message || "Unable to load users.");
        } finally {
            setUsersLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
        loadUsers();
        loadListings();
        loadAnalytics();
    }, [loadDashboard, loadUsers, loadListings, loadAnalytics]);

    const communityData = analytics
        ? [
            {name: "Active users", value: analytics.activeUsers ?? 0},
            {name: "Inactive users", value: analytics.inactiveUsers ?? 0},
            {name: "Available listings", value: analytics.availableListings ?? 0},
            {name: "Swapped listings", value: analytics.swappedListings ?? 0},
        ]
        : [];

    const swapData = analytics
        ? [
            {name: "Pending", value: analytics.pendingSwaps ?? 0},
            {name: "Accepted", value: analytics.acceptedSwaps ?? 0},
            {name: "Rejected", value: analytics.rejectedSwaps ?? 0},
        ]
        : [];

    const overviewData = analytics
        ? [
            {name: "Users", total: analytics.totalUsers ?? 0},
            {name: "Active users", total: analytics.activeUsers ?? 0},
            {name: "Listings", total: analytics.totalListings ?? 0},
            {name: "Pending swaps", total: analytics.pendingSwaps ?? 0},
            {name: "Accepted swaps", total: analytics.acceptedSwaps ?? 0},
        ]
        : [];

    const chartColors = ["#15803d", "#d97706", "#0284c7", "#7c3aed"];

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) =>
            [user.fullName, user.email, user.city, user.role]
                .some((value) => String(value ?? "").toLowerCase().includes(query))
        );
    }, [users, search]);

    const filteredListings = useMemo(() => {
        const query = listingSearch.trim().toLowerCase();

        return listings.filter((item) =>
            [
                item.title,
                item.brand,
                item.category,
                item.city,
                item.size,
                item.condition,
                item.status,
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            )
        );
    }, [listings, listingSearch]);

    async function handleDeleteListing() {
        if (!pendingListing) return;

        const item = pendingListing;

        setDeletingListingId(item.id);
        setListingsError("");
        setMessage("");
        setPendingListing(null);

        try {
            await deleteAdminListing(item.id);

            setListings((previous) =>
                previous.filter((listing) => listing.id !== item.id)
            );

            setMessage(`"${item.title}" was deleted successfully.`);

            await loadDashboard();
        } catch (err) {
            setListingsError(err.message || "Unable to delete listing.");
        } finally {
            setDeletingListingId(null);
        }
    }

    async function handleStatusChange() {
        if (!pendingUser) return;

        const targetUser = pendingUser;
        const nextActive = !targetUser.active;

        setUpdatingId(targetUser.id);
        setUsersError("");
        setMessage("");
        setPendingUser(null);

        try {
            await updateAdminUserStatus(targetUser.id, nextActive);

            setUsers((previous) =>
                previous.map((user) =>
                    user.id === targetUser.id
                        ? {...user, active: nextActive}
                        : user
                )
            );

            setMessage(
                `${targetUser.fullName} has been ${
                    nextActive ? "activated" : "deactivated"
                } successfully.`
            );

            await loadDashboard();
        } catch (err) {
            setUsersError(err.message || "Unable to update account status.");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f8f2] text-[#203d2d]">
            <header className="border-b border-[#e2e8dc] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            ReWear · Administration
                        </p>
                        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                            Dashboard overview
                        </h1>
                    </div>

                    <button
                        onClick={onExit}
                        className="rounded-xl border border-[#dbe5d9] px-4 py-2 text-sm font-semibold transition hover:bg-[#edf4eb]"
                    >
                        Back to marketplace
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                <div className="mb-7">
                    <h2 className="text-lg font-semibold">
                        Marketplace at a glance
                    </h2>
                    <p className="mt-1 text-sm text-[#718174]">
                        A live overview of your ReWear community.
                    </p>
                </div>

                {error && (
                    <div role="alert"
                         className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                        <button onClick={loadDashboard} className="ml-3 font-semibold underline">
                            Retry
                        </button>
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <section
                            key={metric.key}
                            className="rounded-2xl border border-[#e4e9df] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#718174]">
                                    {metric.label}
                                </span>
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl text-emerald-800">
                                    {metric.icon}
                                </span>
                            </div>

                            <p className="mt-5 text-3xl font-semibold tracking-tight">
                                {loading ? "—" : (stats?.[metric.key] ?? 0).toLocaleString()}
                            </p>

                            <p className="mt-2 text-xs text-[#859187]">
                                {metric.description}
                            </p>
                        </section>
                    ))}
                </div>

                <section className="mt-10">
                    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">User Management</h2>
                            <p className="mt-1 text-sm text-[#718174]">
                                View registered accounts and manage their status.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                loadUsers();
                                loadDashboard();
                            }}
                            disabled={usersLoading || loading}
                            className="rounded-xl border border-[#dbe5d9] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#edf4eb] disabled:opacity-50"
                        >
                            Refresh data
                        </button>
                    </div>

                    {message && (
                        <div role="status"
                             className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                            {message}
                        </div>
                    )}

                    {usersError && (
                        <div role="alert"
                             className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {usersError}
                            <button onClick={loadUsers} className="ml-3 font-semibold underline">
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border border-[#e4e9df] bg-white shadow-sm">
                        <div className="border-b border-[#e4e9df] p-4">
                            <label htmlFor="user-search" className="mb-2 block text-sm font-medium">
                                Search users
                            </label>
                            <input
                                id="user-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name, email, city, or role..."
                                className="w-full rounded-xl border border-[#dbe5d9] px-4 py-3 text-sm outline-none focus:border-emerald-600 sm:max-w-md"
                            />
                            {!usersLoading && (
                                <p className="mt-2 text-xs text-[#859187]">
                                    Showing {filteredUsers.length} of {users.length} users
                                </p>
                            )}
                        </div>

                        {usersLoading ? (
                            <p className="p-8 text-center text-sm text-[#718174]" aria-live="polite">
                                Loading users…
                            </p>
                        ) : filteredUsers.length === 0 ? (
                            <p className="p-8 text-center text-sm text-[#718174]">
                                {users.length === 0
                                    ? "No users found."
                                    : "No users match your search."}
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-[#f7f8f2] text-xs uppercase tracking-wide text-[#718174]">
                                    <tr>
                                        <th className="px-5 py-4">User</th>
                                        <th className="px-5 py-4">City</th>
                                        <th className="px-5 py-4">Role</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Joined</th>
                                        <th className="px-5 py-4">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#edf0e9]">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#fbfcf8]">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">
                                                    {user.fullName || "Unnamed user"}
                                                </p>
                                                <p className="mt-1 text-xs text-[#718174]">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                {user.city || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                    <span
                                                        className="rounded-full bg-[#f0f1ed] px-3 py-1 text-xs font-medium">
                                                        {user.role || "USER"}
                                                    </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.active
                                                            ? "bg-emerald-50 text-emerald-800"
                                                            : "bg-red-50 text-red-700"
                                                    }`}>
                                                        {user.active ? "Active" : "Inactive"}
                                                    </span>
                                            </td>
                                            <td className="px-5 py-4 text-[#718174]">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {user.role === "ADMIN" ? (
                                                    <span className="text-xs text-[#859187]">
                                                            Protected
                                                        </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setPendingUser(user)}
                                                        disabled={updatingId === user.id}
                                                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                                                            user.active
                                                                ? "border border-red-200 text-red-700 hover:bg-red-50"
                                                                : "bg-emerald-700 text-white hover:bg-emerald-800"
                                                        }`}
                                                    >
                                                        {updatingId === user.id
                                                            ? "Updating…"
                                                            : user.active
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
                <section className="mt-10">
                    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Listing Management</h2>
                            <p className="mt-1 text-sm text-[#718174]">
                                Review and moderate clothing listed on ReWear.
                            </p>
                        </div>

                        <button
                            onClick={loadListings}
                            disabled={listingsLoading}
                            className="rounded-xl border border-[#dbe5d9] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#edf4eb] disabled:opacity-50"
                        >
                            Refresh listings
                        </button>
                    </div>

                    {listingsError && (
                        <div role="alert"
                             className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {listingsError}
                            <button onClick={loadListings} className="ml-3 font-semibold underline">
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border border-[#e4e9df] bg-white shadow-sm">
                        <div className="border-b border-[#e4e9df] p-4">
                            <label htmlFor="listing-search" className="mb-2 block text-sm font-medium">
                                Search listings
                            </label>

                            <input
                                id="listing-search"
                                type="search"
                                value={listingSearch}
                                onChange={(event) => setListingSearch(event.target.value)}
                                placeholder="Search title, brand, category, city..."
                                className="w-full rounded-xl border border-[#dbe5d9] px-4 py-3 text-sm outline-none focus:border-emerald-600 sm:max-w-md"
                            />

                            {!listingsLoading && (
                                <p className="mt-2 text-xs text-[#859187]">
                                    Showing {filteredListings.length} of {listings.length} listings
                                </p>
                            )}
                        </div>

                        {listingsLoading ? (
                            <p className="p-8 text-center text-sm text-[#718174]">
                                Loading listings…
                            </p>
                        ) : filteredListings.length === 0 ? (
                            <p className="p-8 text-center text-sm text-[#718174]">
                                {listings.length === 0
                                    ? "No clothing listings found."
                                    : "No listings match your search."}
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-[#f7f8f2] text-xs uppercase tracking-wide text-[#718174]">
                                    <tr>
                                        <th className="px-5 py-4">Listing</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Size</th>
                                        <th className="px-5 py-4">City</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Action</th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#edf0e9]">
                                    {filteredListings.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#fbfcf8]">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.imageUrls?.[0] ? (
                                                        <img
                                                            src={item.imageUrls[0]}
                                                            alt={item.title || "Clothing listing"}
                                                            className="h-12 w-12 rounded-lg border border-[#e4e9df] object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0f1ed]">
                                                            ♧
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold">
                                                            {item.title || "Untitled listing"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-[#718174]">
                                                            {item.brand || "No brand"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">{item.category || "—"}</td>
                                            <td className="px-5 py-4">{item.size || "—"}</td>
                                            <td className="px-5 py-4">{item.city || "—"}</td>

                                            <td className="px-5 py-4">
                                    <span className="rounded-full bg-[#f0f1ed] px-3 py-1 text-xs font-medium">
                                        {item.status || "UNKNOWN"}
                                    </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => setPendingListing(item)}
                                                    disabled={deletingListingId === item.id}
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingListingId === item.id
                                                        ? "Deleting…"
                                                        : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
                <section className="mt-10 pb-8">
                    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Admin Analytics</h2>
                            <p className="mt-1 text-sm text-[#718174]">
                                Current community metrics and marketplace activity.
                            </p>
                        </div>

                        <button
                            onClick={loadAnalytics}
                            disabled={analyticsLoading}
                            className="rounded-xl border border-[#dbe5d9] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#edf4eb] disabled:opacity-50"
                        >
                            Refresh analytics
                        </button>
                    </div>

                    {analyticsError && (
                        <div role="alert"
                             className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {analyticsError}
                            <button
                                onClick={loadAnalytics}
                                className="ml-3 font-semibold underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {analyticsLoading ? (
                        <p className="rounded-2xl border border-[#e4e9df] bg-white p-8 text-center text-sm text-[#718174]">
                            Loading analytics…
                        </p>
                    ) : analytics ? (
                        <>
                            <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    ["Total users", analytics.totalUsers],
                                    ["Inactive users", analytics.inactiveUsers],
                                    ["Available listings", analytics.availableListings],
                                    ["Accepted swaps", analytics.acceptedSwaps],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl border border-[#e4e9df] bg-white p-5 shadow-sm"
                                    >
                                        <p className="text-sm text-[#718174]">{label}</p>
                                        <p className="mt-3 text-3xl font-semibold">
                                            {(value ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-5 xl:grid-cols-2">
                                <section className="rounded-2xl border border-[#e4e9df] bg-white p-5 shadow-sm">
                                    <h3 className="font-semibold">Community overview</h3>
                                    <p className="mt-1 text-sm text-[#718174]">
                                        Compare current counts across key metrics.
                                    </p>

                                    <div className="mt-5 h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={overviewData}
                                                margin={{top: 10, right: 10, left: -15, bottom: 35}}
                                            >
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-20}
                                                    textAnchor="end"
                                                    interval={0}
                                                    height={65}
                                                    tick={{fontSize: 11}}
                                                />
                                                <YAxis allowDecimals={false}/>
                                                <Tooltip/>
                                                <Bar
                                                    dataKey="total"
                                                    name="Count"
                                                    fill="#15803d"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-[#e4e9df] bg-white p-5 shadow-sm">
                                    <h3 className="font-semibold">Swap request breakdown</h3>
                                    <p className="mt-1 text-sm text-[#718174]">
                                        Current requests by status.
                                    </p>

                                    <div className="mt-5 h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={swapData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="45%"
                                                    outerRadius={95}
                                                    label={({name, value}) => `${name}: ${value}`}
                                                >
                                                    {swapData.map((entry, index) => (
                                                        <Cell
                                                            key={entry.name}
                                                            fill={chartColors[index % chartColors.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section
                                    className="rounded-2xl border border-[#e4e9df] bg-white p-5 shadow-sm xl:col-span-2">
                                    <h3 className="font-semibold">User and listing status</h3>
                                    <p className="mt-1 text-sm text-[#718174]">
                                        Active versus inactive users and available versus swapped listings.
                                    </p>

                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        {[
                                            {
                                                title: "User accounts",
                                                data: communityData.slice(0, 2),
                                            },
                                            {
                                                title: "Clothing listings",
                                                data: communityData.slice(2, 4),
                                            },
                                        ].map((group) => (
                                            <div key={group.title}>
                                                <h4 className="mb-2 text-sm font-medium">
                                                    {group.title}
                                                </h4>
                                                <div className="h-64">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={group.data}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                cx="50%"
                                                                cy="45%"
                                                                outerRadius={75}
                                                                label={({value}) => value}
                                                            >
                                                                {group.data.map((entry, index) => (
                                                                    <Cell
                                                                        key={entry.name}
                                                                        fill={chartColors[index + (group.title === "Clothing listings" ? 2 : 0)]}
                                                                    />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip/>
                                                            <Legend/>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </>
                    ) : (
                        <p className="rounded-2xl border border-[#e4e9df] bg-white p-8 text-center text-sm text-[#718174]">
                            Analytics data is unavailable.
                        </p>
                    )}
                    <AdminActivityLogs />
                </section>

            </main>

            {pendingUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setPendingUser(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="status-dialog-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2 id="status-dialog-title" className="text-xl font-semibold">
                            {pendingUser.active ? "Deactivate account?" : "Reactivate account?"}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#718174]">
                            {pendingUser.active
                                ? `This will disable ${pendingUser.fullName || pendingUser.email}'s account. They will no longer be able to use authenticated features.`
                                : `This will restore ${pendingUser.fullName || pendingUser.email}'s account access.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setPendingUser(null)}
                                className="rounded-xl border border-[#dbe5d9] px-4 py-2 text-sm font-semibold hover:bg-[#f7f8f2]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                                    pendingUser.active
                                        ? "bg-red-700 hover:bg-red-800"
                                        : "bg-emerald-700 hover:bg-emerald-800"
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {pendingListing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setPendingListing(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-listing-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2 id="delete-listing-title" className="text-xl font-semibold">
                            Delete this listing?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#718174]">
                            You're about to permanently delete "{pendingListing.title}".
                            This action cannot be undone. Check any associated swap requests
                            before confirming.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setPendingListing(null)}
                                className="rounded-xl border border-[#dbe5d9] px-4 py-2 text-sm font-semibold hover:bg-[#f7f8f2]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteListing}
                                className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
