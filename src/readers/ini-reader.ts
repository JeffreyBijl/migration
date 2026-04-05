import { parse } from "ini";
import { FileReader } from "./file-reader.ts";

export class IniReader extends FileReader {
  read<T>(): T {
    const buffer = this.readFile();
    const encoding = this.detectEncoding(buffer);
    const content = this.stripBom(buffer.toString(encoding));
    return parse(content) as T;
  }

  private detectEncoding(buffer: Buffer): BufferEncoding {
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return "utf16le";
    }
    return "utf8";
  }

  private stripBom(text: string): string {
    return text.replace(/^\uFEFF/, "");
  }
}
