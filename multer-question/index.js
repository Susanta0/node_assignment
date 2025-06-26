const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/csvfiles", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err);
  }
}

connectDB();

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});


const File = mongoose.model("File", fileSchema);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === ".csv") {
      return cb(null, true);
    }
    cb(new Error("Error: Only CSV files are allowed!"));
  },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const newFile = new File({
    filename: req.file.originalname,
    path: req.file.path,
  });

  try {
    await newFile.save();
    return res.status(200).json({ message: "File uploaded successfully", file: req.file });
  } catch (err) {
    return res.status(500).json({ message: "Error saving file to database", error: err });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
