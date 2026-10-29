import toast from "react-hot-toast";

type AnyErrors = Record<string, any>;

// Walks react-hook-form's error tree and returns every leaf that has a message.
const collect = (errors: AnyErrors, path: string[] = []) => {
  const found: { path: string; message: string }[] = [];
  for (const [key, value] of Object.entries(errors || {})) {
    if (!value || key === "ref") continue;
    if (typeof value.message === "string" && value.message) {
      found.push({ path: [...path, key].join("."), message: value.message });
    }
    if (typeof value === "object") {
      found.push(...collect(value, [...path, key]));
    }
  }
  // de-duplicate (a node can be reported both as itself and via its children)
  return found.filter(
    (e, i) => found.findIndex((o) => o.path === e.path) === i
  );
};

const humanize = (path: string) =>
  (path.split(".").pop() || path)
    .replace(/\[\d+\]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

/**
 * Pass as the 2nd argument of react-hook-form's handleSubmit. Without it, a
 * failed validation on a hidden or unlabeled field makes "Next" do nothing.
 */
export const reportInvalidForm = (errors: AnyErrors) => {
  const found = collect(errors);
  // eslint-disable-next-line no-console
  console.warn("Form validation failed:", errors);
  const first = found[0];
  toast.error(
    first
      ? `Please fix: ${humanize(first.path)} - ${first.message}` +
          (found.length > 1 ? ` (+${found.length - 1} more)` : "")
      : "Please check the highlighted fields before continuing.",
    { id: "form-invalid" }
  );

  if (typeof document === "undefined" || !first) return;
  const escaped = (window as any).CSS?.escape
    ? (window as any).CSS.escape(first.path)
    : first.path;
  const target =
    document.getElementById(first.path) ||
    document.querySelector<HTMLElement>(`[name="${first.path}"]`) ||
    document.getElementById(escaped);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    (target as HTMLElement).focus?.({ preventScroll: true });
  }
};
