// import Gallery from "../models/Gallery.js";
// import { deleteFile } from "../middleware/upload.js";
// import { compressMultipleImages } from "../middleware/imageCompression.js";
// import fs from "fs-extra";

// // Set image width: 360 for thumbnails, 800 for good quality, 1000 for high quality
// const IMAGE_WIDTH = 800;

// export const createGallery = async (req, res) => {
//   try {
//     const { eventName, description, date } = req.body;

//     let images = [];

//     if (req.files && req.files.length > 0) {
//       const uploadDir = "uploads/images";
//       await fs.ensureDir(uploadDir);

//       const compressedPaths = await compressMultipleImages(
//         req.files,
//         uploadDir,
//         {
//           width: IMAGE_WIDTH,
//           quality: 80,
//         },
//       );

//       images = compressedPaths.map((compressedPath) => ({
//         url: `/${compressedPath.replace(/\\/g, "/")}`,
//         caption: "",
//       }));
//     }

//     const gallery = await Gallery.create({
//       eventName,
//       description,
//       images,
//       date: date || new Date(),
//     });

//     res.status(201).json({ success: true, data: gallery });
//   } catch (error) {
//     console.error("Create gallery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getGalleries = async (req, res) => {
//   try {
//     const galleries = await Gallery.find({ isActive: true }).sort({
//       date: -1,
//       createdAt: -1,
//     });
//     res.json({ success: true, data: galleries });
//   } catch (error) {
//     console.error("Get galleries error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAllGalleries = async (req, res) => {
//   try {
//     const galleries = await Gallery.find().sort({ date: -1, createdAt: -1 });
//     res.json({ success: true, data: galleries });
//   } catch (error) {
//     console.error("Get all galleries error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getGalleryById = async (req, res) => {
//   try {
//     const gallery = await Gallery.findById(req.params.id);
//     if (!gallery) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Gallery not found" });
//     }
//     res.json({ success: true, data: gallery });
//   } catch (error) {
//     console.error("Get gallery by id error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateGallery = async (req, res) => {
//   try {
//     const gallery = await Gallery.findById(req.params.id);
//     if (!gallery) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Gallery not found" });
//     }

//     const { eventName, description, date, isActive } = req.body;
//     let images = gallery.images;

//     if (req.files && req.files.length > 0) {
//       for (const img of gallery.images) {
//         const oldPath = `uploads/images/${img.url.split("/").pop()}`;
//         await deleteFile(oldPath);
//       }

//       const uploadDir = "uploads/images";
//       await fs.ensureDir(uploadDir);

//       const compressedPaths = await compressMultipleImages(
//         req.files,
//         uploadDir,
//         {
//           width: IMAGE_WIDTH,
//           quality: 80,
//         },
//       );

//       images = compressedPaths.map((compressedPath) => ({
//         url: `/${compressedPath.replace(/\\/g, "/")}`,
//         caption: "",
//       }));
//     }

//     const updated = await Gallery.findByIdAndUpdate(
//       req.params.id,
//       {
//         eventName,
//         description,
//         images,
//         date,
//         isActive: isActive !== undefined ? isActive : gallery.isActive,
//       },
//       { new: true },
//     );

//     res.json({ success: true, data: updated });
//   } catch (error) {
//     console.error("Update gallery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteGallery = async (req, res) => {
//   try {
//     const gallery = await Gallery.findById(req.params.id);
//     if (!gallery) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Gallery not found" });
//     }

//     for (const img of gallery.images) {
//       const oldPath = `uploads/images/${img.url.split("/").pop()}`;
//       await deleteFile(oldPath);
//     }

//     await gallery.deleteOne();
//     res.json({ success: true, message: "Gallery deleted successfully" });
//   } catch (error) {
//     console.error("Delete gallery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const toggleGalleryStatus = async (req, res) => {
//   try {
//     const gallery = await Gallery.findById(req.params.id);
//     if (!gallery) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Gallery not found" });
//     }

//     gallery.isActive = !gallery.isActive;
//     await gallery.save();

//     res.json({
//       success: true,
//       message: `Gallery ${gallery.isActive ? "activated" : "deactivated"} successfully`,
//       data: gallery,
//     });
//   } catch (error) {
//     console.error("Toggle gallery status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Gallery from "../models/Gallery.js";
import { deleteFile } from "../middleware/upload.js";
import { compressMultipleImages } from "../middleware/imageCompression.js";
import fs from "fs-extra";
import path from "path";

// Set image width: 800 for good quality
const IMAGE_WIDTH = 800;

export const createGallery = async (req, res) => {
  try {
    const { eventName, description, date } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploadDir = "uploads/images";
      await fs.ensureDir(uploadDir);

      const compressedPaths = await compressMultipleImages(
        req.files,
        uploadDir,
        {
          width: IMAGE_WIDTH,
          quality: 80,
        },
      );

      // Store paths with /uploads/images/ format
      images = compressedPaths.map((compressedPath) => {
        const filename = path.basename(compressedPath);
        return {
          url: `/uploads/images/${filename}`,
          caption: "",
        };
      });
    }

    const gallery = await Gallery.create({
      eventName,
      description,
      images,
      date: date || new Date(),
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    console.error("Create gallery error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ isActive: true }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error("Get galleries error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error("Get all galleries error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }
    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Get gallery by id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    const { eventName, description, date, isActive } = req.body;
    let images = gallery.images;

    if (req.files && req.files.length > 0) {
      for (const img of gallery.images) {
        const oldPath = `uploads/images/${img.url.split("/").pop()}`;
        await deleteFile(oldPath);
      }

      const uploadDir = "uploads/images";
      await fs.ensureDir(uploadDir);

      const compressedPaths = await compressMultipleImages(
        req.files,
        uploadDir,
        {
          width: IMAGE_WIDTH,
          quality: 80,
        },
      );

      images = compressedPaths.map((compressedPath) => {
        const filename = path.basename(compressedPath);
        return {
          url: `/uploads/images/${filename}`,
          caption: "",
        };
      });
    }

    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        eventName,
        description,
        images,
        date,
        isActive: isActive !== undefined ? isActive : gallery.isActive,
      },
      { new: true },
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update gallery error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    for (const img of gallery.images) {
      const oldPath = `uploads/images/${img.url.split("/").pop()}`;
      await deleteFile(oldPath);
    }

    await gallery.deleteOne();
    res.json({ success: true, message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Delete gallery error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleGalleryStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    gallery.isActive = !gallery.isActive;
    await gallery.save();

    res.json({
      success: true,
      message: `Gallery ${gallery.isActive ? "activated" : "deactivated"} successfully`,
      data: gallery,
    });
  } catch (error) {
    console.error("Toggle gallery status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
