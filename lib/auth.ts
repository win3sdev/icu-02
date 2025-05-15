import { authOptions } from "./authConfig"; // 只导出 authConfig.ts 里的

import { getServerSession as nextAuthGetServerSession } from "next-auth/next";

export function getServerSession(req?: any, res?: any) {
  return nextAuthGetServerSession(req, res, authOptions);
}
