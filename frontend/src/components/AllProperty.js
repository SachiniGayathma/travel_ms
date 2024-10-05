import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

function AllProperty() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // State for selected property type
  const [location, setLocation] = useState(""); // State for selected location
  const [deletedProperty, setDeletedProperty] = useState(null); // Store the deleted property
  const [showTick, setShowTick] = useState(false); // Track if tick animation should be shown
  const [isDeleting, setIsDeleting] = useState(false); // Track if deletion is in progress
  const navigate = useNavigate();

  useEffect(() => {
    function getProperties() {
      axios
        .get("http://localhost:8070/property/")
        .then((res) => {
          setProperties(res.data);
          setFilteredProperties(res.data); // Initially show all properties
        })
        .catch((err) => {
          alert("Error fetching properties: " + err.message);
        });
    }

    getProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const matchesType = propertyType ? property.type === propertyType : true;
      const matchesLocation = location ? property.destination === location : true;
      return matchesType && matchesLocation;
    });
    setFilteredProperties(filtered);
  }, [propertyType, location, properties]);

  const handleViewMoreClick = (property) => {
    navigate(`/get/${property._id}`);
  };

  const handleEditClick = (property) => {
    navigate(`/update/${property._id}`);
  };

  const handleDeleteClick = (property) => {
    setDeletedProperty(property);
    setIsDeleting(true); // Show confirmation
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8070/property/delete/${deletedProperty._id}`)
      .then(() => {
        setProperties(properties.filter((property) => property._id !== deletedProperty._id));
        setShowTick(true); // Show tick animation
        setIsDeleting(false); // Hide confirmation
        setTimeout(() => {
          setShowTick(false); // Hide tick animation after 3 seconds
          setDeletedProperty(null);
        }, 3000);
      })
      .catch((err) => {
        alert("Error deleting property: " + err.message);
        setIsDeleting(false); // Hide confirmation
        setDeletedProperty(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleting(false); // Hide confirmation
    setDeletedProperty(null);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = `Exciting Travel Holiday's Partners in ${location}`;
    const propertyTypeHeader = `Property Type: ${propertyType}`;
    const tableData = filteredProperties.map(property => [
      property.name,
      property.winterCharge + property.chargePerHead,
      property.summerCharge + property.chargePerHead
    ]);

    doc.setFontSize(20);
    doc.text(title, 14, 20);
    doc.setFontSize(14);
    doc.text(propertyTypeHeader, 14, 30);
    
    doc.autoTable({
      head: [['Property Name', 'Winter Charges', 'Summer Charges']],
      body: tableData,
      startY: 40,
    });

    doc.save('filtered_properties.pdf');
  };

  return (
    <div className="all-property-container">
      <h1>Exciting Travel Holiday's Partners</h1>

      <div className="filter-section">
        <label>
          Property Type:
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Hotel">Hotel</option>
            <option value="Villa">Villa</option>
            <option value="Resort">Resort</option>
            {/* Add more property types as needed */}
          </select>
        </label>

        <label>
          Location:
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All Locations</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Kandy">Kandy</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Matara">Matara</option>
            <option value="Negombo">Negombo</option>
            <option value="Ella">Ella</option>
            <option value="Anuradhapura">Anuradhapura</option>
          </select>
        </label>

        <button onClick={downloadPDF}>Download List</button>
      </div>

      {(isDeleting || showTick) && (
        <>
          <div className="backdrop"></div>
          <div className="success-message">
            <div className="message-content">
              {showTick ? (
                <>
                  <div className="tick-animation show"></div>
                  <p>Property '{deletedProperty.name}' deleted successfully</p>
                </>
              ) : (
                <>
                  <div className="question-mark-animation"></div>
                  <p>Are you sure you want to delete property '{deletedProperty.name}'?</p>
                </>
              )}
            </div>
            {!showTick && (
              <div className="button-group">
                <button onClick={confirmDelete}>Yes, Delete</button>
                <button onClick={cancelDelete}>Cancel</button>
              </div>
            )}
          </div>
        </>
      )}

      <div className="property-cards-container">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property._id} className="property-card">
              <img src={property.imageUrls[0]} alt="Property" className="property-image" />
              <div className="property-details">
                <h3 className="property-name">{property.name}</h3>
                <p><strong>Type:</strong> {property.type}</p>
                <p><strong>Destination:</strong> {property.destination}</p>
                <p><strong>Standard Rate:</strong> ${property.chargePerHead}</p>

                {property.roomCategories.length > 0 && (
                  <div className="room-categories">
                    <h4>Room Categories:</h4>
                    <ul>
                      {property.roomCategories.map((category, index) => (
                        <li key={index} className="room-category-item">
                          <i className="fas fa-bed room-icon"></i>
                          <strong>{category.category}:</strong> ${category.charges}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="action-buttons">
                <button type="button" className="btn btn-success" onClick={() => handleViewMoreClick(property)}>
                  <i className="fas fa-eye"></i> View More
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleEditClick(property)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDeleteClick(property)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No properties available.</p>
        )}
      </div>
    </div>
  );
}

export default AllProperty;
