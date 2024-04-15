import { create } from "zustand";

export type AutocompleteItem = {
  name: string;
  category: string;
  value: number;
  id: string;
};

interface IAutocompleteStore {
  autocompleteItems: AutocompleteItem[];
  setAutocompleteItems: (items: AutocompleteItem[]) => void;
}

export const useAutocompleteData = create<IAutocompleteStore>((set) => ({
  autocompleteItems: [],
  setAutocompleteItems: (items) => {
    set(() => ({ autocompleteItems: [...items] }));
  },
}));
