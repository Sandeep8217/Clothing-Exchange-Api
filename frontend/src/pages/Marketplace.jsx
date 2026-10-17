import {useEffect, useState} from "react";
import {createSwap} from "../api/swaps";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/marketplace/Hero";
import ClothingGrid from "../components/marketplace/ClothingGrid";
import HowItWorks from "../components/marketplace/HowItWorks";
import Community from "../components/marketplace/Community";
import SwapModal from "../components/modals/SwapModal";
import AuthModal from "../components/modals/AuthModal";
import AddClothingModal from "../components/modals/AddClothingModal";
import MyWardrobe from "./MyWardrobe";
import MySwaps from "./MySwaps";
import Profile from "./Profile";
import {
    getClothingWithSellers,
    getMyListings,
    createClothing,
} from "../api/clothing";
import AdminDashboard from "./AdminDashboard";

const categories = ["All", "Tops", "Bottoms", "Jackets", "Shoes", "Accessories"];

export default function Marketplace() {

    const [activePage, setActivePage] = useState("marketplace");

    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [clothes, setClothes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [authMode, setAuthMode] = useState(null);
    const [authMessage, setAuthMessage] = useState("");

    const {user, setUser , authLoading, authError, login, register, logout: logoutUser, setAuthError} = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(false);
    const [swapError, setSwapError] = useState("");
    const [swapMessage, setSwapMessage] = useState("");
    const [submittingSwap, setSubmittingSwap] = useState(false);
    const [offeredItemId, setOfferedItemId] = useState("");

    const [showAddClothing, setShowAddClothing] = useState(false);
    const [savingClothing, setSavingClothing] = useState(false);
    const [clothingError, setClothingError] = useState("");
    const [clothingSuccess, setClothingSuccess] = useState("");

    const [clothingForm, setClothingForm] = useState({
        title: "",
        description: "",
        category: "JACKETS",
        brand: "",
        size: "M",
        condition: "GOOD",
        imageUrl: "",
        estimatedSwapValue: "1000",
        city: "",
    });


    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        city: "",
    });

    useEffect(() => {
        getClothingWithSellers()
            .then((data) => {
                const listings = Array.isArray(data) ? data : [];

                const enrichedListings = listings.map((entry) => ({
                    ...entry.item,
                    seller: entry.seller || null,
                }));

                setClothes(enrichedListings);
            })
            .catch((err) => {
                setError(err.message || "Could not load clothing.");
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredClothes = clothes.filter((item) => {
        const matchesCategory =
            activeCategory === "All" ||
            item.category?.toLowerCase() === activeCategory.toLowerCase();

        const searchText =
            `${item.title || ""} ${item.brand || ""} ${item.category || ""} ${item.city || ""}`.toLowerCase();

        return matchesCategory && searchText.includes(search.toLowerCase());
    });

    function openAuth(mode) {
        setAuthMode(mode);
        setAuthError("");
        setAuthMessage("");
        setForm({
            fullName: "",
            email: "",
            password: "",
            phone: "",
            city: "",
        });
    }

    function closeAuth() {
        if (authLoading) return;
        setAuthMode(null);
        setAuthError("");
        setAuthMessage("");
    }

    function updateField(event) {
        const {name, value} = event.target;
        setForm((previous) => ({...previous, [name]: value}));
    }

    async function handleAuthSubmit(event) {
        event.preventDefault();
        setAuthError("");
        setAuthMessage("");

        try {
            if (authMode === "register") {
                await register({
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    phone: form.phone.trim(),
                    city: form.city.trim(),
                });

                setAuthMessage("Registration successful! You can now log in.");
                setAuthMode("login");
                setForm((previous) => ({...previous, password: ""}));
            } else {
                const data = await login({
                    email: form.email.trim(),
                    password: form.password,
                });

                if (!data.token || !data.user) {
                    throw new Error("Login response did not include a token and user.");
                }

                closeAuth();
            }
        } catch (err) {
            setAuthError(err.message || "Something went wrong. Please try again.");
        }
    }

    function logout() {
        logoutUser();
        setAuthMessage("You have been logged out.");
    }

    async function handleAddClothing(event) {
        event.preventDefault();

        setSavingClothing(true);
        setClothingError("");
        setClothingSuccess("");

        const payload = {
            title: clothingForm.title.trim(),
            description: clothingForm.description.trim(),
            category: clothingForm.category,
            brand: clothingForm.brand.trim(),
            size: clothingForm.size,
            condition: clothingForm.condition,
            imageUrls: [clothingForm.imageUrl.trim()],
            estimatedSwapValue: Number(clothingForm.estimatedSwapValue),
            city: clothingForm.city.trim(),
        };

        try {
            await createClothing(payload);

            setClothingSuccess("Your clothing has been listed successfully!");
            setAuthMessage("Your clothing has been listed successfully!");

            setClothingForm({
                title: "",
                description: "",
                category: "JACKETS",
                brand: "",
                size: "M",
                condition: "GOOD",
                imageUrl: "",
                estimatedSwapValue: "1000",
                city: "",
            });

            setShowAddClothing(false);

            const updatedClothing = await getClothingWithSellers();

            const enrichedListings = Array.isArray(updatedClothing)
                ? updatedClothing.map((entry) => ({
                    ...entry.item,
                    seller: entry.seller || null,
                }))
                : [];

            setClothes(enrichedListings);
        } catch (error) {
            setClothingError(error.message || "Could not add clothing.");
        } finally {
            setSavingClothing(false);
        }
    }


    async function openSwapModal(item) {
        if (!user) {
            openAuth("login");
            setAuthMessage("Log in to request a swap.");
            return;
        }

        setSelectedItem(item);
        setOfferedItemId("");
        setSwapError("");
        setSwapMessage("");
        setListingsLoading(true);

        try {
            const listings = await getMyListings();

            // Only offer items that are available for swapping.
            const availableListings = listings.filter(
                (listing) =>
                    listing.status === "AVAILABLE" &&
                    listing.id !== item.id &&
                    listing.ownerId === user.id
            );

            setMyListings(availableListings);
        } catch (err) {
            setSwapError(err.message || "Could not load your listings.");
        } finally {
            setListingsLoading(false);
        }
    }

    async function submitSwapRequest(event) {
        event.preventDefault();

        if (!selectedItem || !offeredItemId) {
            setSwapError("Please select an item to offer.");
            return;
        }

        setSubmittingSwap(true);
        setSwapError("");
        setSwapMessage("");

        try {
            await createSwap(selectedItem.id, offeredItemId);
            setSwapMessage("Swap request sent successfully!");
            setSelectedItem(null);
            setOfferedItemId("");
            window.alert("Your swap request was sent successfully!");
        } catch (err) {
            setSwapError(err.message || "Could not send swap request.");
        } finally {
            setSubmittingSwap(false);
        }
    }


    return (
        <div className="min-h-screen bg-[#fafaf7] text-stone-900">
            <Navbar
                {...{
                    user,
                    logout,
                    setClothingError,
                    setClothingSuccess,
                    setShowAddClothing,
                    openAuth,
                    activePage,
                    onNavigate: setActivePage,
                }}
            />
            {authMessage && !authMode && (
                <div className="mx-auto mt-4 max-w-7xl px-5"><p
                    className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{authMessage}</p></div>
            )}
            {activePage === "admin" && user?.role === "ADMIN" ? (
                    <AdminDashboard
                        onExit={() => setActivePage("marketplace")}
                    />
            ) : activePage === "wardrobe" ? (
                <MyWardrobe />
            ) : activePage === "swaps" ? (
                <MySwaps />
            ) : activePage === "profile" ? (
                <Profile user={user} setUser={setUser} />
            ) : (
                <main>
                    <Hero />
                    <ClothingGrid
                        {...{
                            search,
                            setSearch,
                            categories,
                            activeCategory,
                            setActiveCategory,
                            loading,
                            error,
                            filteredClothes,
                            openSwapModal,
                        }}
                    />
                    <HowItWorks />
                    <Community />
                </main>
            )}
            <Footer/>
            <SwapModal {...{
                selectedItem,
                setSelectedItem,
                submittingSwap,
                swapError,
                listingsLoading,
                myListings,
                submitSwapRequest,
                offeredItemId,
                setOfferedItemId
            }} />
            <AuthModal {...{
                authMode,
                closeAuth,
                authMessage,
                authError,
                authLoading,
                form,
                handleAuthSubmit,
                updateField,
                openAuth
            }} />
            <AddClothingModal {...{
                showAddClothing,
                setShowAddClothing,
                handleAddClothing,
                clothingForm,
                setClothingForm,
                clothingError,
                clothingSuccess,
                savingClothing
            }} />
        </div>
    );
}
