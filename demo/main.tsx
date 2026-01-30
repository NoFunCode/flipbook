import { PDFFlipbook } from "../src";
import { createRoot } from "react-dom/client";

function App() {
  return <PDFFlipbook source="133.pdf" />;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
