import fs from "fs";
import path from "path";

const STORAGE_DIR = path.join(__dirname, "../../storage");

function getFilePath(fileName: string): string {
  if (!fileName.endsWith(".json")) {
    fileName += ".json";
  }
  return path.join(STORAGE_DIR, fileName);
}

function initializeFile(filePath: string) {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

export function readData(fileName: string): any[] {
  const filePath = getFilePath(fileName);
  initializeFile(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function writeData(fileName: string, data: any[]) {
  const filePath = getFilePath(fileName);
  initializeFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function addData(fileName: string, entry: Record<string, any>) {
  const data = readData(fileName);
  data.push(entry);
  writeData(fileName, data);
}
