
import { useEffect, useState } from "react";
import { getClothing, getMyListings, createClothing , updateClothing,
  deleteClothing} from "./api/clothing";
import { createSwap, getMySwapRequests, getIncomingSwapRequests, acceptSwapRequest, rejectSwapRequest} from "./api/swaps";
import useAuth from "./hooks/useAuth";
import MyWardrobe from "./pages/MyWardrobe";

const categories = ["All", "Tops", "Bottoms", "Jackets", "Shoes", "Accessories"];

function App() {

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [authMode, setAuthMode] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  const { user, authLoading, authError, login, register, logout: logoutUser, setAuthError,} = useAuth();

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
  const [currentPage, setCurrentPage] = useState("marketplace");

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
    getClothing()
        .then((data) => setClothes(Array.isArray(data) ? data : []))
        .catch((err) => setError(err.message || "Could not load clothing."))
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
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
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
        setForm((previous) => ({ ...previous, password: "" }));
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

      const updatedClothing = await getClothing();
      setClothes(Array.isArray(updatedClothing) ? updatedClothing : []);
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

        {authMessage && !authMode && (
            <div className="mx-auto mt-4 max-w-7xl px-5">
              <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                {authMessage}
              </p>
            </div>
        )}

        <main>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20 lg:px-8">
            <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              Wear more. Waste less.
            </span>

              <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your next favorite outfit is already{" "}
                <span className="text-emerald-800">out there.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-stone-600">
                Give your pre-loved clothes a new home. Discover unique styles,
                exchange what you own, and refresh your wardrobe without buying new.
              </p>

              <a
                  href="#explore"
                  className="mt-8 inline-flex rounded-full bg-emerald-800 px-7 py-3.5 font-semibold text-white transition hover:bg-emerald-900"
              >
                Explore clothing <span className="ml-2">→</span>
              </a>

              <div className="mt-10 flex gap-8">
                <div><p className="text-2xl font-black">100%</p><p className="mt-1 text-sm text-stone-500">Swap focused</p></div>
                <div><p className="text-2xl font-black">Zero</p><p className="mt-1 text-sm text-stone-500">Money exchanged</p></div>
                <div><p className="text-2xl font-black">One</p><p className="mt-1 text-sm text-stone-500">Better planet</p></div>
              </div>
            </div>

            <div className="relative">
              <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
                  alt="Friends exploring fashion together"
                  className="h-[350px] w-full rounded-3xl object-cover shadow-xl md:h-[470px]"
              />
              <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-4 shadow-lg sm:left-8">
                <p className="text-sm font-bold">Good clothes deserve more lives.</p>
                <p className="mt-1 text-xs text-stone-500">Swap • Rewear • Repeat</p>
              </div>
            </div>
          </section>

          <section id="explore" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">The community closet</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your next favourite</h2>
                <p className="mt-3 text-stone-600">Great finds, ready for a second life.</p>
              </div>

              <label className="flex w-full items-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-3 sm:max-w-xs">
                <span aria-hidden="true">⌕</span>
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search clothes or brands..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />
              </label>
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                  <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                          activeCategory === category
                              ? "bg-emerald-800 text-white"
                              : "border border-stone-300 bg-white text-stone-600 hover:border-emerald-800 hover:text-emerald-800"
                      }`}
                  >
                    {category}
                  </button>
              ))}
            </div>

            {loading && <p className="py-16 text-center text-stone-500">Loading clothing from the community closet...</p>}

            {!loading && error && (
                <div className="my-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                  <p className="font-semibold">Could not load clothing.</p>
                  <p className="mt-1 text-sm">{error}</p>
                  <button onClick={() => window.location.reload()} className="mt-3 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100">
                    Try again
                  </button>
                </div>
            )}

            {!loading && !error && (
                <>
                  <p className="mt-6 text-sm text-stone-500">
                    {filteredClothes.length} {filteredClothes.length === 1 ? "item" : "items"} available
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredClothes.map((item) => (
                        <article key={item.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                          <div className="relative overflow-hidden bg-stone-100">
                            <img
                                src={item.imageUrls?.[0] || "https://placehold.co/600x500?text=Clothing+Item"}
                                alt={item.title || "Clothing item"}
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = "https://placehold.co/600x500?text=Image+Unavailable";
                                }}
                                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">{item.condition}</span>
                          </div>

                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{item.brand}</p>
                                <h3 className="mt-1 font-bold">{item.title}</h3>
                              </div>
                              <p className="shrink-0 text-sm font-bold text-emerald-800">
                                Swap value: ₹{Number(item.estimatedSwapValue || 0).toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                              <span>Size: {item.size}</span><span>·</span><span>{item.category}</span>
                              {item.city && <><span>·</span><span>{item.city}</span></>}
                            </div>

                            <button
                                onClick={() => openSwapModal(item)}
                                className="mt-5 w-full rounded-full border border-emerald-800 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-800 hover:text-white"
                            >
                              Request a swap
                            </button>

                          </div>
                        </article>
                    ))}
                  </div>

                  {filteredClothes.length === 0 && (
                      <p className="py-16 text-center text-stone-500">No clothing found. Try another search or category.</p>
                  )}
                </>
            )}
          </section>

          <section id="how-it-works" className="bg-emerald-950 px-5 py-16 text-white lg:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Simple by design</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">A better wardrobe, in three steps.</h2>
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {[
                  ["01", "List what you own", "Give clothes you no longer wear a new home."],
                  ["02", "Discover something new", "Find pieces that match your style and size."],
                  ["03", "Make the exchange", "Request a swap and agree with the other owner."],
                ].map(([number, title, description]) => (
                    <div key={number} className="rounded-2xl border border-white/15 p-6">
                      <p className="text-sm font-bold text-emerald-300">{number}</p>
                      <h3 className="mt-4 text-xl font-bold">{title}</h3>
                      <p className="mt-3 leading-6 text-emerald-100/75">{description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          <section id="community" className="px-5 py-16 text-center">
            <h2 className="text-3xl font-black">Your closet can do more.</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-stone-600">
              Make room for something new while giving someone else a great find.
              Start with one piece you no longer wear.
            </p>
          </section>
        </main>

        <footer className="border-t border-stone-200 bg-white px-5 py-6 text-center text-sm text-stone-500">
          © 2026 rewear. Made for a more circular wardrobe.
        </footer>


        {selectedItem && (
            <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
              <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">
                      Make an exchange
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Choose what you'll offer
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      Select one of your available items in exchange for{" "}
                      <strong>{selectedItem.title}</strong>.
                    </p>
                  </div>

                  <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      disabled={submittingSwap}
                      aria-label="Close swap dialog"
                      className="rounded-full px-3 py-1 text-xl text-stone-500 hover:bg-stone-100"
                  >
                    ×
                  </button>
                </div>

                {swapError && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                      {swapError}
                    </p>
                )}

                {listingsLoading ? (
                    <p className="py-10 text-center text-stone-500">
                      Loading your available clothes...
                    </p>
                ) : myListings.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-stone-50 p-5 text-center">
                      <p className="font-semibold">No available items to offer</p>
                      <p className="mt-2 text-sm text-stone-500">
                        List a piece of clothing first, then come back to request a swap.
                      </p>
                    </div>
                ) : (
                    <form onSubmit={submitSwapRequest} className="mt-6">
                      <div className="max-h-72 space-y-3 overflow-y-auto">
                        {myListings.map((listing) => (
                            <label
                                key={listing.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${
                                    offeredItemId === listing.id
                                        ? "border-emerald-800 bg-emerald-50"
                                        : "border-stone-200 hover:border-emerald-500"
                                }`}
                            >
                              <input
                                  type="radio"
                                  name="offeredItem"
                                  value={listing.id}
                                  checked={offeredItemId === listing.id}
                                  onChange={(event) => setOfferedItemId(event.target.value)}
                                  className="accent-emerald-800"
                              />

                              <img
                                  src={
                                      listing.imageUrls?.[0] ||
                                      "https://placehold.co/100x100?text=Clothing"
                                  }
                                  alt={listing.title}
                                  className="h-16 w-16 rounded-xl object-cover"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">{listing.title}</p>
                                <p className="text-sm text-stone-500">
                                  {listing.brand} · Size {listing.size}
                                </p>
                                <p className="text-sm font-semibold text-emerald-800">
                                  Swap value: ₹
                                  {Number(listing.estimatedSwapValue || 0).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </label>
                        ))}
                      </div>

                      <button
                          type="submit"
                          disabled={!offeredItemId || submittingSwap}
                          className="mt-6 w-full rounded-full bg-emerald-800 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingSwap ? "Sending request..." : "Send swap request"}
                      </button>
                    </form>
                )}
              </div>
            </div>
        )}


        {authMode && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeAuth();
                }}
            >
              <div className="my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">Welcome to rewear</p>
                    <h2 className="mt-2 text-2xl font-black">
                      {authMode === "login" ? "Welcome back" : "Create your account"}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      {authMode === "login" ? "Log in to continue swapping." : "Join the community and give clothes a second life."}
                    </p>
                  </div>
                  <button onClick={closeAuth} disabled={authLoading} aria-label="Close dialog" className="rounded-full px-3 py-1 text-xl text-stone-500 hover:bg-stone-100">×</button>
                </div>

                {authMessage && (
                    <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{authMessage}</p>
                )}

                {authError && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{authError}</p>
                )}

                <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                  {authMode === "register" && (
                      <>
                        <div>
                          <label htmlFor="fullName" className="mb-1 block text-sm font-semibold">Full name</label>
                          <input id="fullName" name="fullName" required maxLength={100} autoComplete="name" value={form.fullName} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Your full name" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Phone</label>
                          <input id="phone" name="phone" required maxLength={20} autoComplete="tel" value={form.phone} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Phone number" />
                        </div>
                        <div>
                          <label htmlFor="city" className="mb-1 block text-sm font-semibold">City</label>
                          <input id="city" name="city" required maxLength={100} autoComplete="address-level2" value={form.city} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Your city" />
                        </div>
                      </>
                  )}

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="you@example.com" />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label>
                    <input id="password" name="password" type="password" required minLength={8} maxLength={72} autoComplete={authMode === "login" ? "current-password" : "new-password"} value={form.password} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="At least 8 characters" />
                  </div>

                  <button type="submit" disabled={authLoading} className="w-full rounded-full bg-emerald-800 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
                    {authLoading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-stone-600">
                  {authMode === "login" ? "New to rewear?" : "Already have an account?"}{" "}
                  <button
                      onClick={() => openAuth(authMode === "login" ? "register" : "login")}
                      className="font-bold text-emerald-800 hover:underline"
                  >
                    {authMode === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
        )}
        {showAddClothing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <form
                  onSubmit={handleAddClothing}
                  className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add Your Clothing</h2>
                  <button
                      type="button"
                      onClick={() => setShowAddClothing(false)}
                      className="text-2xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  List your pre-loved clothes and find something new to swap.
                </p>

                <div>
                  <label className="mb-1 block text-sm font-medium">Title</label>
                  <input
                      required
                      maxLength={100}
                      value={clothingForm.title}
                      onChange={(e) =>
                          setClothingForm({ ...clothingForm, title: e.target.value })
                      }
                      placeholder="e.g. Blue denim jacket"
                      className="w-full rounded-lg border border-gray-300 p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                      required
                      maxLength={1000}
                      value={clothingForm.description}
                      onChange={(e) =>
                          setClothingForm({
                            ...clothingForm,
                            description: e.target.value,
                          })
                      }
                      placeholder="Describe the item and its condition"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 p-3"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Category</label>
                    <select
                        value={clothingForm.category}
                        onChange={(e) =>
                            setClothingForm({ ...clothingForm, category: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 p-3"
                    >
                      <option value="JACKETS">Jackets</option>
                      <option value="SHIRTS">Shirts</option>
                      <option value="T_SHIRTS">T-Shirts</option>
                      <option value="TROUSERS">Trousers</option>
                      <option value="JEANS">Jeans</option>
                      <option value="DRESSES">Dresses</option>
                      <option value="SHOES">Shoes</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Brand</label>
                    <input
                        required
                        maxLength={80}
                        value={clothingForm.brand}
                        onChange={(e) =>
                            setClothingForm({ ...clothingForm, brand: e.target.value })
                        }
                        placeholder="e.g. Adidas"
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Size</label>
                    <select
                        value={clothingForm.size}
                        onChange={(e) =>
                            setClothingForm({ ...clothingForm, size: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 p-3"
                    >
                      {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((size) => (
                          <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Condition</label>
                    <select
                        value={clothingForm.condition}
                        onChange={(e) =>
                            setClothingForm({ ...clothingForm, condition: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 p-3"
                    >
                      <option value="NEW">New</option>
                      <option value="LIKE_NEW">Like New</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Estimated Swap Value (₹)
                    </label>
                    <input
                        required
                        type="number"
                        min="0"
                        max="1000000"
                        step="1"
                        value={clothingForm.estimatedSwapValue}
                        onChange={(e) =>
                            setClothingForm({
                              ...clothingForm,
                              estimatedSwapValue: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">City</label>
                    <input
                        required
                        maxLength={80}
                        value={clothingForm.city}
                        onChange={(e) =>
                            setClothingForm({ ...clothingForm, city: e.target.value })
                        }
                        placeholder="e.g. Bengaluru"
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Image URL</label>
                  <input
                      required
                      type="url"
                      value={clothingForm.imageUrl}
                      onChange={(e) =>
                          setClothingForm({ ...clothingForm, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/clothing.jpg"
                      className="w-full rounded-lg border border-gray-300 p-3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use a direct image URL for now. We'll add image uploads later.
                  </p>
                </div>

                {clothingError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {clothingError}
                    </p>
                )}

                {clothingSuccess && (
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {clothingSuccess}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={savingClothing}
                    className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingClothing ? "Publishing..." : "Publish Clothing"}
                </button>
              </form>
            </div>
        )}
      </div>
  );
}

export default App;
