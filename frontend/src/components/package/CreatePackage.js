import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePackage.css";

export default function CreatePackage() {
    const [packageName, setPackageName] = useState("");
    const [packagePrice, setPackagePrice] = useState("");
    const [packageImage, setPackageImage] = useState(null);
    const [numPassengers, setNumPassengers] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [services, setServices] = useState({
        tourGuide: false,
        vehicle: false,
        accommodation: false,
    });
    const [vehicleOptions, setVehicleOptions] = useState({
        jeep: false,
        bus: false,
        car: false,
        van: false,
    });
    const [accommodationOptions, setAccommodationOptions] = useState({
        villa: false,
        hotel: false,
        apartment: false,
    });
    const [locations, setLocations] = useState({
        colombo: false,
        kandy: false,
        galle: false,
        matara: false,
        negombo: false,
        jaffna: false,
        trincomalee: false,
        anuradhapura: false,
        nuwaraEliya: false,
        sigiriya: false,
        ella: false,
    });
    const [numNights, setNumNights] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const apiUrl = "http://localhost:8000";

    // Validation functions
    const validatePackageName = (name) => /^[A-Za-z\s]+$/.test(name); // Only letters and spaces
    const validateNumber = (value) => /^\d+$/.test(value); // Only digits

    const handleSubmit = () => {
        setError("");

        // Convert selected options into a comma-separated string to handle in the back-end
        const selectedServices = Object.entries(services)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(',');

        const selectedVehicles = Object.entries(vehicleOptions)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(',');

        const selectedAccommodations = Object.entries(accommodationOptions)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(',');

        const selectedLocations = Object.entries(locations)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(',');

        // Check validations
        if (!validatePackageName(packageName)) {
            setError("Package Name should contain only letters.");
            return;
        }
        if (!validateNumber(packagePrice)) {
            setError("Package Price should contain only numbers.");
            return;
        }
        if (!validateNumber(numPassengers)) {
            setError("Number of Passengers should contain only numbers.");
            return;
        }
        if (!validateNumber(numNights)) {
            setError("Number of Nights should contain only numbers.");
            return;
        }

        if (packageName && packagePrice && packageImage && numPassengers && startDate && endDate && selectedServices && numNights && selectedLocations) {
            const formData = new FormData();
            formData.append("packageName", packageName);
            formData.append("packagePrice", packagePrice);
            formData.append("packageImage", packageImage);
            formData.append("numPassengers", numPassengers);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.app("")
            formData.append("numNights", numNights);
            formData.append("services", selectedServices);
            formData.append("locations", selectedLocations);
            formData.append("vehicleOptions", selectedVehicles);
            formData.append("accommodationOptions", selectedAccommodations);

            fetch(apiUrl + "/packages", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data._id) {
                        setPackageName("");
                        setPackagePrice("");
                        setPackageImage(null);
                        setNumPassengers("");
                        setStartDate("");
                        setEndDate("");
                        setServices({ tourGuide: false, vehicle: false, accommodation: false });
                        setVehicleOptions({ jeep: false, bus: false, car: false, van: false });
                        setAccommodationOptions({ villa: false, hotel: false, apartment: false });
                        setLocations({
                            colombo: false, kandy: false, galle: false, matara: false, negombo: false, jaffna: false, trincomalee: false, anuradhapura: false, nuwaraEliya: false, sigiriya: false, ella: false
                        });
                        setNumNights("");
                        setMessage("Package added successfully");
                    } else {
                        setError("Unable to create Package item");
                    }
                })
                .catch((err) => {
                    console.error('Error creating package:', err);
                    setError("Unable to create Package item");
                });
        } else {
            setError("All fields are required");
        }
    };

    const toggleService = (service) => {
        setServices((prev) => ({ ...prev, [service]: !prev[service] }));
        if (service === 'vehicle') {
            setVehicleOptions({ jeep: false, bus: false, car: false, van: false });
        }
        if (service === 'accommodation') {
            setAccommodationOptions({ villa: false, hotel: false, apartment: false });
        }
    };

    const toggleVehicleOption = (vehicle) => {
        setVehicleOptions((prev) => ({ ...prev, [vehicle]: !prev[vehicle] }));
    };

    const toggleAccommodationOption = (accommodation) => {
        setAccommodationOptions((prev) => ({ ...prev, [accommodation]: !prev[accommodation] }));
    };

    const toggleLocation = (location) => {
        setLocations((prev) => ({ ...prev, [location]: !prev[location] }));
    };

    return (
        <div className="create-package-container">
            <nav className="navbar">
                <h2 className="navbar-title">Travel Agency</h2>
                <ul className="navbar-links">
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/packages")}>View Packages</li>
                </ul>
            </nav>
            <h3 className="text-center">Create New Package</h3>

            <div className="form-group d-flex flex-column gap-2 shadow-lg p-8 rounded">
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
                <input
                    placeholder="Package Name"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="form-control form-control-sm"
                    type="text"
                />
                <input
                    placeholder="Package Price"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(e.target.value)}
                    className="form-control form-control-sm"
                    type="number"
                />
                <input
                    type="file"
                    onChange={(e) => setPackageImage(e.target.files[0])}
                    className="form-control form-control-sm"
                />
                <input
                    placeholder="Number of Passengers"
                    value={numPassengers}
                    onChange={(e) => setNumPassengers(e.target.value)}
                    className="form-control form-control-sm"
                    type="number"
                />
                <input
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control form-control-sm"
                    type="date"
                />
                <input
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control form-control-sm"
                    type="date"
                />

                <div>
                    <label>
                    <h5>Select Services:</h5>
                        <input
                            type="checkbox"
                            checked={services.tourGuide}
                            onChange={() => toggleService('tourGuide')}
                        /> Tour Guide
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={services.vehicle}
                            onChange={() => toggleService('vehicle')}
                        /> Vehicle
                    </label>
                    {services.vehicle && (
                        <div className="vehicle-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={vehicleOptions.jeep}
                                    onChange={() => toggleVehicleOption('jeep')}
                                /> Jeep
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={vehicleOptions.bus}
                                    onChange={() => toggleVehicleOption('bus')}
                                /> Bus
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={vehicleOptions.car}
                                    onChange={() => toggleVehicleOption('car')}
                                /> Car
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={vehicleOptions.van}
                                    onChange={() => toggleVehicleOption('van')}
                                /> Van
                            </label>
                        </div>
                    )}
                    <label>
                        <input
                            type="checkbox"
                            checked={services.accommodation}
                            onChange={() => toggleService('accommodation')}
                        /> Accommodation
                    </label>
                    {services.accommodation && (
                        <div className="accommodation-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={accommodationOptions.villa}
                                    onChange={() => toggleAccommodationOption('villa')}
                                /> Villa
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={accommodationOptions.hotel}
                                    onChange={() => toggleAccommodationOption('hotel')}
                                /> Hotel
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={accommodationOptions.apartment}
                                    onChange={() => toggleAccommodationOption('apartment')}
                                /> Apartment
                            </label>
                        </div>
                    )}
                </div>
                <div>
                    <h5>Select Locations Covered:</h5>
                    {Object.keys(locations).map((location) => (
                        <label key={location}>
                            <input
                                type="checkbox"
                                checked={locations[location]}
                                onChange={() => toggleLocation(location)}
                            /> {location.charAt(0).toUpperCase() + location.slice(1)}
                        </label>
                    ))}
                </div>
                <input
                    placeholder="Number of Nights"
                    value={numNights}
                    onChange={(e) => setNumNights(e.target.value)}
                    className="form-control form-control-sm"
                    type="number"
                />

                <button onClick={handleSubmit} className="btn btn-success btn-sm">
                    Add Package
                </button>
            </div>
        </div>
    );
}
