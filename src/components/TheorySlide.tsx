import ReactMarkdown from "react-markdown";
import theory from "../assets/theory.md?raw";

interface TheorySlideProps {
  onClose: () => void;
}

export default function TheorySlide({ onClose }: TheorySlideProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex"
      onClick={onClose}
    >
      <div
        className="ml-auto w-[30rem] max-w-full h-full bg-white p-4 overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mb-4 px-2 py-1 bg-gray-200 rounded text-sm"
          onClick={onClose}
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
