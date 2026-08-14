import sharp from "sharp";
import fs from "fs-extra";
import path from "path";

export const compressImage = async (inputPath, outputPath, options = {}) => {
  try {
    const {
      width = 800,
      quality = 80,
      fit = "inside",
      withoutEnlargement = true,
    } = options;

    await fs.ensureDir(path.dirname(outputPath));

    const ext = path.extname(outputPath).toLowerCase();
    const format = ext === ".png" ? "png" : ext === ".webp" ? "webp" : "jpeg";

    const transformer = sharp(inputPath).resize(width, null, {
      fit,
      withoutEnlargement,
    });

    if (format === "png") {
      transformer.png({ quality });
    } else if (format === "webp") {
      transformer.webp({ quality });
    } else {
      transformer.jpeg({ quality, progressive: true });
    }

    await transformer.toFile(outputPath);

    if (fs.existsSync(inputPath)) {
      await fs.unlink(inputPath);
    }

    return outputPath;
  } catch (error) {
    console.error("Image compression error:", error);
    return inputPath;
  }
};

export const compressMultipleImages = async (
  files,
  uploadDir = "uploads/images",
  options = {},
) => {
  const compressedPaths = [];

  if (!files || files.length === 0) {
    return compressedPaths;
  }

  await fs.ensureDir(uploadDir);

  for (const file of files) {
    const ext = path.extname(file.filename);
    const baseName = path.basename(file.filename, ext);
    const compressedFilename = `compressed_${baseName}_${Date.now()}${ext}`;
    const compressedPath = path.join(uploadDir, compressedFilename);

    const result = await compressImage(file.path, compressedPath, options);
    compressedPaths.push(result);
  }

  return compressedPaths;
};

export default {
  compressImage,
  compressMultipleImages,
};
