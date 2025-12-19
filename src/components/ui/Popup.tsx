import { useState, ReactNode } from "react";
import Modal from "./Modal";
import FButton from "./FButton";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type PopupType = "success" | "error" | "info" | "confirm";

interface PopupProps {
  /** Controls visibility of the popup */
  open: boolean;
  /** Called when popup is closed */
  onClose?: () => void;
  /** Type of popup that determines styling and default icon */
  type?: PopupType;
  /** Optional title text */
  title?: string;
  /** Text options i.e. position */
  textOptions?: { title?: "center" | "left"; message?: "center" | "left" };
  /** Message content - can be string or React element */
  message?: string | ReactNode;
  /** Text for confirm button */
  confirmText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** button variant to change the view */
  cancelVariant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "warning"
    | "outline";
  confirmVariant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "warning"
    | "outline";
  /** Called when confirm button is clicked - can be async */
  onConfirm?: () => void | Promise<void>;
  /** Called when cancel button is clicked or popup is cancelled */
  onCancel?: () => void;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Custom icon to override default type icon */
  icon?: ReactNode;
  /** Custom content to render below message */
  children?: ReactNode;
  /** Whether the confirm button is disabled */
  confirmDisabled?: boolean;
  /** Z-index for the modal */
  zIndex?: number | string;
}

/**
 * CustomPopup - A flexible modal popup for success, error, info, or confirmation.
 *
 * Props:
 * - open: boolean (controls visibility)
 * - onClose: function (called when closed)
 * - type: 'success' | 'error' | 'info' | 'confirm' (default: 'info')
 * - title: string (optional)
 * - message: string | ReactNode
 * - confirmText: string (default: 'Yes')
 * - cancelText: string (default: 'No')
 * - onConfirm: async function (called on Yes, can be async, supports loading)
 * - onCancel: function (called on No/cancel/close)
 * - showCloseButton: boolean (default: true)
 * - icon: ReactNode (optional, overrides default icon)
 * - children: ReactNode (optional, for custom content)
 */
const ICONS: Record<PopupType, ReactNode> = {
  success: <CheckCircle className="w-12 h-12 text-green-600" />,
  error: <XCircle className="w-12 h-12 text-red-600" />,
  info: <AlertTriangle className="w-12 h-12 text-blue-600" />,
  confirm: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
};

export default function Popup({
  open,
  onClose,
  type = "info",
  title,
  textOptions = { title: "center", message: "center" },
  message,
  confirmText = "Yes",
  cancelText = "No",
  cancelVariant = "outline",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  showCloseButton = true,
  icon,
  children,
  confirmDisabled = false,
  zIndex,
  ...modalProps
}: PopupProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const isConfirm = type === "confirm";

  const handleConfirm = async (): Promise<void> => {
    if (!onConfirm) return;
    setLoading(true);
    try {
      await onConfirm();
      setLoading(false);
      onClose && onClose();
    } catch (e) {
      setLoading(false);
      // Optionally handle error
    }
  };

  const handleCancel = (): void => {
    if (loading) return;
    onCancel ? onCancel() : onClose && onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleCancel}
      showCloseButton={showCloseButton}
      zIndex={zIndex}
      {...modalProps}
    >
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`flex justify-center items-center rounded-full bg-transparent`}
        >
          {icon || ICONS[type]}
        </div>
        {title && (
          <h3
            className={`${
              textOptions.title === "center" ? "text-center" : "self-start"
            } text-xl font-bold text-gray-900 mt-2`}
          >
            {title}
          </h3>
        )}
        {message && (
          <p
            className={`${
              textOptions.title === "center" ? "text-center" : "self-start"
            } text-gray-700 text-base mt-1 w-[440px]`}
          >
            {message}
          </p>
        )}
        {children}
      </div>
      {isConfirm && (
        <div className="flex justify-center gap-4 mt-6">
          <FButton
            type="button"
            className="min-w-[96px] w-full"
            variant={cancelVariant}
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </FButton>
          <FButton
            type="button"
            className="min-w-[96px] w-full"
            loading={loading}
            disabled={loading || confirmDisabled}
            onClick={handleConfirm}
            variant={confirmVariant}
          >
            {loading ? "Please wait..." : confirmText}
          </FButton>
        </div>
      )}
    </Modal>
  );
}
