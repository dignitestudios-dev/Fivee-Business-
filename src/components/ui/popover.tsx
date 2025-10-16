"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

export function Popover({
  open: controlledOpen,
  onOpenChange,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <PopoverContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverContextType {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(
  undefined
);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
}

export function PopoverTrigger({
  asChild = false,
  children,
}: PopoverTriggerProps) {
  const { isOpen, onOpenChange } = usePopover();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick(e);
        childProps?.onClick?.(e);
      },
    });
  }

  return <div onClick={handleClick}>{children}</div>;
}

export function PopoverContent({
  children,
  className = "",
}: PopoverContentProps) {
  const { isOpen, onOpenChange } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        const trigger = document.activeElement;
        if (trigger && !trigger.contains(event.target as Node)) {
          onOpenChange(false);
        }
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
