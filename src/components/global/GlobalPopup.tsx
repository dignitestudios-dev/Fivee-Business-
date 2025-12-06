"use client";

import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import Popup from "@/components/ui/Popup";

export default function GlobalPopup() {
  const popup = useAppSelector((state) => state.popup);
  const { closePopup } = useGlobalPopup();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="pointer-events-auto">
        <Popup
          open={popup.open}
          onClose={closePopup}
          type={popup.type}
          title={popup.title}
          message={popup.description}
          showCloseButton={true}
        />
      </div>
    </div>
  );
}
