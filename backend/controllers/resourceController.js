import Resource from '../models/Resource.js';
import fs from 'fs';
import path from 'path';

// @desc Get all resources metadata
// @route GET /api/resources
export const getResources = async (req, res, next) => {
    try {
        // 🔒 Security: Populate 'uploadedBy' with only the username.
        const resources = await Resource.find({})
            .populate('uploadedBy', 'username')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        next(error);
    }
};

// @desc Upload a new resource file
// @route POST /api/resources/upload
export const uploadResource = async (req, res, next) => {
    // 🔒 Security: The file is already handled and validated by the Multer middleware.
    // We check if req.file exists to confirm the upload was successful.
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file.' });
    }

    try {
        const resource = new Resource({
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            // 🔒 Security: Link the upload to the authenticated user.
            uploadedBy: req.user._id,
        });

        const createdResource = await resource.save();
        res.status(201).json(createdResource);

    } catch (error) {
        // 🔒 Security: If there's a database error after a successful upload,
        // we should delete the orphaned file from the server to prevent clutter.
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting orphaned file:", err);
            });
        }
        next(error);
    }
};

// @desc Download a resource file
// @route GET /api/resources/download/:id
export const downloadResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // 🔒 Security: Use `res.download` to securely send the file.
        // This function sets appropriate headers (`Content-Disposition`) to prompt a download
        // and handles streaming the file, which is memory-efficient. It also protects
        // against exposing the file system structure by using the originalname for the client.
        const filePath = path.resolve(resource.path);
        res.download(filePath, resource.originalname);

    } catch (error) {
        next(error);
    }
};
