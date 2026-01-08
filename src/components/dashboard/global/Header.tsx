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
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.user);
  const [showChatSupport, setShowChatSupport] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const unreadCount = useAppSelector(
    (state: any) =>
      state.chat?.messages?.filter(
        (msg: any) => msg.sender === "support" && !msg.read
      ).length || 0
  );

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
      title: "Signatures",
      label: "signatures",
      path: "/dashboard/signatures",
    },
    {
      title: "Tax information",
      label: "videos",
      path: "/dashboard/videos",
    },
    {
      title: "Do my tax",
      label: "do-my-tax",
      path: "https://fiveetaxservices.mytaxportal.online",
      target: "_blank",
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
              height={80}
              width={80}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-white ms-10">
            {navLinks.map((navLink, index) => (
              <div
                key={index}
                className={`p-5 cursor-pointer ${
                  pathname === navLink.path && "border-b-2 border-white"
                }`}
              >
                <Link href={navLink.path} target={navLink.target || "_self"}>{navLink.title}</Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5 lg:gap-10 text-white">
          <button
            className="cursor-pointer flex gap-3 items-center relative"
            onClick={() => handleToggleChatSupport("show")}
          >
            <Support />
            <span className="hidden lg:block">Customer Support</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 right-0 lg:-right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="hidden lg:block">
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

                  <p className="text-black text-base font-semibold">
                    {fullName}
                  </p>
                  <p className="text-sm text-desc">
                    {toTitleCase(user?.employmentType || "")}
                  </p>
                </div>
              }
              options={profilePopupOptions}
            />
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-64 bg-[var(--primary)] h-full p-5 text-white flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
              <Image
                src={constants.APP_CONFIG.logo}
                alt={constants.APP_CONFIG.name}
                height={60}
                width={60}
              />
            </Link>
            <button onClick={() => setSidebarOpen(false)}>
              <FiX size={24} />
            </button>
          </div>

          <div className="flex flex-col justify-center items-center mb-5">
            <div className="font-bold flex justify-center items-center mb-3 h-[60px] w-[60px] rounded-full bg-white text-black text-xl">
              {getInitials(fullName)}
            </div>

            <p className="text-base font-semibold">{fullName}</p>
            <p className="text-sm">{toTitleCase(user?.employmentType || "")}</p>
          </div>

          <nav className="flex flex-col gap-5 mb-10">
            {navLinks.map((navLink, index) => (
              <Link
                key={index}
                href={navLink.path}
                className={`py-2 cursor-pointer ${
                  pathname === navLink.path && "font-bold"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {navLink.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="flex flex-col gap-3">
              <button
                className="flex items-start gap-2"
                onClick={() => {
                  router.push("/dashboard/manage-payment-methods");
                  setSidebarOpen(false);
                }}
              >
                Manage Payments
              </button>
              <hr className="border-white/20" />
              <button
                className="flex items-center gap-2 text-red-500"
                onClick={() => {
                  setShowLogout(true);
                  setSidebarOpen(false);
                }}
              >
                <Logout />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div
          className="flex-1 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>

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
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </>
  );
};

export default Header;
