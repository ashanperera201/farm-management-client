import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  exportAsExcelFile(json: any, excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, `${fileName}${EXCEL_EXTENSION}`);
  }

  exportToPDF(title: string, headers: any[], data: any, fileName: string) {
    const header = this.createHeaders(headers);
    let doc = new jsPDF();
    doc.text(title, 9, 10);
    doc.setFontSize(7);
    doc.table(6, 25, data, header, { autoSize: true, fontSize: 8, printHeaders: true });
    doc.save(fileName);
  }

  private createHeaders(keys: any) {
    return keys.map((key: any) => ({
      'name': key,
      'prompt': key,
      'width': 35,
      'align': 'center',
      'padding': 0
    }));
  }
}
