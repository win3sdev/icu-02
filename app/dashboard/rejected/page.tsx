"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { SchoolSurvey } from "@/app/types/survey";
import DetailModal from "@/app/components/DetailModal";

export default function RejectedPage() {
  const [surveys, setSurveys] = useState<SchoolSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SchoolSurvey | null>(
    null
  );

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys?status=rejected");
        if (!response.ok) {
          throw new Error("获取数据失败");
        }
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setError("获取数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleReview = async (surveyId: number) => {
    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId,
          status: "pending",
          comment: "",
        }),
      });

      if (!response.ok) {
        throw new Error("操作失败");
      }

      // 更新本地状态
      setSurveys((prev) => prev.filter((survey) => survey.id !== surveyId));
    } catch (error) {
      console.error("Error updating survey:", error);
      setError("操作失败，请稍后重试");
    }
  };

  const handleViewDetail = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">审核拒绝列表</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                学校名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                省份
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                城市
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                区县
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                年级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                上学时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                放学时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                每周学习时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                每月放假天数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                24年自杀人数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                学生评论
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                拒绝原因
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                审核时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {surveys.length === 0 ? (
              <tr>
                <td
                  colSpan={14}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              surveys.map((survey) => (
                <tr key={survey.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.schoolName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.province}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{survey.city}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.district}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.grade}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.schoolStartTime}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.schoolEndTime}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.weeklyStudyHours}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.monthlyHolidays}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.suicideCases}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {survey.studentComments}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey.reviewComment}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(survey.updatedAt).toLocaleString()}
                    {/* format(new Date(survey.updatedAt), "yyyy-MM-dd HH:mm:ss") */}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(survey)}
                        className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleReview(survey.id)}
                        className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        重新审核
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
        type="rejected"
      />
    </div>
  );
}
