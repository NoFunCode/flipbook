import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { PDFFlipbook } from "../src";

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>PDF Flipbook Demo</h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="pdf-input" style={{ marginRight: "10px" }}>
          Select a PDF file:
        </label>
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>

      {pdfFile ? (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "600px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <PDFFlipbook
            source={pdfFile}
            width="100%"
            height="100%"
            showControls={true}
            showPageNumber={true}
            workerSrc="/pdfjs-dist/build/pdf.worker.min.mjs"
            onPageChange={(page) => console.log("Page changed:", page)}
            onLoad={(numPages) =>
              console.log("PDF loaded with", numPages, "pages")
            }
            onError={(error) => console.error("Error loading PDF:", error)}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "600px",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          <p>Select a PDF file to preview the flipbook</p>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
