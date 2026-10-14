export default function SwapModal(props) {
  const { selectedItem, setSelectedItem, submittingSwap, swapError, listingsLoading, myListings, submitSwapRequest, offeredItemId, setOfferedItemId } = props;
  return (
    <>
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
    </>
  );
}
