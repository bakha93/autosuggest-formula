import { useQuery } from "react-query";
import { AutocompleteItem } from "@/components/AutoSuggestFormula/store.ts";

// export const useGetAutocompleteData = (onSuccess: (data: AutocompleteItem[]) => void) => {
//   return useQuery(
//     "autocompleteItems",
//     async () => {
//       return await fetch(
//         "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete",
//       ).then((data) => data.json());
//     },
//     { onSuccess: (data) =>  onSuccess(data)},
//   );
// };
export const useGetAutocompleteData = (
  onSuccess: (data: AutocompleteItem[]) => void,
) => {
  return useQuery<AutocompleteItem[], Error>(
    "autocompleteItems",
    async (): Promise<AutocompleteItem[]> => {
      try {
        const response = await fetch(
          "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      } catch (error) {
        throw new Error("Failed to fetch data");
      }
    },
    { onSuccess }, // Automatically calls onSuccess when data fetching is successful
  );
};
