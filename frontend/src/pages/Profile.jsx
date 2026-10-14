import {useEffect, useState} from "react";

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("rewearUser");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch {
            setUser(null);
        }
    }, []);

    if (!user) {
        return (
            <main className="min-h-screen bg-stone-50 px-4 py-16">
                <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 text-center">
                    <h1 className="text-2xl font-bold text-stone-900">
                        Profile unavailable
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Please log in to view your profile.
                    </p>
                </div>
            </main>
        );
    }

    const displayName =
        user.fullName || user.name || user.username || "ReWear Member";

    const details = [
        {label: "Full name", value: displayName},
        {label: "Email", value: user.email},
        {label: "Username", value: user.username},
        {label: "City", value: user.city},
    ].filter((item) => item.value);

    return (
        <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Your account
                    </p>
                    <h1 className="text-3xl font-bold text-stone-900">
                        My Profile
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Your account information in one place.
                    </p>
                </div>

                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <div className="bg-emerald-800 px-6 py-8 text-white sm:px-8">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-emerald-800">
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold">
                            {displayName}
                        </h2>

                        <p className="mt-1 text-sm text-emerald-100">
                            ReWear community member
                        </p>
                    </div>

                    <div className="divide-y divide-stone-100 px-6 sm:px-8">
                        {details.map((item) => (
                            <div
                                key={item.label}
                                className="grid gap-1 py-5 sm:grid-cols-3 sm:gap-4"
                            >
                                <p className="text-sm font-medium text-stone-500">
                                    {item.label}
                                </p>
                                <p className="break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-100 bg-stone-50 px-6 py-4 sm:px-8">
                        <p className="text-xs text-stone-500">
                            Profile details are currently read-only.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
