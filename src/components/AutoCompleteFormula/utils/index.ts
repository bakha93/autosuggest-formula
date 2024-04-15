import { AutocompleteItem } from "@/components/AutoCompleteFormula/store.ts";

export const replaceWordsInString = (
  str: string,
  word: string,
  replacement: string,
) => {
  const regex = new RegExp(word, "gi"); // Create a regex pattern from the array of words
  return str.replace(regex, replacement); // Replace all occurrences of the words with the replacement string
};

export const getReplacedString = (items: AutocompleteItem[], value: string) => {
  // remove  valueToReplace
  return items?.reduce((acc, item, index) => {
    const string = index === 0 ? value : acc;
    const valueToReplace = items.find((el) => el.name === item.name)?.value;
    acc = replaceWordsInString(string, item?.name, `${valueToReplace}`);
    return acc;
  }, "");
};
