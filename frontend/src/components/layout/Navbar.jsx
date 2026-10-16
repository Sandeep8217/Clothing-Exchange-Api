
import { useState } from "react";

function LeafMark() {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
            aria-hidden="true"
        >
            <path
                d="M12 48C13 25 29 10 53 8C51 31 38 48 12 48Z"
                fill="#739A73"
            />
            <path
                d="M12 48C23 34 34 22 50 12"
                stroke="#214B37"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M25 33C22 25 23 18 27 12C36 16 39 24 38 31"
                fill="#B9D5B2"
            />
            <path
                d="M12 48C10 54 7 57 4 59"
                stroke="#214B37"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M12 48C21 46 27 49 30 55"
                stroke="#214B37"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function NavIcon({ name, className = "h-5 w-5" }) {
    const common = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    switch (name) {
        case "explore":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="m15.8 8.2-2.5 5.1-5.1 2.5 2.5-5.1 5.1-2.5Z" />
                </svg>
            );
        case "wardrobe":
            return (
                <svg {...common}>
                    <path d="m9 4-5 4 3 4 3-2v10h8V10l3 2 3-4-5-4" />
                    <path d="M9 4c0 2 6 2 6 0" />
                </svg>
            );
        case "swaps":
            return (
                <svg {...common}>
                    <path d="M17 3l4 4-4 4" />
                    <path d="M3 11V9a2 2 0 0 1 2-2h16" />
                    <path d="m7 21-4-4 4-4" />
                    <path d="M21 13v2a2 2 0 0 1-2 2H3" />
                </svg>
            );
        case "profile":
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
            );
        case "logout":
            return (
                <svg {...common}>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                </svg>
            );
        case "plus":
            return (
                <svg {...common}>
                    <path d="M12 5v14M5 12h14" />
                </svg>
            );
        case "menu":
            return (
                <svg {...common}>
                    <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            );
        case "close":
            return (
                <svg {...common}>
                    <path d="m18 6-12 12M6 6l12 12" />
                </svg>
            );
        default:
            return null;
    }
}

