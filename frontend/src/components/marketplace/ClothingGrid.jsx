export default function ClothingGrid(props) {
    const {
        search,
        setSearch,
        categories,
        activeCategory,
        setActiveCategory,
        loading,
        error,
        filteredClothes,
        openSwapModal
    } = props;
    return (
        <>
            <section id="explore" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">The community
                            closet</p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your next
                            favourite</h2>
                        <p className="mt-3 text-stone-600">Great finds, ready for a second life.</p>
                    </div>

                    <label
                        className="flex w-full items-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-3 sm:max-w-xs">
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

                {loading &&
                    <p className="py-16 text-center text-stone-500">Loading clothing from the community closet...</p>}

                {!loading && error && (
                    <div className="my-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                        <p className="font-semibold">Could not load clothing.</p>
                        <p className="mt-1 text-sm">{error}</p>
                        <button onClick={() => window.location.reload()}
                                className="mt-3 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100">
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
                                <article key={item.id}
                                         className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
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
                                        <span
                                            className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">{item.condition}</span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{item.brand}</p>
                                                <h3 className="mt-1 font-bold">{item.title}</h3>
                                            </div>
                                            <p className="shrink-0 text-sm font-bold text-emerald-800">
                                                Swap value:
                                                ₹{Number(item.estimatedSwapValue || 0).toLocaleString("en-IN")}
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
                            <p className="py-16 text-center text-stone-500">No clothing found. Try another search or
                                category.</p>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
