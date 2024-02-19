const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            console.log('Only JPG, PNG, PDF, DOC, and DOCX files are supported');
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    }
});

module.exports = upload;