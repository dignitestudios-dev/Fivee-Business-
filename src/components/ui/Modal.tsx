import React, { useEffect, useState, ReactNode } from "react";
import { IoClose } from "react-icons/io5";
// Types
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?:
    | "center"
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "bottom-center";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  zIndex?: number | string;
}

// Enhanced Modal Component
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "center",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  zIndex = 50,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = "hidden";

      // Trigger animation after mount
      setTimeout(() => setIsAnimating(false), 10);
    } else {
      setIsAnimating(true);
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 200);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const getPositionClasses = () => {
    const baseContainer = `fixed inset-0 z-${zIndex}`;
    const baseModal = `inline-block w-full ${sizes[size]} text-left transition-all duration-200 ease-out transform bg-white shadow-xl rounded-lg`;

    switch (position) {
      case "bottom-right":
        return {
          container: `${baseContainer} flex justify-end items-end p-4`,
          modal: `${baseModal} ${
            isAnimating
              ? "opacity-0 scale-95 translate-x-4 translate-y-4"
              : "opacity-100 scale-100 translate-x-0 translate-y-0"
          }`,
          backdrop: true, // Only show backdrop for center modals
        };
      case "bottom-left":
        return {
          container: `${baseContainer} flex justify-start items-end p-4`,
          modal: `${baseModal} ${
            isAnimating
              ? "opacity-0 scale-95 -translate-x-4 translate-y-4"
              : "opacity-100 scale-100 translate-x-0 translate-y-0"
          }`,
          backdrop: false,
        };
      case "top-right":
        return {
          container: `${baseContainer} flex justify-end items-start p-4`,
          modal: `${baseModal} ${
            isAnimating
              ? "opacity-0 scale-95 translate-x-4 -translate-y-4"
              : "opacity-100 scale-100 translate-x-0 translate-y-0"
          }`,
          backdrop: false,
        };
      case "top-left":
        return {
          container: `${baseContainer} flex justify-start items-start p-4`,
          modal: `${baseModal} ${
            isAnimating
              ? "opacity-0 scale-95 -translate-x-4 -translate-y-4"
              : "opacity-100 scale-100 translate-x-0 translate-y-0"
          }`,
          backdrop: false,
        };
      case "bottom-center":
        return {
          container: `${baseContainer} flex justify-center items-end p-4`,
          modal: `${baseModal} ${
            isAnimating
              ? "opacity-0 scale-95 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`,
          backdrop: false,
        };
      case "center":
      default:
        return {
          container: `${baseContainer} overflow-y-auto`,
          modal: `flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0`,
          modalInner: `${baseModal} p-6 my-8 align-middle ${
            isAnimating
              ? "opacity-0 scale-95 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`,
          backdrop: true,
        };
    }
  };

  const positionClasses = getPositionClasses();

  if (position === "center") {
    return (
      <div className={positionClasses.container}>
        <div className={positionClasses.modal}>
          {/* Backdrop */}
          {positionClasses.backdrop && (
            <div
              className={`fixed inset-0 transition-all duration-200 ease-out bg-black/50 bg-opacity-75 backdrop-blur-sm ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
              onClick={handleOverlayClick}
            />
          )}

          {/* Modal */}
          <div className={`${positionClasses.modalInner} ${className}`}>
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between mb-4">
                <div>
                  {title && (
                    <h3 className="text-lg font-medium text-gray-900">
                      {title}
                    </h3>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <IoClose className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div>{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Non-center positions
  return (
    <div className={positionClasses.container}>
      {/* Backdrop for non-center positions (optional/lighter) */}
      {positionClasses.backdrop && (
        <div
          className={`fixed inset-0 transition-all duration-300 ease-out bg-black/50 bg-opacity-10 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleOverlayClick}
        />
      )}

      {/* Modal */}
      <div className={`${positionClasses.modal} p-6 ${className}`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <IoClose className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
