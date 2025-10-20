import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import { CgArrowsVAlt } from "react-icons/cg";

// Types
interface DropdownOption {
  key?: string | number;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  variant?: "default" | "danger";
  keepOpen?: boolean;
  type?: never;
}

interface DropdownDivider {
  type: "divider";
  key?: string | number;
  label?: never;
  icon?: never;
  onClick?: never;
  shortcut?: never;
  disabled?: never;
  variant?: never;
  keepOpen?: never;
}

type DropdownItem = DropdownOption | DropdownDivider;

type PlacementType = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface DropdownPopupProps {
  trigger?: ReactElement;
  title?: string;
  header?: ReactElement;
  options?: DropdownItem[];
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  placement?: PlacementType;
  offset?: number;
}

const DropdownPopup = forwardRef<HTMLButtonElement, DropdownPopupProps>(
  (
    {
      trigger,
      title,
      header,
      options = [],
      className = "",
      dropdownClassName = "",
      disabled = false,
      placement = "bottom-right",
      offset = 8,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            event.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            );
            break;
          case "Enter":
            event.preventDefault();
            if (highlightedIndex >= 0 && options[highlightedIndex]) {
              handleOptionClick(options[highlightedIndex]);
            }
            break;
          case "Escape":
            event.preventDefault();
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, options, highlightedIndex]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex >= 0 && dropdownRef.current) {
        const highlightedElement = dropdownRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [highlightedIndex]);

    const handleToggle = (): void => {
      if (disabled) return;
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    };

    const handleOptionClick = (option: DropdownItem): void => {
      if (option.type === "divider" || option.disabled) return;

      // Execute the action
      if (option.onClick) {
        option.onClick();
      }

      // Close dropdown unless keepOpen is true
      if (!option.keepOpen) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    const getDropdownPosition = (): string => {
      const baseClasses =
        "absolute z-50 min-w-[200px] w-[300px] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden transition-all duration-200 ease-in-out origin-top";

      switch (placement) {
        case "bottom-left":
          return `${baseClasses} left-0 mt-${offset / 4}`;
        case "top-right":
          return `${baseClasses} right-0 bottom-full mb-${offset / 4}`;
        case "top-left":
          return `${baseClasses} left-0 bottom-full mb-${offset / 4}`;
        case "bottom-right":
        default:
          return `${baseClasses} right-0 mt-${offset / 4}`;
      }
    };

    const renderTrigger = (): ReactElement => {
      if (trigger) {
        return React.cloneElement(trigger, {
          onClick: handleToggle as React.MouseEventHandler<HTMLElement>,
          disabled: disabled,
          ref: ref,
        } as any);
      }

      // Default trigger button
      return (
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`inline-flex items-center justify-center p-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${className}`}
          {...props}
        >
          <CgArrowsVAlt className="w-5 h-5" />
        </button>
      );
    };

    return (
      <div className={`relative inline-block`} ref={containerRef}>
        {renderTrigger()}

        {/* Dropdown */}
        <div
          className={`${getDropdownPosition()} ${dropdownClassName} ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {title && <p className="px-4 pt-2">{title}</p>}
          {header ? header : ""}
          <div className="py-3 max-h-48 overflow-y-auto" ref={dropdownRef}>
            {options.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                if (option.type === "divider") {
                  return (
                    <hr
                      key={option.key || `divider-${index}`}
                      className="my-1 border-gray-200"
                    />
                  );
                }

                return (
                  <button
                    key={option.key || index}
                    type="button"
                    className={`cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100  flex items-center gap-3 transition-colors duration-150 ${
                      highlightedIndex === index ? "bg-gray-100" : ""
                    } ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "text-gray-900"
                    } ${
                      option.variant === "danger"
                        ? "text-red-600 hover:bg-red-50"
                        : ""
                    }`}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span className="flex-1">{option.label}</span>
                    {option.shortcut && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {option.shortcut}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default DropdownPopup;
