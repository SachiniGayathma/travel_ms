const router = require("express").Router();
const Package = require("../models/package")
const multer = require('multer');
const path = require('path');

// router.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name format
    },
});

const upload = multer({ storage: storage });


router.get("/", async (req, res) => {
    try {
        const { query } = req.query;

        let packages;
        if (query) {
            packages = await Package.find({
                $or: [
                    { packageName: { $regex: query, $options: "i" } },
                    { services: { $regex: query, $options: "i" } },
                    { location: { $regex: query, $options: "i" } }
                ]
            });
        } else {
            packages = await Package.find();
        }

        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Error fetching packages' });
    }
})

router.post('/', upload.single('packageImage'), async (req, res) => {
    console.log('File:', req.file);  // Check if the file is being uploaded correctly
    console.log('Body:', req.body);  // Log the incoming data from the request

    // Extracting body parameters
    const {
        packageName,
        packagePrice,
        numPassengers,
        startDate,
        endDate,
        services,  // Already an array
        numNights,
        locations,  // Already an array
        vehicleOptions,
        accommodationOptions,
    } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    try {
        const newPackage = new Package({
            packageName,
            packagePrice,
            packageImage: req.file.path, // Save the image file path
            numPassengers,
            startDate,
            endDate,
            services: services.split(','),  // Ensure services and locations are arrays
            numNights,
            location: locations.split(','),  // Ensure location is an array
            vehicleOptions: vehicleOptions ? vehicleOptions.split(',') : [], // Ensure vehicle options are arrays
            accommodationOptions: accommodationOptions ? accommodationOptions.split(',') : []  // Ensure accommodation options are arrays
        });

        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Error saving package:', error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { packageName, packagePrice, packageImage, numPassengers, startDate, endDate, services, numNights, location } = req.body;
        const id = req.params.id;

        const updatedPackage = await Package.findByIdAndUpdate(id, { packageName, packagePrice, packageImage, numPassengers, startDate, endDate, services, numNights, location }, { new: true });

        if (updatedPackage) {
            res.status(200).json(updatedPackage);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ message: 'Error updating package' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (deletedPackage) {
            res.status(200).json({ message: 'Package deleted successfully' });
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ message: 'Error deleting package' });
    }
});


module.exports = router;