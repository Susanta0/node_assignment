const express = require("express");
const multer = require("multer");
const app = express();

app.use(express.json());

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

app.post("/upload", upload.single("file"), (req, res) => {
  return res
    .status(200)
    .json({ message: "File uploaded successfully", file: req.file });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
