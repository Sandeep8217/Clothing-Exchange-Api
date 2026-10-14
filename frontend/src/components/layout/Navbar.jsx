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
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          onClick={() => onNavigate("marketplace")}
          className="text-xl font-black tracking-tight text-emerald-800"
        >
          re<span className="text-stone-900">wear.</span>
        </button>

        <div className="flex items-center gap-2 text-sm font-medium md:gap-4">
          <button
            onClick={() => onNavigate("marketplace")}
            className={`rounded-full px-3 py-2 ${
    activePage === "marketplace"
        ? "bg-emerald-100 text-emerald-800"
        : "text-stone-600 hover:text-emerald-800"
}`}
          >
            Explore
          </button>

          {user && (
            <button
              onClick={() => onNavigate("wardrobe")}
              className={`rounded-full px-3 py-2 ${
    activePage === "wardrobe"
        ? "bg-emerald-100 text-emerald-800"
        : "text-stone-600 hover:text-emerald-800"
}`}
            >
              My Wardrobe
            </button>
          )}
            {user && (
                <button
                    onClick={() => onNavigate("swaps")}
                    className={`rounded-full px-3 py-2 ${
                        activePage === "swaps"
                            ? "bg-emerald-100 text-emerald-800"
                            : "text-stone-600 hover:text-emerald-800"
                    }`}
                >
                    My Swaps
                </button>
            )}
            {user && (
                <button
                    onClick={() => onNavigate("profile")}
                    className={`rounded-full px-3 py-2 ${
                        activePage === "profile"
                            ? "bg-emerald-100 text-emerald-800"
                            : "text-stone-600 hover:text-emerald-800"
                    }`}
                >
                    Profile
                </button>
            )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold sm:inline">
                Hi, {user.fullName || user.name || "there"}
              </span>

              <button
                onClick={logout}
                className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold hover:border-emerald-800 hover:text-emerald-800"
              >
                Log out
              </button>

              <button
                onClick={() => {
                  setClothingError("");
                  setClothingSuccess("");
                  setShowAddClothing(true);
                }}
                className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                + Add Clothing
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="rounded-full px-3 py-2 text-sm font-semibold hover:text-emerald-800"
              >
                Log in
              </button>

              <button
                onClick={() => openAuth("register")}
                className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
