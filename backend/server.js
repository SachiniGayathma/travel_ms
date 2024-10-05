const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");   
const dotenv = require("dotenv");
const multer = require('multer');
const path = require('path');


dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB Connected Successfully");
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name format
    },
});

const upload = multer({ storage: storage });
//a small change
// Import the property routes
const propertyRouter = require("./routes/Properties.js");
const packageRouter = require("./routes/packageRoutes.js")

// Use the property router for "/property" endpoint
app.use("/property", propertyRouter);
app.use("/package", packageRouter)
app.use('/uploads', express.static('uploads'));



// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
