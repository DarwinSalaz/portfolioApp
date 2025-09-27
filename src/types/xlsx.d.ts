declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [key: string]: WorkSheet };
  }

  export interface WorkSheet {
    [key: string]: any;
  }

  export interface CellObject {
    v?: any;
    t?: string;
    s?: any;
  }

  export const utils: {
    book_new(): WorkBook;
    json_to_sheet(data: any[]): WorkSheet;
    aoa_to_sheet(data: any[][]): WorkSheet;
    sheet_to_json(worksheet: WorkSheet, opts?: any): any[];
    book_append_sheet(wb: WorkBook, ws: WorkSheet, name?: string): void;
    decode_range(ref: string): { s: { c: number; r: number }; e: { c: number; r: number } };
    encode_cell(cell: { c: number; r: number }): string;
  };

  export function read(data: any, opts?: any): WorkBook;
  export function write(wb: WorkBook, opts?: any): any;
} 