import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MODEL_OPTIONS } from "../../constants/models.jsx";

export default function ModelSelector({
  selectedModel,
  onSelect
}) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={containerRef}
    >

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
      >
        {selectedModel || "Select Model"}

        <ChevronDown size={15} />
      </button>

      {open && (
        <div className="absolute bottom-11 left-0 z-50 w-40 rounded-xl border border-neutral-700 bg-neutral-900 p-1 shadow-xl">

          {MODEL_OPTIONS.map((model) => (

            <button
              key={model}
              type="button"
              onClick={() => {
                onSelect(model);
                setOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800"
            >
              {model}
            </button>

          ))}

        </div>
      )}

    </div>
  );
}