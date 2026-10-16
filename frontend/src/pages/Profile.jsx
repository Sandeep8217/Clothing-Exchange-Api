
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";
import { uploadClothingImage } from "../api/cloudinary";

const EMPTY_PROFILE = {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    profileImageUrl: "",
};

export default function Profile() {
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [form, setForm] = useState(EMPTY_PROFILE);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    async function loadProfile() {
        setLoading(true);
        setError("");

        try {
            const data = await getProfile();
            setProfile({ ...EMPTY_PROFILE, ...data });
            setForm({ ...EMPTY_PROFILE, ...data });
        } catch (err) {
            setError(err.message || "Could not load your profile.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    function cancelEditing() {
        setForm({ ...profile });
        setEditing(false);
        setError("");
        setNotice("");
    }

    async function handlePhotoChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setError("");
        setNotice("");
        setUploading(true);

        try {
            const imageUrl = await uploadClothingImage(file);
            setForm((previous) => ({
                ...previous,
                profileImageUrl: imageUrl,
            }));
            setNotice("Photo uploaded. Save your profile to apply it.");
        } catch (err) {
            setError(err.message || "Photo upload failed.");
        } finally {
            setUploading(false);
        }
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const payload = {
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                city: form.city.trim(),
                bio: form.bio.trim(),
                profileImageUrl: form.profileImageUrl,
            };

            const updated = await updateProfile(payload);
            const nextProfile = { ...EMPTY_PROFILE, ...updated };

            setProfile(nextProfile);
            setForm(nextProfile);
            setEditing(false);
            setNotice("Profile updated successfully!");

            // Keep cached account details consistent where possible.
            try {
                const storedUser = localStorage.getItem("rewearUser");
                if (storedUser) {
                    const cachedUser = JSON.parse(storedUser);
                    localStorage.setItem(
                        "rewearUser",
                        JSON.stringify({
                            ...cachedUser,
                            fullName: nextProfile.fullName,
                            city: nextProfile.city,
                            phone: nextProfile.phone,
                            profileImageUrl: nextProfile.profileImageUrl,
                            bio: nextProfile.bio,
                        })
                    );
                }
            } catch {
                // The backend update has already succeeded.
            }
        } catch (err) {
            setError(err.message || "Could not save your profile.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-50 px-4 py-16">
                <p className="text-center text-stone-600">
                    Loading your profile...
                </p>
            </main>
        );
    }

    if (error && !profile.email && !profile.fullName) {
        return (
            <main className="min-h-screen bg-stone-50 px-4 py-16">
                <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 text-center">
                    <h1 className="text-2xl font-bold text-stone-900">
                        Could not load profile
                    </h1>
                    <p className="mt-2 text-stone-600">{error}</p>
                    <button
                        onClick={loadProfile}
                        className="mt-5 rounded-lg bg-emerald-800 px-5 py-2 text-white hover:bg-emerald-900"
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    const displayName = profile.fullName || "ReWear Member";

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
                        Manage your details and your ReWear identity.
                    </p>
                </div>

                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <div className="bg-emerald-800 px-6 py-8 text-white sm:px-8">
                        {form.profileImageUrl ? (
                            <img
                                src={form.profileImageUrl}
                                alt="Profile"
                                className="h-20 w-20 rounded-full border-2 border-white object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-emerald-800">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <h2 className="mt-4 text-2xl font-bold">
                            {displayName}
                        </h2>
                        <p className="mt-1 text-sm text-emerald-100">
                            ReWear community member
                        </p>

                        {editing && (
                            <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
                                {uploading ? "Uploading..." : "Change photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={uploading || saving}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {error && (
                        <div role="alert" className="mx-6 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:mx-8">
                            {error}
                        </div>
                    )}

                    {notice && (
                        <div role="status" className="mx-6 mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 sm:mx-8">
                            {notice}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        <div className="divide-y divide-stone-100 px-6 sm:px-8">
                            <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                                <label htmlFor="fullName" className="text-sm font-medium text-stone-500">
                                    Full name
                                </label>
                                {editing ? (
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
                                    />
                                ) : (
                                    <p className="break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                        {profile.fullName || "Not provided"}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                                <label className="text-sm font-medium text-stone-500">
                                    Email
                                </label>
                                <p className="break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                    {profile.email || "Not provided"}
                                </p>
                            </div>

                            <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                                <label htmlFor="phone" className="text-sm font-medium text-stone-500">
                                    Phone
                                </label>
                                {editing ? (
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength={20}
                                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
                                    />
                                ) : (
                                    <p className="break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                        {profile.phone || "Not provided"}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                                <label htmlFor="city" className="text-sm font-medium text-stone-500">
                                    City
                                </label>
                                {editing ? (
                                    <input
                                        id="city"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        maxLength={100}
                                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
                                    />
                                ) : (
                                    <p className="break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                        {profile.city || "Not provided"}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                                <label htmlFor="bio" className="text-sm font-medium text-stone-500">
                                    Bio
                                </label>
                                {editing ? (
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        maxLength={500}
                                        rows={4}
                                        placeholder="Tell the community a little about yourself..."
                                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
                                    />
                                ) : (
                                    <p className="whitespace-pre-wrap break-words text-sm font-semibold text-stone-800 sm:col-span-2">
                                        {profile.bio || "No bio added yet."}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-stone-100 bg-stone-50 px-6 py-4 sm:px-8">
                            {editing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={saving || uploading}
                                        className="rounded-lg border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || uploading}
                                        className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({ ...profile });
                                        setEditing(true);
                                        setError("");
                                        setNotice("");
                                    }}
                                    className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                                >
                                    Edit profile
                                </button>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
