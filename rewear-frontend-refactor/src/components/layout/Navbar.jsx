export default function Navbar(props) {
    const {user, logout, setClothingError, setClothingSuccess, setShowAddClothing, openAuth} = props;
    return (
        <>
            <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
                <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
                    <a href="#" className="text-xl font-black tracking-tight text-emerald-800">
                        re<span className="text-stone-900">wear.</span>
                    </a>

                    <div className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex">
                        <a href="#explore" className="hover:text-emerald-800">Explore</a>
                        <a href="#how-it-works" className="hover:text-emerald-800">How it works</a>
                        <a href="#community" className="hover:text-emerald-800">Community</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                <span className="hidden text-sm font-semibold sm:inline">
                  Hi, {user.fullName}
                </span>
                                <button
                                    onClick={logout}
                                    className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:border-emerald-800 hover:text-emerald-800"
                                >
                                    Log out
                                </button>
                                <button
                                    onClick={() => {
                                        setClothingError("");
                                        setClothingSuccess("");
                                        setShowAddClothing(true);
                                    }}
                                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    + Add Clothing
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => openAuth("login")}
                                    className="rounded-full px-3 py-2.5 text-sm font-semibold hover:text-emerald-800"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => openAuth("register")}
                                    className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}
