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
export const maskedRegister = <T extends FieldValues>(
  register: UseFormRegister<T>,
  setValue: UseFormSetValue<T>,
  name: Path<T>,
  format: (value: string) => string
) =>
  register(name, {
    onChange: (event) => {
      const formatted = format(event.target.value);
      event.target.value = formatted;
      setValue(name, formatted as PathValue<T, Path<T>>, { shouldDirty: true });
    },
  });
