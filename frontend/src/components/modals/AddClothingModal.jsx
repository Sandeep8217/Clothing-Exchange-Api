
import { useEffect, useState } from "react";
import { uploadClothingImage } from "../../api/cloudinary";

export default function AddClothingModal(props) {
  const {
    showAddClothing,
    setShowAddClothing,
    handleAddClothing,
    clothingForm,
    setClothingForm,
    clothingError,
    clothingSuccess,
    savingClothing,
  } = props;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageUploaded, setImageUploaded] = useState(
      Boolean(clothingForm.imageUrl)
  );

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleImageSelection(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Choose a JPG, PNG, or WebP image.");
      setSelectedFile(null);
      setImageUploaded(false);
      setClothingForm((previous) => ({
        ...previous,
        imageUrl: "",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be 5 MB or less.");
      setSelectedFile(null);
      setImageUploaded(false);
      setClothingForm((previous) => ({
        ...previous,
        imageUrl: "",
      }));
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImageUploaded(false);
    setUploadError("");

    // Clear the old image URL so the new photo must be uploaded.
    setClothingForm((previous) => ({
      ...previous,
      imageUrl: "",
    }));
  }

  async function handleImageUpload() {
    if (!selectedFile) {
      setUploadError("Please select an image first.");
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const imageUrl = await uploadClothingImage(selectedFile);

      setClothingForm((previous) => ({
        ...previous,
        imageUrl,
      }));

      setImageUploaded(true);
      setUploadError("");
    } catch (error) {
      setUploadError(error.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!clothingForm.imageUrl || !imageUploaded) {
      setUploadError("Please upload your clothing image before publishing.");
      return;
    }

    handleAddClothing(event);
  }

  function closeModal() {
    if (uploadingImage || savingClothing) return;

    setShowAddClothing(false);
    setSelectedFile(null);
    setUploadError("");
  }

  if (!showAddClothing) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add Your Clothing</h2>
            <button
                type="button"
                onClick={closeModal}
                disabled={uploadingImage || savingClothing}
                className="text-2xl text-gray-500 hover:text-gray-900 disabled:opacity-50"
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
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
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
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>
              <select
                  value={clothingForm.category}
                  onChange={(e) =>
                      setClothingForm({
                        ...clothingForm,
                        category: e.target.value,
                      })
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
                {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map(
                    (size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                    )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Condition
              </label>
              <select
                  value={clothingForm.condition}
                  onChange={(e) =>
                      setClothingForm({
                        ...clothingForm,
                        condition: e.target.value,
                      })
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

          <div className="space-y-3 rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-semibold">
              Clothing Photo
            </label>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelection}
                disabled={uploadingImage || savingClothing}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
            />

            <p className="text-xs text-gray-500">
              JPG, PNG, or WebP. Maximum file size: 5 MB.
            </p>

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Selected clothing preview"
                    className="h-48 w-full rounded-lg object-contain bg-gray-50"
                />
            )}

            {imageUploaded && clothingForm.imageUrl && (
                <p className="text-sm font-medium text-emerald-700">
                  Image uploaded successfully.
                </p>
            )}

            <button
                type="button"
                onClick={handleImageUpload}
                disabled={!selectedFile || uploadingImage || savingClothing}
                className="w-full rounded-lg border border-emerald-600 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImage
                  ? "Uploading image..."
                  : imageUploaded
                      ? "Upload New Image"
                      : "Upload Image"}
            </button>

            {uploadError && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {uploadError}
                </p>
            )}
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
              disabled={savingClothing || uploadingImage || !imageUploaded}
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingClothing
                ? "Publishing..."
                : uploadingImage
                    ? "Uploading image..."
                    : "Publish Clothing"}
          </button>
        </form>
      </div>
  );
}
