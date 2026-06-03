export function exportToWord(elementId: string, filename: string) {
  const content = document.getElementById(elementId);
  if (!content) {
    alert("Tidak ada konten yang dapat diekspor.");
    return;
  }

  // Clone the element to safely modify and clean it up before exporting
  const clonedContent = content.cloneNode(true) as HTMLElement;

  // Remove any elements marked with 'no-print' or action buttons to keep the document tidy
  const elementsToRemove = clonedContent.querySelectorAll(".no-print");
  elementsToRemove.forEach((el) => el.remove());

  // Wrap the HTML content inside the simple Microsoft Word XML schema structure
  const preHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <style>
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.3;
          color: #2b2b2b;
        }
        h1, h2, h3, h4 {
          font-family: 'Arial', sans-serif;
          color: #1e1b4b;
          margin-top: 18pt;
          margin-bottom: 6pt;
          page-break-after: avoid;
        }
        h1 { font-size: 18pt; border-bottom: 2px solid #4338ca; padding-bottom: 4px; }
        h2 { font-size: 14pt; }
        h3 { font-size: 12pt; border-left: 3px solid #db2777; padding-left: 8px; }
        table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 12pt 0; 
          font-size: 9.5pt;
        }
        th, td { 
          border: 1px solid #94a3b8; 
          padding: 8px; 
          vertical-align: top;
        }
        th { 
          background-color: #1e1b4b; 
          color: #ffffff; 
          font-weight: bold; 
          text-align: left;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .bg-pink-50 { background-color: #fdf2f8 !important; color: #be185d !important; }
        .bg-indigo-50 { background-color: #e0e7ff !important; color: #4338ca !important; }
        .bg-slate-50 { background-color: #f8fafc !important; }
        .border-t-20 { border-top: 10px solid #db2777; }
        section { margin-bottom: 24pt; page-break-inside: avoid; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
  `;
  
  const postHtml = "</body></html>";
  const finalHtml = preHtml + clonedContent.innerHTML + postHtml;

  const blob = new Blob(["\ufeff", finalHtml], {
    type: "application/msword;charset=utf-8",
  });

  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = `${filename}.doc`;
  downloadLink.click();

  // Cleanup
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
