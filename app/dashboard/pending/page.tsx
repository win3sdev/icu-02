"use client";

import { useEffect, useState } from "react";
import { SchoolSurvey } from "@/app/types/survey";
import DetailModal from "@/app/components/DetailModal";
// import ReviewModal from "@/app/components/ReviewModal";

export default function PendingPage() {
  const [surveys, setSurveys] = useState<SchoolSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SchoolSurvey | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys?status=pending");
        if (!response.ok) {
          throw new Error(`获取数据失败: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setSurveys(data);
        } else {
          console.error("Error: Received non-array data:", data);
          setError("接收到的数据格式不正确");
        }
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching surveys:", error);
        setError(`获取数据失败，请稍后重试: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleReview = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowReviewModal(true);
  };

  const handleApprove = async () => {
    if (!selectedSurvey) return;

    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          status: "approved",
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        throw new Error(`操作失败: ${response.status}`);
      }

      setSurveys((prev) =>
        prev.filter((survey) => survey.id !== selectedSurvey.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
    } catch (err) {
      const error = err as Error;
      console.error("Error approving survey:", error);
      setError(`操作失败，请稍后重试: ${error.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedSurvey) return;

    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          status: "rejected",
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        throw new Error(`操作失败: ${response.status}`);
      }

      setSurveys((prev) =>
        prev.filter((survey) => survey.id !== selectedSurvey.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
    } catch (err) {
      const error = err as Error;
      console.error("Error rejecting survey:", error);
      setError(`操作失败，请稍后重试: ${error.message}`);
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
      <h1 className="mb-6 text-2xl font-bold">待审核列表</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                提交时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                学校名称
              </th>
              {/* 省份, 城市, 区县, 年级, 上学时间, 放学时间, 每周学习时间, 每月放假天数, 24年自杀人数, 学生评论 */}
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
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {surveys.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              surveys.map((survey) => (
                <tr key={survey.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {survey?.updatedAt?.toLocaleString()}
                  </td>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(survey)}
                        className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleReview(survey)}
                        className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        审核
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 审核模态框 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">审核操作</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                审核备注
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={4}
                placeholder="请输入审核备注（可选）"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewComment("");
                }}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                拒绝
              </button>
              <button
                onClick={handleApprove}
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
      />

      {/* You are rendering ReviewModal twice. Let's remove the import and this instance */}
      {/* <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        comment={reviewComment}
        setComment={setReviewComment}
      /> */}
    </div>
  );
}
