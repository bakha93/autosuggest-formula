import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Parser, SUPPORTED_FORMULAS } from "hot-formula-parser";
import { highlightColors } from "@/constants";
import { useAutocompleteData } from "@/components/AutoCompleteFormula/store.ts";
import { getReplacedString } from "@/components/AutoCompleteFormula/utils";

export const AutoCompleteInput = memo(() => {
  const autocompleteItems = useAutocompleteData(
    (state) => state.autocompleteItems,
  );

  const parser = useRef(new Parser());

  const [value, setValue] = useState("");
  const [invalidFormula, setInvalidFormula] = useState("");
  const [formulaResult, setFormulaResult] = useState<
    string | number | boolean | null
  >("");
  const [autocompleteOpen, setAutocompleteOpen] = useState(true);
  const [valueToAutocomplete, setValueToAutocomplete] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAutocompleteItems = useMemo(() => {
    if (valueToAutocomplete.length >= 2) {
      return [
        ...autocompleteItems.map((el) => el.name),
        ...SUPPORTED_FORMULAS,
      ].reduce(
        (acc, el) => {
          if (el.toLowerCase().includes(valueToAutocomplete.toLowerCase())) {
            return [
              ...acc,
              {
                type: SUPPORTED_FORMULAS.includes(el) ? "function" : "value",
                name: el,
              },
            ];
          } else {
            return acc;
          }
        },
        [] as { type: string; name: string }[],
      );
    } else {
      return [];
    }
  }, [value]);

  const highlightWords = (
    wordsToHighlight: string[][],
    highlightColors: string[],
  ) => {
    let plainText = value;
    wordsToHighlight.forEach((words, index) => {
      const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");
      plainText = plainText.replace(
        regex,
        `<span class='${highlightColors[index]}'>$&</span>`,
      );
    });

    return { __html: plainText };
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Regular expressions to split input value by symbols and parentheses
    const symbols = /[.,;{}=+/*-]/; // Adjust as needed for math signs
    const parentheses = /[()]/;

    // Split input value into words, symbols, and parentheses
    const parts = inputValue.split(/\s+/).reduce((acc, part) => {
      if (symbols.test(part)) {
        // Split part by symbols
        acc.push(...part.split(symbols).filter(Boolean));
      } else {
        // Split part by parentheses
        acc.push(...part.split(parentheses).filter(Boolean));
      }
      return acc;
    }, [] as string[]);

    // Get the last part and trim any whitespace
    const currentPart = parts.pop()?.trim();

    setValueToAutocomplete(currentPart ?? "");
    setAutocompleteOpen(true);

    if (!inputValue) {
      setInvalidFormula("");
      setFormulaResult("");
    }
  };

  const updateHeight = (el?: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
      setTimeout(() => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }, 0);
    }
  };

  const onEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = e.currentTarget.value;

      const stringToValidate = getReplacedString(autocompleteItems, inputValue);
      const result = parser.current.parse(`${stringToValidate}`);

      if (result.error) {
        setInvalidFormula("Invalid formula");
        setFormulaResult("");
      } else {
        setInvalidFormula("");
        setFormulaResult(result.result);
      }
    }
  };

  const onAutocompleteItemClick = (name: string) => {
    // Split input value into words and symbols
    const parts = value.split(/([\s.,;()]+)/);

    // Find the last word or symbol before the cursor position
    let lastPartIndex = parts.length - 1;
    while (lastPartIndex >= 0 && !parts[lastPartIndex].trim()) {
      lastPartIndex--;
    }

    // Replace the current unfinished word or symbol with the autocomplete item
    const newValueParts = parts.map((part, index) =>
      index === lastPartIndex ? name : part,
    );

    // Reconstruct the entire string with the autocompleted word
    const newValue = newValueParts.join("");

    // Update the textarea value
    setValue(newValue);
    setAutocompleteOpen(false); // Close autocomplete
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setAutocompleteOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    updateHeight(textareaRef.current);
  }, [value]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateHeight(textareaRef.current);
    });
    if (textareaRef.current) {
      resizeObserver.observe(textareaRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [textareaRef]);

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {invalidFormula && (
          <span className="absolute top-[-35px] text-red-500 block mt-1 h-[18px]">
            {invalidFormula}
          </span>
        )}
        {formulaResult && (
          <span className="absolute top-[-35px] block mt-1 h-[18px]">
            Result: {formulaResult}
          </span>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          className="text-sm text-white caret-black resize-none bg-color font-[Consolas] outline-1 p-2 rounded-md w-full border-0 color-transparent outline outline-gray-200 focus:outline-primary-300"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Type any formula"
          rows={1}
          onChange={onInputChange}
          onKeyDown={onEnterKeyDown}
        />
        <div
          className="absolute text-color text-start pointer-events-none overflow-hidden whitespace-pre-wrap break-words top-0 left-0 right-0 bottom-0 p-2 text-sm font-[Consolas] cursor-text"
          dangerouslySetInnerHTML={highlightWords(
            [
              [...autocompleteItems.map((el) => el.name)],
              [...SUPPORTED_FORMULAS],
            ],
            highlightColors,
          )}
        />
        {!!filteredAutocompleteItems.length && autocompleteOpen && (
          <div className="absolute bottom-0  bg-white border border-grey translate-y-full w-full max-h-[300px] overflow-y-auto	">
            {filteredAutocompleteItems.map((el) => (
              <div
                key={el.name}
                onClick={() => {
                  onAutocompleteItemClick(el.name);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer text-start flex justify-between"
              >
                <div>{el.name}</div>
                <div className="text-gray-400">{el.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
});
