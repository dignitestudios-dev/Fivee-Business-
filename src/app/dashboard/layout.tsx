import Header from "@/components/dashboard/global/Header";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
