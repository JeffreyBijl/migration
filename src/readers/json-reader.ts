import { FileReader } from "./file-reader.ts";

export class JsonReader extends FileReader {
  read<T>(): T {
    const buffer = this.readFile();
    let content = buffer.toString("utf-8");

    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    return JSON.parse(content) as T;
  }
}
