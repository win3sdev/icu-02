import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// import { authOptions } from '@/lib/auth';
import { authOptions } from "@/lib/authConfig";
import { SurveyStatus } from "@/app/types/survey";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as SurveyStatus;

    const surveys = await prisma.schoolSurvey.findMany({
      where: status ? { status } : {},
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        // createAt: true,
        schoolName: true,
        province: true,
        city: true,
        district: true,
        schoolStartTime: true,
        schoolEndTime: true,
        weeklyStudyHours: true,
        monthlyHolidays: true,
        suicideCases: true,
        studentComments: true,
        grade: true,
        reviewComment: true,
        updatedAt: true,
        status: true,
      },
    });
    // console.log(surveys);
    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { surveyId, status, comment } = body;

    const updatedSurvey = await prisma.schoolSurvey.update({
      where: { id: surveyId },
      data: {
        status,
        reviewComment: comment,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
