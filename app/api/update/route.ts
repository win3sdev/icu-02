import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      schoolName,
      province,
      city,
      district,
      grade,
      schoolStartTime,
      schoolEndTime,
      weeklyStudyHours,
      monthlyHolidays,
      suicideCases,
      studentComments,
    } = body;

    const updated = await prisma.schoolSurvey.update({
      where: { id },
      data: {
        schoolName,
        province,
        city,
        district,
        grade,
        schoolStartTime,
        schoolEndTime,
        weeklyStudyHours,
        monthlyHolidays,
        suicideCases,
        studentComments,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("更新失败:", err);
    return NextResponse.json({ error: "内部错误" }, { status: 500 });
  }
}
