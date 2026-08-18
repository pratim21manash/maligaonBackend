// import Download from "../models/Download.js";
// import { deleteFile } from "../middleware/upload.js";

// export const createDownload = async (req, res) => {
//   try {
//     const { title, category, order } = req.body;
//     const file = req.file ? `/uploads/downloads/${req.file.filename}` : null;

//     if (!file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "File is required" });
//     }

//     const download = await Download.create({
//       title,
//       category,
//       file,
//       order: order || 0,
//     });

//     res.status(201).json({ success: true, data: download });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getDownloads = async (req, res) => {
//   try {
//     const downloads = await Download.find({ isActive: true }).sort({
//       order: 1,
//       createdAt: -1,
//     });
//     res.json({ success: true, data: downloads });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAllDownloads = async (req, res) => {
//   try {
//     const downloads = await Download.find().sort({ order: 1, createdAt: -1 });
//     res.json({ success: true, data: downloads });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getDownloadById = async (req, res) => {
//   try {
//     const download = await Download.findById(req.params.id);
//     if (!download) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Download not found" });
//     }
//     res.json({ success: true, data: download });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateDownload = async (req, res) => {
//   try {
//     const download = await Download.findById(req.params.id);
//     if (!download) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Download not found" });
//     }

//     const { title, category, order, isActive } = req.body;
//     let file = download.file;

//     if (req.file) {
//       if (download.file) {
//         const oldPath = `uploads/downloads/${download.file.split("/").pop()}`;
//         await deleteFile(oldPath);
//       }
//       file = `/uploads/downloads/${req.file.filename}`;
//     }

//     const updated = await Download.findByIdAndUpdate(
//       req.params.id,
//       { title, category, file, order, isActive },
//       { new: true },
//     );

//     res.json({ success: true, data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteDownload = async (req, res) => {
//   try {
//     const download = await Download.findById(req.params.id);
//     if (!download) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Download not found" });
//     }

//     if (download.file) {
//       const oldPath = `uploads/downloads/${download.file.split("/").pop()}`;
//       await deleteFile(oldPath);
//     }

//     await download.deleteOne();
//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const toggleDownloadStatus = async (req, res) => {
//   try {
//     const download = await Download.findById(req.params.id);
//     if (!download) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Download not found" });
//     }

//     download.isActive = !download.isActive;
//     await download.save();

//     res.json({
//       success: true,
//       message: `Download ${download.isActive ? "activated" : "deactivated"} successfully`,
//       data: download,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Download from "../models/Download.js";
import { deleteFile } from "../middleware/upload.js";
import path from "path";

export const createDownload = async (req, res) => {
  try {
    const { title, category, order } = req.body;
    const file = req.file ? `/uploads/downloads/${req.file.filename}` : null;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "File is required" });
    }

    const download = await Download.create({
      title,
      category,
      file,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: download });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDownloads = async (req, res) => {
  try {
    const downloads = await Download.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDownloadById = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) {
      return res
        .status(404)
        .json({ success: false, message: "Download not found" });
    }
    res.json({ success: true, data: download });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) {
      return res
        .status(404)
        .json({ success: false, message: "Download not found" });
    }

    const { title, category, order, isActive } = req.body;
    let file = download.file;

    if (req.file) {
      if (download.file) {
        const oldPath = `uploads/downloads/${download.file.split("/").pop()}`;
        await deleteFile(oldPath);
      }
      file = `/uploads/downloads/${req.file.filename}`;
    }

    const updated = await Download.findByIdAndUpdate(
      req.params.id,
      { title, category, file, order, isActive },
      { new: true },
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) {
      return res
        .status(404)
        .json({ success: false, message: "Download not found" });
    }

    if (download.file) {
      const oldPath = `uploads/downloads/${download.file.split("/").pop()}`;
      await deleteFile(oldPath);
    }

    await download.deleteOne();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleDownloadStatus = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) {
      return res
        .status(404)
        .json({ success: false, message: "Download not found" });
    }

    download.isActive = !download.isActive;
    await download.save();

    res.json({
      success: true,
      message: `Download ${download.isActive ? "activated" : "deactivated"} successfully`,
      data: download,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
