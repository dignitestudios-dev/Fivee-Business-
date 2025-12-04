"use client";

import { useAppSelector } from "@/lib/hooks";
import { useGlobalPopup } from "@/hooks/useGlobalPopup";
import Popup from "@/components/ui/Popup";

export default function GlobalPopup() {
  const popup = useAppSelector((state) => state.popup);
  const { closePopup } = useGlobalPopup();

  return (
    <Popup
      open={popup.open}
      onClose={closePopup}
      type={popup.type}
      title={popup.title}
      message={popup.description}
      showCloseButton={true}
    />
  );
}
