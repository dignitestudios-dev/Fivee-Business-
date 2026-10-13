import type {
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

/**
 * register() for an input whose text is reformatted as the user types (SSN,
 * phone, EIN, ...).
 *
 * react-hook-form stores the raw keystroke *before* a custom onChange runs, so
 * rewriting `event.target.value` alone leaves the form state (what is validated
 * and saved) one step behind the text the user sees: type a 10th digit into an
 * SSN box and the box still shows nine digits while the form holds ten. This
 * writes the formatted value back into the form state as well, so the two can
 * never differ.
 */
// Characters that carry meaning; everything else is formatting the mask adds
const SIGNIFICANT_RE = /[A-Za-z0-9+]/;

const countSignificant = (text: string) =>
  [...text].filter((char) => SIGNIFICANT_RE.test(char)).length;

/** Index just after the n-th significant character (0 when n is 0). */
const positionAfterSignificant = (text: string, n: number) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (SIGNIFICANT_RE.test(text[i]) && ++seen === n) return i + 1;
  }
  return text.length;
};

export const maskedRegister = <T extends FieldValues>(
  register: UseFormRegister<T>,
  setValue: UseFormSetValue<T>,
  name: Path<T>,
  format: (value: string) => string
) => {
  return register(name, {
    onChange: (event) => {
      const input = event.target as HTMLInputElement;
      let raw = input.value;
      let caret = input.selectionStart ?? raw.length;
      const atEnd = caret >= raw.length;
      const inputType = (event.nativeEvent as InputEvent | undefined)?.inputType;

      // Backspacing over a separator ("123-|45") changes nothing once
      // reformatted (the mask puts it straight back), which would leave the
      // caret stuck there. Remove the digit in front of the separator instead,
      // as the user intended.
      const reformatted = format(raw);
      if (
        inputType === "deleteContentBackward" &&
        caret > 0 &&
        reformatted.slice(0, caret) === raw.slice(0, caret) &&
        reformatted.length > caret &&
        !SIGNIFICANT_RE.test(reformatted[caret])
      ) {
        let i = caret - 1;
        while (i > 0 && !SIGNIFICANT_RE.test(raw[i - 1])) i--;
        if (i > 0) {
          raw = raw.slice(0, i - 1) + raw.slice(caret);
          caret = i - 1;
        }
      }

      const formatted = format(raw);
      const significantBeforeCaret = countSignificant(raw.slice(0, caret));

      input.value = formatted;
      setValue(name, formatted as PathValue<T, Path<T>>, { shouldDirty: true });

      // Keep the caret where the user was typing instead of jumping to the end
      if (!atEnd && document.activeElement === input) {
        const position = positionAfterSignificant(
          formatted,
          significantBeforeCaret
        );
        input.setSelectionRange(position, position);
      }
    },
  });
};
