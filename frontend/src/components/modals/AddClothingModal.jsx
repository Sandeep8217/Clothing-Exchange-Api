export default function AddClothingModal(props) {
  const { showAddClothing, setShowAddClothing, handleAddClothing, clothingForm, setClothingForm, clothingError, clothingSuccess, savingClothing } = props;
  return (
    <>
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
    </>
  );
}
