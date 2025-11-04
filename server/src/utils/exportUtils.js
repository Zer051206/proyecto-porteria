/**
 * @file exportUtils.js
 * @module Utils
 * @description Utilidades para generar archivos de exportación (Excel y PDF).
 * @requires exceljs
 * @requires pdfmake
 */
import ExcelJS from "exceljs";
import PdfPrinter from "pdfmake";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __filename y __dirname para trabajar con rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "fonts", "Roboto-Regular.ttf"),
    bold: path.join(__dirname, "fonts", "Roboto-Bold.ttf"),
    italics: path.join(__dirname, "fonts", "Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "fonts", "Roboto-BoldItalic.ttf"),
  },
};
// -----------------------------------------------------------------

/**
 * @async
 * @function exportRadicadosToExcel
 * @description Crea un buffer de archivo Excel (.xlsx) a partir de una lista de radicados.
 * @param {Array<object>} radicados - La lista de objetos de radicados (de la consulta del repositorio).
 * @returns {Promise<Buffer>} El buffer del archivo .xlsx.
 */
export const exportRadicadosToExcel = async (radicados) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Portería";
  workbook.lastModifiedBy = "Sistema de Portería";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Historial de Radicados");

  // --- Definir Columnas (10 columnas para Excel) ---
  worksheet.columns = [
    { header: "N° Radicado", key: "referencia_radicado", width: 20 },
    {
      header: "Fecha Recibido",
      key: "fecha_recibido",
      width: 25,
      style: { numFmt: "dd/mm/yyyy hh:mm AM/PM" },
    },
    { header: "Tipo Paquete", key: "tipo_descripcion", width: 20 },
    { header: "Destinatario (Interno)", key: "nombre_destinatario", width: 30 },
    { header: "Área (Contabilidad)", key: "area_nombre", width: 20 },
    {
      header: "Recibido Por (Empleado)",
      key: "nombre_recibe_documento",
      width: 30,
    },
    { header: "Mensajero (Entregador)", key: "mensajero_nombre", width: 30 },
    { header: "Empresa Transporte", key: "empresa_transporte", width: 25 },
    { header: "Portero (Validador)", key: "portero_recibe_nombre", width: 30 },
    { header: "Observaciones", key: "observaciones", width: 40 },
  ];

  // --- Añadir Filas ---
  const rows = radicados.map((radicado) => ({
    referencia_radicado: radicado.referencia_radicado,
    fecha_recibido: radicado.fecha_recibido
      ? new Date(radicado.fecha_recibido)
      : null,
    tipo_descripcion: radicado.PackageType?.descripcion || "Documento",
    nombre_destinatario: radicado.nombre_destinatario,
    area_nombre: radicado.Area?.nombre_area || "Contabilidad",
    nombre_recibe_documento: radicado.nombre_recibe_documento,
    mensajero_nombre: radicado.mensajero_nombre || "N/A",
    empresa_transporte: radicado.empresa_transporte || "N/A",
    // Asume que el alias del usuario que recibe es 'PackageReceived'
    portero_recibe_nombre: radicado.PackagesReceived?.nombre
      ? `${radicado.PackagesReceived.nombre} ${
          radicado.PackagesReceived.apellido || ""
        }`
      : "N/A",
    observaciones: radicado.observaciones || "",
  }));

  worksheet.addRows(rows);

  // --- Estilo al Encabezado ---
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF007BFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
    };
  });

  // --- Escribir el buffer ---
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * @async
 * @function exportRadicadosToPDF
 * @description Crea un buffer de archivo PDF a partir de una lista de radicados.
 * @param {Array<object>} radicados - La lista de objetos de radicados (de la consulta del repositorio).
 * @returns {Promise<Buffer>} El buffer del archivo .pdf.
 */
export const exportRadicadosToPDF = async (radicados) => {
  // Ahora PdfPrinter usará las rutas de archivos de fuentes correctas
  const printer = new PdfPrinter(fonts);

  // Helper para formatear fecha (pdfmake no usa el style de Excel)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  // --- Definir Columnas y Filas para PDF ---
  const tableHeader = [
    { text: "N° Radicado", style: "tableHeader" },
    { text: "Fecha Recibido", style: "tableHeader" },
    { text: "Recibió (Empleado)", style: "tableHeader" },
    { text: "Mensajero", style: "tableHeader" },
    { text: "Portero (Validador)", style: "tableHeader" },
  ];

  const tableBody = radicados.map((rad) => {
    return [
      { text: rad.referencia_radicado || "N/A", style: "tableRow" },
      { text: formatDate(rad.fecha_recibido), style: "tableRowSmall" },
      { text: rad.nombre_recibe_documento || "N/A", style: "tableRow" },
      { text: rad.mensajero_nombre || "N/A", style: "tableRow" },
      {
        text: rad.PackagesReceived?.nombre
          ? `${rad.PackagesReceived.nombre} ${
              rad.PackagesReceived.apellido || ""
            }`
          : "N/A",
        style: "tableRow",
      },
    ];
  });

  // --- Definición del Documento PDF ---
  const docDefinition = {
    header: {
      text: "Reporte Generado por Sistema de Portería",
      style: "reportHeader",
      alignment: "right",
      margin: [0, 10, 20, 0],
    },
    footer: function (currentPage, pageCount) {
      return {
        text: `Página ${currentPage.toString()} de ${pageCount}`,
        alignment: "center",
        style: "reportFooter",
        margin: [0, 10, 0, 10],
      };
    },
    content: [
      { text: "Historial de Radicados", style: "header" },
      {
        text: `Reporte generado el: ${new Date().toLocaleString("es-CO")}`,
        style: "subheader",
      },
      {
        style: "tableMain",
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "*", "*"],
          body: [tableHeader, ...tableBody],
        },
        layout: "lightHorizontalLines",
      },
    ],
    // --- Estilos del Documento ---
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 10,
        italic: true,
        alignment: "center",
        margin: [0, 0, 0, 15],
      },
      tableMain: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        fillColor: "#E0E0E0",
        alignment: "left",
        margin: [5, 5, 5, 5],
      },
      tableRow: {
        fontSize: 9,
        margin: [5, 3, 5, 3],
      },
      tableRowSmall: {
        fontSize: 8,
        margin: [5, 3, 5, 3],
      },
      reportHeader: {
        fontSize: 8,
        color: "grey",
      },
      reportFooter: {
        fontSize: 8,
        color: "grey",
      },
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  // --- Generar el Buffer del PDF ---
  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks = [];

      pdfDoc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      pdfDoc.on("error", (err) => {
        reject(err);
      });

      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
};
