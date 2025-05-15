"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface MenuItem {
  name: string;
  href: string;
  adminOnly?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuSection[] = [
    {
      title: "内容审核",
      items: [
        { name: "待审核", href: "/dashboard/pending" },
        { name: "审核通过", href: "/dashboard/approved" },
        { name: "审核拒绝", href: "/dashboard/rejected" },
      ],
    },
    {
      title: "设置管理",
      items: [{ name: "用户管理", href: "/dashboard/users", adminOnly: true }],
    },
  ];

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // 使用相同的样式类，但根据 mounted 状态调整透明度
  const sidebarClasses =
    "flex h-full w-64 flex-col bg-gray-800 text-white shadow-lg";
  const headerClasses =
    "flex h-20 items-center justify-center border-b border-gray-700 bg-gray-900 px-4 cursor-pointer transition-all duration-300 hover:bg-gray-800";
  const userInfoClasses =
    "flex items-center space-x-3 border-b border-gray-700 p-4";
  const menuItemClasses = (isActive: boolean) =>
    `block rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className={sidebarClasses} style={{ opacity: mounted ? 1 : 0 }}>
      {/* 网站名称 */}
      <div className={headerClasses} onClick={() => router.push("/dashboard")}>
        <h1 className="text-xl font-bold">人工审核系统</h1>
      </div>

      {/* 用户信息 */}
      <div className={userInfoClasses}>
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-semibold">
            {session?.user?.name?.[0] || "U"}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-gray-400">
            {session?.user?.role === "admin" ? "管理员" : "审核员"}
          </p>
        </div>
      </div>

      {/* 菜单项 */}
      <div className="flex-1 overflow-y-auto p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-700"
              onClick={() => toggleSection(section.title)}
            >
              <span>{section.title}</span>
              <svg
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  collapsedSections[section.title] ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {!collapsedSections[section.title] && (
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  if (item.adminOnly && session?.user?.role !== "admin") {
                    return null;
                  }
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={menuItemClasses(pathname === item.href)}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
