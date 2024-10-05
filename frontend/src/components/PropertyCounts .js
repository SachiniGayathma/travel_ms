import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faHome, faBuilding, faHouseUser } from '@fortawesome/free-solid-svg-icons';

const locations = ['Ella', 'Kandy', 'Colombo', 'Galle', 'Sigiriya']; // List of locations to rotate
const FETCH_INTERVAL = 30000; // 1 minute in milliseconds

const PropertyCounts = () => {
    const [propertyCounts, setPropertyCounts] = useState({
        hotel: 0,
        villa: 0,
        apartment: 0,
        guestHouse: 0,
    });

    const [properties, setProperties] = useState([]); // Store property data by location
    const [mostViewedProperties, setMostViewedProperties] = useState([]); // Store most viewed properties
    const [currentLocation, setCurrentLocation] = useState('Ella'); // Start with Ella

    // Fetch property counts for the dashboard
    const fetchPropertyCounts = async () => {
        try {
            const response = await axios.get('http://localhost:8070/property/admin/propertycounts');
            setPropertyCounts({
                hotel: response.data.hotel || 0,
                villa: response.data.villa || 0,
                apartment: response.data.apartment || 0,
                guestHouse: response.data.guestHouse || 0
            });
        } catch (error) {
            console.error('Error fetching property counts:', error);
        }
    };

    // Fetch properties for the current location
    const fetchPropertiesByLocation = async (location) => {
        try {
            const response = await axios.get(`http://localhost:8070/property/properties/${location}`);
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    // Fetch the most viewed properties in the last 5 days
    const fetchMostViewedProperties = async () => {
        try {
            const response = await axios.get('http://localhost:8070/property/mostsearched');
            setMostViewedProperties(response.data);
        } catch (error) {
            console.error('Error fetching most viewed properties:', error);
        }
    };

    // Update location and fetch new properties every 1 minute
    useEffect(() => {
        fetchPropertyCounts(); // Fetch counts on component mount
        fetchPropertiesByLocation(currentLocation); // Initial fetch for properties
        fetchMostViewedProperties(); // Fetch most viewed properties on mount

        const intervalId = setInterval(() => {
            setCurrentLocation((prevLocation) => {
                const nextIndex = (locations.indexOf(prevLocation) + 1) % locations.length;
                const nextLocation = locations[nextIndex];
                fetchPropertiesByLocation(nextLocation); // Fetch new properties for the new location
                return nextLocation;
            });
        }, FETCH_INTERVAL);

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [currentLocation]);

    return (
        <div className="admincontainer">
            <h1>Admin Dashboard</h1>

            {/* Property Counts */}
            <div className="admincard-container">
                <div className="card hotel-card">
                    <FontAwesomeIcon icon={faHotel} size="3x" />
                    <h2>Hotels</h2>
                    <p>{propertyCounts.hotel}</p>
                </div>
                <div className="card villa-card">
                    <FontAwesomeIcon icon={faHome} size="3x" />
                    <h2>Villas</h2>
                    <p>{propertyCounts.villa}</p>
                </div>
                <div className="card apartment-card">
                    <FontAwesomeIcon icon={faBuilding} size="3x" />
                    <h2>Apartments</h2>
                    <p>{propertyCounts.apartment}</p>
                </div>
                <div className="card guesthouse-card">
                    <FontAwesomeIcon icon={faHouseUser} size="3x" />
                    <h2>Guest Houses</h2>
                    <p>{propertyCounts.guestHouse}</p>
                </div>
            </div>

            {/* Location-Based Property Suggestions */}
            <h1>Exciting Travel Holiday's Partners</h1>
            <h2>Properties in {currentLocation}</h2>
            <div className="property-card-container-admin">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div className="property-card-admin" key={property._id}>
                            <img
                                src={property.imageUrls[0] || 'placeholder-image.jpg'}
                                alt={property.name}
                                className="property-image-admin"
                            />
                            <h3>{property.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>No properties available in {currentLocation}</p>
                )}
            </div>

            {/* Most Viewed Properties in the Last 5 Days */}
            <h1>Most Viewed Properties in Last 5 Days</h1>
            <div className="property-card-container-admin">
                {mostViewedProperties.length > 0 ? (
                    mostViewedProperties.map((property) => (
                        <div className="property-card-admin" key={property._id}>
                            <img
                                src={property.imageUrls[0] || 'placeholder-image.jpg'}
                                alt={property.name}
                                className="property-image-admin"
                            />
                            <h3>{property.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>No properties viewed in the last 5 days</p>
                )}
            </div>
        </div>
    );
};

export default PropertyCounts;
