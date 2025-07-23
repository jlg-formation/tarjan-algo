import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import theory from "../assets/theory.md?raw";

interface TheorySlideProps {
  onClose: () => void;
}

export default function TheorySlide({ onClose }: TheorySlideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`bg-opacity-40 fixed inset-0 flex bg-black transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`h-full w-[30rem] max-w-full overflow-y-auto bg-white p-4 shadow-lg transition-transform duration-300 ${visible ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mb-4 rounded bg-gray-200 px-2 py-1 text-sm"
          onClick={handleClose}
        >
          Fermer
        </button>
        <div className="prose">
          <ReactMarkdown>{theory}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
