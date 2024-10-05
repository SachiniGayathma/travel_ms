import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EditProp() {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    destination: '',
    chargePerHead: '',
    winterCharge: '',
    summerCharge: '',
    adult2Sup: '',
    adult3Sup: '',
    minAgeFoc: '',
    maxAgeFoc: '',
    minAgeChargable: '',
    maxAgeChargable: '',
    childSup: '',
    breakSup: '',
    lunSup: '',
    dinSup: '',
    roomCategories: [],
    imageUrls: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  // Define available options for property type and destination
  const propertyTypes = ["Hotel", "Apartment", "Villa", "Resort", "Guest House"];
  const destinations = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna"];

  useEffect(() => {
    axios
      .get(`http://localhost:8070/property/get/${id}`)
      .then((res) => {
        setProperty(res.data);
        setFormData({
          name: res.data.name || '',
          type: res.data.type || '',
          destination: res.data.destination || '',
          chargePerHead: res.data.chargePerHead || '',
          winterCharge: res.data.winterCharge || '',
          summerCharge: res.data.summerCharge || '',
          adult2Sup: res.data.adult2Sup || '',
          adult3Sup: res.data.adult3Sup || '',
          minAgeFoc: res.data.minAgeFoc || '',
          maxAgeFoc: res.data.maxAgeFoc || '',
          minAgeChargable: res.data.minAgeChargable || '',
          maxAgeChargable: res.data.maxAgeChargable || '',
          childSup: res.data.childSup || '',
          breakSup: res.data.breakSup || '',
          lunSup: res.data.lunSup || '',
          dinSup: res.data.dinSup || '',
          roomCategories: res.data.roomCategories || [],
          imageUrls: res.data.imageUrls || [],
        });
      })
      .catch((err) => {
        alert("Error fetching property: " + err.message);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoomCategoryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRoomCategories = [...formData.roomCategories];
    updatedRoomCategories[index] = {
      ...updatedRoomCategories[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      roomCategories: updatedRoomCategories,
    }));
  };

  const handleAddRoomCategory = () => {
    setFormData((prevData) => ({
      ...prevData,
      roomCategories: [
        ...prevData.roomCategories,
        { category: "", charges: "" },
      ],
    }));
  };

  const handleRemoveRoomCategory = (index) => {
    const updatedRoomCategories = [...formData.roomCategories];
    updatedRoomCategories.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      roomCategories: updatedRoomCategories,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    // Add image files to the form data
    for (let i = 0; i < selectedFiles.length; i++) {
      form.append('images', selectedFiles[i]);
    }

    axios
      .put(`http://localhost:8070/property/update/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Property updated successfully");
      })
      .catch((err) => {
        alert("Error updating property: " + err.message);
      });
  };

  if (!property) {
    return <p>Loading property details...</p>;
  }

  return (
    <div className="edit-prop-container">
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Topic for Property Name */}
        <label htmlFor="name">Property Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Property Name"
        />

        {/* Topic for Property Type */}
        <label htmlFor="type">Property Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value="">Select Property Type</option>
          {propertyTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Topic for Destination */}
        <label htmlFor="destination">Destination</label>
        <select
          name="destination"
          value={formData.destination}
          onChange={handleInputChange}
        >
          <option value="">Select Destination</option>
          {destinations.map((destination, index) => (
            <option key={index} value={destination}>
              {destination}
            </option>
          ))}
        </select>

        {/* Topic for Charges */}
        <label htmlFor="chargePerHead">Charge Per Head</label>
        <input
          type="number"
          name="chargePerHead"
          value={formData.chargePerHead}
          onChange={handleInputChange}
          placeholder="Charge Per Head"
        />

        <label htmlFor="winterCharge">Winter Charge</label>
        <input
          type="number"
          name="winterCharge"
          value={formData.winterCharge}
          onChange={handleInputChange}
          placeholder="Winter Charge"
        />

        <label htmlFor="summerCharge">Summer Charge</label>
        <input
          type="number"
          name="summerCharge"
          value={formData.summerCharge}
          onChange={handleInputChange}
          placeholder="Summer Charge"
        />

<label>Adult 2 Supplement
        <input
          type="number"
          name="adult2Sup"
          value={formData.adult2Sup}
          onChange={handleInputChange}
          placeholder="Adult 2 Supplement"
        />
        </label>

        <label>Adult 3 Supplement
        <input
          type="number"
          name="adult3Sup"
          value={formData.adult3Sup}
          onChange={handleInputChange}
          placeholder="Adult 3 Supplement"
        />
        </label>

        <label>Minimum Age (F.O.C.)
        <input
          type="number"
          name="minAgeFoc"
          value={formData.minAgeFoc}
          onChange={handleInputChange}
          placeholder="Minimum Age (F.O.C.)"
        />
        </label>

        <label>Maximum Age (F.O.C.)
        <input
          type="number"
          name="maxAgeFoc"
          value={formData.maxAgeFoc}
          onChange={handleInputChange}
          placeholder="Maximum Age (F.O.C.)"
        />
        </label>

        <label>Minimum Age (Chargeable)
        <input
          type="number"
          name="minAgeChargable"
          value={formData.minAgeChargable}
          onChange={handleInputChange}
          placeholder="Minimum Age (Chargeable)"
        />
        </label>

        <label>Maximum Age (Chargeable)
        <input
          type="number"
          name="maxAgeChargable"
          value={formData.maxAgeChargable}
          onChange={handleInputChange}
          placeholder="Maximum Age (Chargeable)"
        />
        </label>

        <label>Child Supplement
        <input
          type="number"
          name="childSup"
          value={formData.childSup}
          onChange={handleInputChange}
          placeholder="Child Supplement"
        />
        </label>

        <label>Breakfast Supplement
        <input
          type="number"
          name="breakSup"
          value={formData.breakSup}
          onChange={handleInputChange}
          placeholder="Breakfast Supplement"
        />
        </label>

        <label>Lunch Supplement
        <input
          type="number"
          name="lunSup"
          value={formData.lunSup}
          onChange={handleInputChange}
          placeholder="Lunch Supplement"
        />
        </label>

        <label>Dinner Supplement
        <input
          type="number"
          name="dinSup"
          value={formData.dinSup}
          onChange={handleInputChange}
          placeholder="Dinner Supplement"
        />
        </label>
        
        <h3>Room Categories</h3>
        {formData.roomCategories.map((category, index) => (
          <div key={index}>
            <label>Room Category</label>
            <input
              type="text"
              name="category"
              value={category.category}
              onChange={(e) => handleRoomCategoryChange(index, e)}
              placeholder="Room Category"
            />
            <label>Charges</label>
            <input
              type="number"
              name="charges"
              value={category.charges}
              onChange={(e) => handleRoomCategoryChange(index, e)}
              placeholder="Charges"
            />
            <button type="button" onClick={() => handleRemoveRoomCategory(index)}>
              Remove Room Category
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddRoomCategory}>
          Add Room Category
        </button>

        <h3>Upload Property Images:</h3>
        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit">Update Property</button>
      </form>
    </div>
  );
}

export default EditProp;
