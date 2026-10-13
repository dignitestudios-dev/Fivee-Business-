import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Keeps every error on the form in step with the values, in real time, once the
 * user has tried to continue.
 *
 * By default react-hook-form only re-checks the field being edited, and only for
 * edits made through the input itself. That leaves errors stuck on screen when:
 *  - a value is changed in code (removing a country, ticking a checkbox),
 *  - an error belongs to the whole list or to a different field than the one
 *    being edited (too many countries, the date-of-entry rule, ...).
 *
 * After the first submit attempt this re-validates the whole form on each change,
 * so a fixed error disappears the moment it is fixed and a new one appears the
 * moment a value turns invalid. Before the first attempt nothing is shown, so a
 * user is never told off for a field they have not reached yet.
 */
export function useLiveValidation<T extends FieldValues>(
  methods: UseFormReturn<T>
) {
  const { watch, trigger, formState } = methods;
  const { isSubmitted } = formState;

  useEffect(() => {
    if (!isSubmitted) return;
    const subscription = watch(() => {
      void trigger();
    });
    return () => subscription.unsubscribe();
  }, [isSubmitted, watch, trigger]);
}
