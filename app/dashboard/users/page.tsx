"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// 导入必要的类型和接口
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (userData: Partial<User>) => void;
}
// 用户模态框组件，用于添加和编辑用户
const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  // 使用useEffect处理表单数据的初始化和更新
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user",
        password: "",
      });
    }
  }, [user]);
  // 处理表单提交事件
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;
  // 模态框的JSX结构
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {user ? "编辑用户" : "添加用户"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2"
              required={!user}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// 用户管理页面组件
export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  // 使用useEffect处理权限验证和数据获取
  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);
    // 页面加载时，如果session状态为loading，则显示加载中，并返回
    if (status === "loading") {
      setLoading(true);
      return;
    }
    // 如果用户未登录，跳转到登录页面
    if (status === "unauthenticated") {
      router.push("/login"); // 或者你希望未登录用户跳转的页面
      return;
    }
    // 如果用户不是管理员，跳转到dashboard
    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    // 只有当用户是管理员时，才进行用户数据的获取
    setLoading(true);
    fetchUsers();
  }, [session, status, router]);
  // 异步函数，用于获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("获取用户列表失败");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("获取用户列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };
  // 处理添加用户按钮点击事件
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setShowModal(true);
  };
  // 处理编辑用户按钮点击事件
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  // 异步函数，用于处理删除用户
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除这个用户吗？")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("删除用户失败");
      }

      setUsers(users.filter((user) => user.id.toString() !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("删除用户失败，请稍后重试");
    }
  };
  // 异步函数，用于处理用户数据的保存（添加或更新）
  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      const url = selectedUser ? `/api/users/${selectedUser.id}` : "/api/users";
      const method = selectedUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(selectedUser ? "更新用户失败" : "创建用户失败");
      }

      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
      setError(
        selectedUser ? "更新用户失败，请稍后重试" : "创建用户失败，请稍后重试"
      );
    }
  };
  // 如果正在加载数据，显示加载中
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }
  // 如果发生错误，显示错误信息
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }
  // 页面主要的JSX结构
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          添加用户
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                邮箱
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" ? "管理员" : "普通用户"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id.toString())}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 渲染用户模态框组件 */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}
