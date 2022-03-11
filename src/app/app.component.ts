import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';

import dataVideo from './videos.data.json';

import { PrintPdfService } from './services/print-pdf.service';
import { InformationExport } from './core/model/Information';
import { ExcelService } from './services/excel-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('content', { static: false }) el!: ElementRef;
  fakeData = dataVideo;
  p: number = 1;
  totalPaginado: number = 10;

  //Datos Excel
  data: any[] = [];
  columns!: any[];
  dataHead!: any;
  footerData: any[][] = [];
  array: any[] = [];
  totalSalesAmount: number = 0;

  //header = [['ID', 'Name', 'Email', 'Profile']];
  // tableData = [
  //   [1, 'John', 'john@yahoo.com', 'HR'],
  //   [2, 'Angel', 'angel@yahoo.com', 'Marketing'],
  //   [3, 'Harry', 'harry@yahoo.com', 'Finance'],
  //   [4, 'Anne', 'anne@yahoo.com', 'Sales'],
  //   [5, 'Hardy', 'hardy@yahoo.com', 'IT'],
  //   [6, 'Nikole', 'nikole@yahoo.com', 'Admin'],
  //   [7, 'Sandra', 'Sandra@yahoo.com', 'Sales'],
  //   [8, 'Lil', 'lil@yahoo.com', 'Sales'],
  // ];

  valor2: string = '$13,251.00';

  // foot = [
  //   [
  //     'Valor: ' + '$34,500.00' + '\n\n' + 'Valor2: ' + `${this.valor2}`,
  //     'Valor3: ' + '$12,500.00' + '       ' + 'Valor4: ' + '$3,500.00',
  //   ],
  // ];

  // foot = [['Valor: ' + '$34,500.00' + '\n\n' + 'Valor3: ' + '$12,500.00']];
  foot = [['Valor: ' + '$34,500.00']];

  dataExcel() {
    // this.columns = ['Id', 'Name', 'Platform', 'Reference'];
    // this.data = [
    //   {
    //     InvoiceID: 'INV0001',
    //     DeviceName: 'Redmi Note 6 Pro',
    //     Date: '25-06-2020',
    //     Amount: 16000,
    //   },
    //   {
    //     InvoiceID: 'INV0002',
    //     DeviceName: 'iPhone XR',
    //     Date: '25-06-2020',
    //     Amount: 19000,
    //   },
    //   {
    //     InvoiceID: 'INV0003',
    //     DeviceName: 'iPaid Mini 5',
    //     Date: '26-06-2020',
    //     Amount: 35000,
    //   },
    //   {
    //     InvoiceID: 'INV0004',
    //     DeviceName: 'Samsung S10',
    //     Date: '26-06-2020',
    //     Amount: 35000,
    //   },
    // ];
    // this.totalSalesAmount = this.data.reduce(
    //   (sum, item) => sum + item.Amount,
    //   0
    // );
    // this.footerData.push(['Total', '', '', this.totalSalesAmount]);
    // console.log(this.totalSalesAmount);
  }
  constructor(
    private servicePDF: PrintPdfService,
    private excelService: ExcelService
  ) {
    //Formato Array Monto
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    for (const key in this.fakeData) {
      this.totalSalesAmount += Number(this.fakeData[key]['monto']);

      if (this.fakeData[key]['monto']) {
        this.fakeData[key]['monto'] = formatter.format(
          Number(this.fakeData[key]['monto'])
        );
      }
      this.array = [...this.fakeData];
    }

    /**FOOTER EXCEL */
    this.footerData.push([
      'Valor',
      '',
      '',
      formatter.format(this.totalSalesAmount),
    ]);

    this.footerData.push(['Total', '', '', this.fakeData.length]);
    /**FIN FOOTER EXCEL */

    /**FOOTER PDF */
    this.foot = [
      ['Valor: ', '', '', '' + `${formatter.format(this.totalSalesAmount)}`],
    ];
    /**FIN FOOTER PDF */
  }

  exportExcel() {
    var pdf: any = new jsPDF();
    var elem = this.el.nativeElement;
    this.dataHead = pdf.autoTableHtmlToJson(elem);

    this.excelService.exportAsExcelFile(
      'Lista Video Juegos',
      '',
      this.dataHead.columns, //this.columns,
      this.fakeData, //this.data
      this.footerData,
      'videos_report',
      'Resultado'
    );
  }
  exportPDF() {
    var elem = this.el.nativeElement;

    //Para Reportes con Paginado
    var dataArray: InformationExport = {
      title: 'Listado de Juegos',
      nameFile: 'Report_Prueba',
      type: 'array',
      dataExport: elem,
      dataBody: this.array,
      footer: this.foot,
      showFoot: 'lastPage', //'everyPage'|'lastPage'|'never
    };

    //Reportes sin Paginado
    var dataHtml: InformationExport = {
      title: 'Listado de Juegos',
      nameFile: 'Report_Prueba',
      type: 'html',
      data: elem,
      footer: this.foot,
      showFoot: 'lastPage', //'everyPage'|'lastPage'|'never
    };
    this.servicePDF.exportPDF(dataArray);
  }
}
