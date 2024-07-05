import { useState } from "react";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    is_sell: false,
    is_rent: false,
    is_parking: false,
    is_furnished: false,
    is_offer: false,
    num_bedrooms: 0,
    num_bathrooms: 0,
    regular_price: 0,
    discounted_price: 0,
    images: [],
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: filesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        data.append(key, formData[key]);
      }
    });

    formData.images.forEach((file) => {
      data.append("images", file);
    });


    try {
      const response = await fetch(
        "http://localhost:3001/create-listing",
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Listing created successfully!");
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating listing");
    }
  };

  return (
    <main>
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="p-3 max-w-4xl mx-auto shadow-lg rounded-lg">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="border border-gray-800 p-3 rounded-lg w-full mb-4"
            id="name"
            maxLength="62"
            minLength="5"
            required
          />
          <textarea
            type="text"
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 p-3 rounded-lg w-full mb-4 h-32"
            id="description"
            required
          />
          <input
            type="text"
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 p-3 rounded-lg w-full mb-4"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_sell"
                checked={formData.is_sell}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm">Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_rent"
                checked={formData.is_rent}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm">Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_parking"
                checked={formData.is_parking}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm">Parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_furnished"
                checked={formData.is_furnished}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm">Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_offer"
                checked={formData.is_offer}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 ">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="num_bedrooms"
                value={formData.num_bedrooms}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-sm">Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="num_bathrooms"
                value={formData.num_bathrooms}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-sm">Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regular_price"
                value={formData.regular_price}
                onChange={handleChange}
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="text-sm">Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discounted_price"
                value={formData.discounted_price}
                onChange={handleChange}
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="text-sm">Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 p-3  shadow-lg rounded-lg">
          <p className="font-semibold">
            Images
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-1 items-center">
            <input
              className="p-3 flex-1 border border-gray-300 rounded-lg"
              type="file"
              onChange={handleFileChange}
              id="images"
              accept="image/*"
              multiple
            />
          </div>
          <button className="py-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 disabled:opacity-50">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
