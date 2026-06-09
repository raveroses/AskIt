// components/PdfPreview.tsx
"use client";
import { Document, Page } from "react-pdf";
import { CircleX } from "lucide-react";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
export default function PdfPreview({
  documentUrl,
  onRemove,
}: {
  documentUrl: string;
  onRemove: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white w-20  relative group">
      <Document file={documentUrl} loading={<></>} noData={<></>}>
        <Page
          pageNumber={1}
          loading={<></>}
          width={80}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      <button
        onClick={onRemove}
        className="cancelBtn absolute top-0 right-0 text-red-400 text-2xl 
                   hidden group-hover:block transition-all duration-200 cursor-pointer"
      >
        <CircleX />
      </button>
    </div>
  );
}
