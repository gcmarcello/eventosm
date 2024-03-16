import { BarcodeDetector } from "barcode-detector/pure";

const decoder = async (imageData: ImageBitmapSourceWebCodecs) => {
  const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code"],
  })
  const decoded = await barcodeDetector.detect(imageData);
  if (decoded.length) return decoded.at(0)?.rawValue
}

export default decoder