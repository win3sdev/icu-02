"use client";

import { signOut, useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <div className="h-16 bg-white shadow-md">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">后台管理系统</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            欢迎, {session?.user?.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
