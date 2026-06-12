import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Request } from '../types/request';

export const exportRequestsToPDF = (requests: Request[], title: string) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 30);

  const tableColumn = ["ID", "Título", "Solicitante", "Categoria", "Prioridade", "Status", "Data"];
  const tableRows: any[] = [];

  requests.forEach(req => {
    const requestData = [
      `#${req.id}`,
      req.title,
      req.requester_name || "N/A",
      req.category_name,
      req.priority,
      req.status,
      new Date(req.created_at).toLocaleDateString()
    ];
    tableRows.push(requestData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Cor --primary
    styles: { fontSize: 9 }
  });

  doc.save(`requests_${new Date().getTime()}.pdf`);
};
