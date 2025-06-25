const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static("."));

// Serve images
app.use("/images", express.static("images"));

// Main route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);
});
