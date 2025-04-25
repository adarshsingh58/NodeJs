const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    const filePath = path.join(__dirname, '..', 'resources', 'audio.mp3');

    // Get audio file size
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Get range from request headers
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;
        console.log(`Sending chunk: ${start}-${end} (${chunkSize} bytes)`);

        const file = fs.createReadStream(filePath, {start, end});
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        });
        file.pipe(res);
    } else {
        // If no range is requested (browser fallback)
        console.log(`Sending full file (${fileSize} bytes)`);
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        });
        fs.createReadStream(filePath).pipe(res);
    }
});

module.exports = router;
