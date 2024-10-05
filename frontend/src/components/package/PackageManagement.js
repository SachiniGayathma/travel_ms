import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas for QR code generation
import './PackageManagement.css';

export default function PackageManagement() {
    const [todos, setTodos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        packageName: "",
        packagePrice: "",
        numPassengers: "",
        location: "",
        services: ""
    });
    const apiUrl = "http://localhost:8000";
    const navigate = useNavigate();

    useEffect(() => {
        getItems();
    }, [searchQuery]);

    const getItems = () => {
        const url = searchQuery ? `${apiUrl}/packages?query=${searchQuery}` : `${apiUrl}/packages`;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            })
            .catch((err) => {
                console.error("Error fetching packages:", err);
            });
    };

    const handleEdit = (todo) => {
        setEditingPackage(todo._id);
        setFormData({
            packageName: todo.packageName,
            packagePrice: todo.packagePrice,
            numPassengers: todo.numPassengers,
            location: todo.location,
            services: todo.services
        });
    };

    const handleDelete = (id) => {
        fetch(`${apiUrl}/packages/${id}`, {
            method: "DELETE",
        }).then(() => getItems())
        .catch(err => console.error("Error deleting package:", err));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`${apiUrl}/packages/${editingPackage}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
        .then(() => {
            getItems();
            setEditingPackage(null);
        })
        .catch(err => console.error("Error updating package:", err));
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text("Travel Package Report", 20, 10);
        doc.autoTable({
            startY: 20,
            head: [['Package Name', 'Price', 'Passengers', 'Location', 'Services']],
            body: todos.map(todo => [
                todo.packageName, 
                `$${todo.packagePrice}`, 
                todo.numPassengers, 
                todo.location, 
                todo.services
            ])
        });

        doc.save("package-report.pdf");
    };

    const downloadQRCode = (todo) => {
        const canvas = document.getElementById(`qr-${todo._id}`);
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${todo.packageName}-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <>
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2 className="navbar-title">Travel Agency</h2>
                <ul className="navbar-links">
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/connect-package")}>Review</li>
                </ul>
            </nav>

            <h3 className="text-center">Manage Promo Packages</h3>
            <div className="form-group mb-3">
                <input
                    type="text"
                    placeholder="Search Packages"
                    className="form-control"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {editingPackage && (
                <form className="edit-form" onSubmit={handleUpdate}>
                    <h5>Editing Package</h5>
                    <input
                        type="text"
                        value={formData.packageName}
                        onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                        placeholder="Package Name"
                        className="form-control"
                    />
                    <input
                        type="number"
                        value={formData.packagePrice}
                        onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                        placeholder="Package Price"
                        className="form-control"
                    />
                    <input
                        type="number"
                        value={formData.numPassengers}
                        onChange={(e) => setFormData({ ...formData, numPassengers: e.target.value })}
                        placeholder="Passengers"
                        className="form-control"
                    />
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Location"
                        className="form-control"
                    />
                    <input
                        type="text"
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        placeholder="Services"
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-success mt-2">Update Package</button>
                </form>
            )}

            <div className="package-container">
                {todos.map((todo) => (
                    <div key={todo._id} className="package-card">
                        <div className="package-content">
                            <h5>{todo.packageName}</h5> {/* Package Name */}
                            <p>Price: ${todo.packagePrice}</p> {/* Package Price */}
                            <p>Passengers: {todo.numPassengers}</p> {/* Number of Passengers */}
                            <p>End Date: {new Date(todo.endDate).toLocaleDateString()}</p> {/* End Date */}
                            <p>Services: {todo.services.join(', ')}</p> {/* Services */}
                            <QRCodeCanvas
                                id={`qr-${todo._id}`}
                                value={`Package: ${todo.packageName}, Price: $${todo.packagePrice}, Passengers: ${todo.numPassengers}, Services: ${todo.services.join(', ')}, Location: ${todo.location},Package Image: ${todo.packageImage}`}
                                size={100} // Reduced size
                                level={"H"}
                                includeMargin={true}
                            />
                            <div className="button-group">
                                <button className="btn btn-primary" onClick={() => handleEdit(todo)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button>
                                <button className="btn btn-secondary" onClick={() => downloadQRCode(todo)}>Download QR</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-dark mt-4" onClick={generatePDF}>
                Generate PDF Report
            </button>
        </>
    );
}
