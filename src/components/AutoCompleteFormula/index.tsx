import { useGetAutocompleteData } from "@/api";
import { AutoCompleteInput } from "@/components/AutoCompleteFormula/AutoCompleteInput.tsx";
import { useAutocompleteData } from "@/components/AutoCompleteFormula/store.ts";

export const AutoCompleteFormula = () => {
  const setAutocompleteItems = useAutocompleteData(
    (state) => state.setAutocompleteItems,
  );
  useGetAutocompleteData(setAutocompleteItems);

  return (
    <div className="w-full max-w-[680px]">
      <AutoCompleteInput />
    </div>
  );
};
