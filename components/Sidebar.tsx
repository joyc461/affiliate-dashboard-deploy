"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, X, Zap } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Sync activeItem with pathname
  useEffect(() => {
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
      setActiveItem("Dashboard");
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsMobileOpen(false);
  };

  const renderNavList = () => (
    <div className="flex flex-col gap-1.5 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeItem === item.name ||
          (item.name === "Dashboard" &&
            (pathname === "/dashboard" || pathname.startsWith("/dashboard")) &&
            activeItem === "Dashboard");

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => handleNavClick(item.name)}
            className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none ${
              isActive
                ? "bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/60"
            }`}
          >
            {/* Active left border bar */}
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full shadow-xs shadow-blue-500/50 animate-in fade-in duration-200" />
            )}

            <div
              className={`flex items-center justify-center rounded-lg p-1 transition-transform duration-200 shrink-0 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 scale-110"
                  : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:scale-105"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="tracking-tight truncate">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80">
      <div>
        {/* Top Brand Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <Link
            href="/dashboard"
            onClick={() => handleNavClick("Dashboard")}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Zap className="w-5 h-5 fill-white/20" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent truncate">
              Affiliate Panel
            </span>
          </Link>
          {/* Close button inside drawer for mobile */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation modules list */}
        {renderNavList()}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" onClick={() => handleNavClick("Dashboard")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Zap className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Affiliate Panel
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white dark:bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-300 z-10">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {children}
      </div>
    </>
  );
}
