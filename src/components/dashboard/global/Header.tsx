"use client";
import Support from "@/components/icons/Support";
import { constants } from "@/lib/constants";
import { getInitials, toTitleCase } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import DropdownPopup from "@/components/ui/DropdownPopup";
import { BiChevronDown } from "react-icons/bi";
import Card from "@/components/icons/Card";
import Logout from "@/components/icons/Logout";
import { logoutUser } from "@/lib/features/userSlice";
import ChatPopup from "../ChatPopup";
import Popup from "@/components/ui/Popup";
import LogoutIcon from "@/components/icons/LogoutIcon";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.user);
  const [showChatSupport, setShowChatSupport] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const fullName = useMemo(
    () => `${user?.firstName} ${user?.lastName}`,
    [user]
  );

  const handleLogout = () => {
    router.push("/auth/login");
    dispatch(logoutUser());
  };

  const handleToggleChatSupport = (toggle: "show" | "hide") => {
    setShowChatSupport(toggle === "show" ? true : false);
  };

  const navLinks = [
    {
      title: "Home",
      label: "home",
      path: "/dashboard",
    },
    {
      title: "Signatues",
      label: "signatues",
      path: "/dashboard/signatures",
    },
    {
      title: "Videos",
      label: "videos",
      path: "/dashboard/videos",
    },
  ];

  const profilePopupOptions = [
    {
      label: "Manage Payments",
      icon: <Card />,
      onClick: () => router.push("/dashboard/manage-payment-methods"),
    },
    {
      type: "divider" as const,
    },
    {
      label: "Logout",
      icon: <Logout />,
      variant: "danger" as const,
      onClick: () => setShowLogout(true),
    },
  ];

  return (
    <>
      <header className="flex justify-between items-center px-5 gap-5 bg-[var(--primary)]">
        <div className="flex items-center gap-5">
          <Link href="/dashboard">
            <Image
              src={constants.APP_CONFIG.logo}
              alt={constants.APP_CONFIG.name}
              height={30}
              width={30}
            />
          </Link>

          <nav className="flex items-center gap-5 text-white ms-10">
            {navLinks.map((navLink, index) => (
              <div
                key={index}
                className={`p-5 cursor-pointer ${
                  pathname === navLink.path && "border-b-2 border-white"
                }`}
              >
                <Link href={navLink.path}>{navLink.title}</Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-10 text-white">
          <button
            className="cursor-pointer flex gap-3 items-center"
            onClick={() => handleToggleChatSupport("show")}
          >
            <Support />
            Customer Support
          </button>

          <DropdownPopup
            trigger={
              <div className="cursor-pointer flex items-center gap-2">
                <div className="select-none font-bold flex justify-center items-center h-[40px] w-[40px] rounded-full bg-white text-black">
                  {getInitials(fullName)}
                </div>

                <div>
                  <p className="select-none">{fullName}</p>
                  <p className="text-xs select-none">
                    {toTitleCase(user?.employmentType || "")}
                  </p>
                </div>

                <BiChevronDown size={24} />
              </div>
            }
            header={
              <div className="flex flex-col justify-center items-center mt-5">
                <div className=" font-bold flex justify-center items-center mb-3 h-[60px] w-[60px] rounded-full bg-[var(--primary)] text-white text-xl">
                  {getInitials(fullName)}
                </div>

                <p className="text-black text-base font-semibold">{fullName}</p>
                <p className="text-sm text-desc">
                  {toTitleCase(user?.employmentType || "")}
                </p>
              </div>
            }
            options={profilePopupOptions}
          />
        </div>
      </header>

      {/* Chat popup */}
      <ChatPopup
        isOpen={showChatSupport}
        onClose={() => handleToggleChatSupport("hide")}
      />

      {/* Logout Popup */}
      <Popup
        open={showLogout}
        icon={<LogoutIcon />}
        title="Logout"
        message="Volutpat pretium blandit amet ac tempor nulla hendrerit ultricies. Aenean in quis faucibus purus at."
        type="confirm"
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        btnType="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </>
  );
};

export default Header;
