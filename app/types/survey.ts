export type SurveyStatus = "pending" | "approved" | "rejected";

export interface SchoolSurvey {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  province: string;
  city: string;
  district: string;
  schoolName: string;
  grade: string;
  schoolStartTime: string;
  schoolEndTime: string;
  weeklyStudyHours: number;
  monthlyHolidays: number;
  suicideCases: number;
  studentComments: string;
  status: SurveyStatus;
  reviewComment: string | null;
}

export interface ReviewAction {
  surveyId: number;
  status: SurveyStatus;
  comment: string;
}
