// components/PdfPreview.tsx
"use client";
import { Document, Page } from "react-pdf";
import { CircleX } from "lucide-react";
import { pdfjs } from "react-pdf";
import useIsMobile from "../../../../hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  return (
    <div className="relative w-16 overflow-hidden rounded-lg bg-white md:w-20 group">
      <Document file={documentUrl} loading={<></>} noData={<></>}>
        <Page
          pageNumber={1}
          loading={<></>}
          width={isMobile ? 64 : 80}
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