export default function Navbar({
                                   user,
                                   logout,
                                   setClothingError,
                                   setClothingSuccess,
                                   setShowAddClothing,
                                   openAuth,
                                   activePage = "marketplace",
                                   onNavigate,
                               }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const displayName = user?.fullName || user?.name || "there";
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const navItems = [
        { id: "marketplace", label: "Explore", icon: "explore" },
        { id: "wardrobe", label: "My Wardrobe", icon: "wardrobe", auth: true },
        { id: "swaps", label: "My Swaps", icon: "swaps", auth: true },
        { id: "profile", label: "Profile", icon: "profile", auth: true },
    ];

    function navigate(page) {
        onNavigate(page);
        setMobileMenuOpen(false);
    }

    function handleAddClothing() {
        setClothingError("");
        setClothingSuccess("");
        setShowAddClothing(true);
        setMobileMenuOpen(false);
    }

    function renderNavLinks(mobile = false) {
        return navItems
            .filter((item) => !item.auth || user)
            .map((item) => {
                const active = activePage === item.id;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.id)}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            active
                                ? "bg-emerald-100/90 text-emerald-900 shadow-sm ring-1 ring-emerald-200/70"
                                : "text-stone-600 hover:bg-white/80 hover:text-emerald-900"
                        } ${mobile ? "w-full justify-start" : "whitespace-nowrap"}`}
                    >
                        <NavIcon
                            name={item.icon}
                            className={`h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-105 ${
                                active ? "text-emerald-800" : ""
                            }`}
                        />
                        <span>{item.label}</span>
                        {/*{active && !mobile && (*/}
                        {/*    <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-600" />*/}
                        {/*)}*/}
                    </button>
                );
            });
    }

    return (
        <header className="sticky top-0 z-40 border-b border-[#e8e6dd]/80 bg-[#f8f7f1]/85 backdrop-blur-2xl">
            <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
                <nav
                    aria-label="Main navigation"
                    className="relative rounded-[22px] border border-white/90 bg-white/75 px-3 py-3 shadow-[0_8px_30px_rgba(34,64,46,0.06)] ring-1 ring-stone-200/50 sm:px-5 lg:px-6"
                >
                    <div className="flex min-h-[58px] items-center justify-between gap-3 xl:gap-6">
                        {/* Brand */}
                        <button
                            type="button"
                            onClick={() => navigate("marketplace")}
                            aria-label="ReWear home"
                            className="group flex min-w-0 shrink-0 items-center gap-1.5 text-left"
                        >
                            <LeafMark />
                            <span className="flex flex-col">
                <span className="font-serif text-[34px] font-semibold leading-[0.95] tracking-[-2px] sm:text-[39px]">
                  <span className="text-[#214b37]">Re</span>
                  <span className="text-[#739a73]">Wear</span>
                  <span className="text-[#07845d]">.</span>
                </span>
                <span className="mt-2 hidden text-[8px] font-bold uppercase tracking-[3px] text-[#526458] sm:block sm:text-[9px]">
                  Give clothes a second life
                </span>
              </span>
                        </button>

                        {/* Desktop navigation */}
                        <div className="hidden items-center gap-1 xl:flex xl:gap-2">
                            {renderNavLinks()}
                        </div>

                        {/* Desktop account actions */}
                        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2.5 border-l border-stone-200 pl-4 xl:pl-5">
                                        {/*<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-gradient-to-br from-[#d8eddd] to-[#f1ead8] font-serif text-sm font-bold text-emerald-900 ring-2 ring-white">*/}
                                        {/*    {initials || "R"}*/}
                                        {/*</div>*/}
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-emerald-100 ring-1 ring-emerald-200 shadow-sm">
                                            {user?.profileImageUrl ? (
                                                <img
                                                    src={user.profileImageUrl}
                                                    alt={`${displayName}'s profile`}
                                                    className="h-full w-full object-cover"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d8eddd] to-[#f1ead8] font-serif text-sm font-bold text-emerald-900">
                                                    {initials || "R"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="max-w-[145px]">
                                            <p className="truncate text-sm font-bold text-stone-800">
                                                Hi, {displayName}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                                                Keep swapping
                                                <span aria-hidden="true">🌿</span>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="inline-flex items-center gap-2 rounded-full border border-stone-300/90 bg-white/80 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
                                    >
                                        <NavIcon name="logout" className="h-[18px] w-[18px]" />
                                        Log out
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAddClothing}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(5,120,85,0.20)] transition duration-200 hover:-translate-y-0.5 hover:from-emerald-800 hover:to-emerald-700 hover:shadow-[0_8px_20px_rgba(5,120,85,0.28)] active:translate-y-0"
                                    >
                                        <NavIcon name="plus" className="h-5 w-5" />
                                        Add Clothing
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => openAuth("login")}
                                        className="rounded-full px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openAuth("register")}
                                        className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Compact navigation for tablet and mobile */}
                        <div className="flex shrink-0 items-center gap-2 lg:hidden">
                            {user && (
                                <button
                                    type="button"
                                    onClick={handleAddClothing}
                                    aria-label="Add clothing"
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-md transition hover:bg-emerald-800 sm:w-auto sm:gap-2 sm:px-4"
                                >
                                    <NavIcon name="plus" className="h-5 w-5" />
                                    <span className="hidden text-sm font-bold sm:inline">
                    Add Clothing
                  </span>
                                </button>
                            )}

                            {!user && (
                                <button
                                    type="button"
                                    onClick={() => openAuth("login")}
                                    className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50"
                                >
                                    Log in
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((open) => !open)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                            >
                                <NavIcon name={mobileMenuOpen ? "close" : "menu"} className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile dropdown */}
                    {mobileMenuOpen && (
                        <div className="mt-4 border-t border-stone-200/80 pt-4 lg:hidden">
                            {user && (
                                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#f4f5ed] p-3">

                                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-emerald-100 shadow-sm ring-1 ring-emerald-200">
                                        {user?.profileImageUrl ? (
                                            <img
                                                src={user.profileImageUrl}
                                                alt={`${displayName}'s profile`}
                                                className="h-full w-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d8eddd] to-[#f1ead8] font-serif font-bold text-emerald-900">
                                                {initials || "R"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-stone-800">
                                            Hi, {displayName}
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            Your next great swap starts here.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-1">{renderNavLinks(true)}</div>

                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-200/80 pt-3">
                                {user ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                                    >
                                        <NavIcon name="logout" className="h-4 w-4" />
                                        Log out
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            openAuth("register");
                                        }}
                                        className="rounded-full border border-stone-300 bg-white px-3 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                                    >
                                        Sign up
                                    </button>
                                )}

                                {user ? (
                                    <button
                                        type="button"
                                        onClick={handleAddClothing}
                                        className="flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                                    >
                                        <NavIcon name="plus" className="h-4 w-4" />
                                        Add Clothing
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            openAuth("login");
                                        }}
                                        className="rounded-full bg-emerald-700 px-3 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                                    >
                                        Log in
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
