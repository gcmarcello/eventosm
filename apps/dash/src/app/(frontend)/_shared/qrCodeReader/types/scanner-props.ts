export default interface ScannerProps {
  onError?: (error: Error) => void;
  onScan: (value: string) => void;
  facingMode?: string;
  flipHorizontally?: boolean;
  delay?: number;
  aspectRatio?: string;
}