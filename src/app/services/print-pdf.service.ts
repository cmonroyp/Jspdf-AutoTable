import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Logo from '../core/logo.json';
import { InformationExport } from '../core/model/Information';

@Injectable({
  providedIn: 'root',
})
export class PrintPdfService {
  constructor() {}

  exportPDF(data: InformationExport) {
    switch (data.type) {
      case 'array':
        this.getDataArrayPDF(data);
        break;

      case 'html':
        this.getDataHtmlPDF(data);
        break;
      default:
        break;
    }
  }
  private getDataArrayPDF(info: InformationExport) {
    var pdf: any = new jsPDF();
    var logo = Logo.Img;

    //Fecha
    var now = new Date();
    var jsDate =
      now.getMonth() + 1 + '-' + now.getDate() + '-' + now.getFullYear();

    var dataExp = pdf.autoTableHtmlToJson(info.dataExport);

    //convertimos a array
    var result: any = [];
    info.dataBody?.forEach((ele: InformationExport) => {
      result.push(Object.values(ele));
    });

    (pdf as any).autoTable({
      head: [dataExp.columns],
      body: result,
      foot: info.footer,
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.2,
      // showHead: 'firstPage',
      styles: {
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
      },
      showFoot: info.showFoot, //'everyPage'|'lastPage'|'never' //muestra Footer en la ultima pagina
      headStyles: {
        valign: 'middle',
        halign: 'center',
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'center',
      },
      footStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: ['#e9e9e8'],
        textColor: ['#353230'],
        lineWidth: 0,
        cellPadding: 8,
      },
      didDrawPage: function (data: any) {
        // Header
        pdf.setFontSize(18);
        pdf.setTextColor('#6c757d');

        const titulo: string = info.title;
        pdf.text(titulo, data.settings.margin.left + 68, 12);

        pdf.addImage(logo, 'JPEG', 14, 0, 12, 0);
        pdf.setFontSize(7);
        pdf.setTextColor(0);
        pdf.setTextColor('#6c757d');
        pdf.text('NIT: 830070999-3', 15, 15);

        // Footer
        const pageCount = pdf.internal.getNumberOfPages();
        for (let j = 1; j < pageCount + 1; j++) {
          pdf.setFontSize(10);
          var pageSize = pdf.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          pdf.setFontSize(7);
          pdf.setTextColor(0);
          pdf.setTextColor('#6c757d');

          pdf.setPage(j);
          pdf.text(
            'Pagina ' + `${j} of ${pageCount}`,
            data.settings.margin.left,
            pageHeight - 5
          );

          pdf.text('Create on: ' + jsDate.toString(), 174, pageHeight - 5);
        }
      },
      margin: { top: 20 },
      theme: 'striped',
      didDrawCell: function (row: any, data: any) {},
    });

    pdf.save(info.nameFile);
  }

  private getDataHtmlPDF(info: InformationExport) {
    var pdf: any = new jsPDF();
    var logo = Logo.Img;

    //Fecha
    var now = new Date();
    var jsDate =
      now.getMonth() + 1 + '-' + now.getDate() + '-' + now.getFullYear();

    var dataExp = pdf.autoTableHtmlToJson(info.data);
    console.log(info);

    (pdf as any).autoTable({
      head: [dataExp.columns],
      body: dataExp.rows,
      foot: info.footer,
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.2,
      // showHead: 'firstPage',
      styles: {
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
      },
      showFoot: info.showFoot, //'everyPage'|'lastPage'|'never' //muestra Footer en la ultima pagina
      headStyles: {
        valign: 'middle',
        halign: 'center',
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'center',
      },
      footStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [189, 195, 199],
        textColor: ['#246a6a'],
      },
      didDrawPage: function (data: any) {
        // Header
        pdf.setFontSize(18);
        pdf.setTextColor('#5F0F40');

        const titulo: string = info.title;
        pdf.text(titulo, data.settings.margin.left + 68, 12);

        pdf.addImage(logo, 'JPEG', 12, 2, 30, 0);
        pdf.setFontSize(7);
        pdf.setTextColor(0);
        pdf.setTextColor('#6c757d');
        pdf.text('NIT: 830039329-8', 15, 15);

        // Footer
        const pageCount = pdf.internal.getNumberOfPages();
        for (let j = 1; j < pageCount + 1; j++) {
          pdf.setFontSize(10);
          var pageSize = pdf.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          pdf.setFontSize(7);
          pdf.setTextColor(0);
          pdf.setTextColor('#6c757d');

          pdf.setPage(j);
          pdf.text(
            'Pagina ' + `${j} of ${pageCount}`,
            data.settings.margin.left,
            pageHeight - 5
          );

          pdf.text('Create on: ' + jsDate.toString(), 174, pageHeight - 5);
        }
      },
      margin: { top: 20 },
      theme: 'striped',
      didDrawCell: function (row: any, data: any) {},
    });

    pdf.save(info.nameFile);
  }
}
