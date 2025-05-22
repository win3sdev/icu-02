"use client";

import { useEffect, useState } from "react";
import { SchoolSurvey } from "@/app/types/survey";
import DetailModal from "@/app/components/DetailModal";
import { format } from "date-fns";

export default function ApprovedPage() {
  const [surveys, setSurveys] = useState<SchoolSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SchoolSurvey | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/surveys?status=approved&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("获取数据失败");
        const result = await response.json();
        setSurveys(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error("Error fetching surveys:", err);
        setError("获取数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [page]);

  const handleReview = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowReviewModal(true);
  };

  const handleReReview = async () => {
    if (!selectedSurvey) return;
    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          status: "pending",
          comment: reviewComment,
        }),
      });

      if (!response.ok) throw new Error("操作失败");

      setSurveys((prev) =>
        prev.filter((survey) => survey.id !== selectedSurvey.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
    } catch (error) {
      console.error("Error updating survey:", error);
      setError("操作失败，请稍后重试");
    }
  };

  const handleViewDetail = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowDetailModal(true);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">审核通过列表</h1>

      {loading ? (
        <div className="text-center text-lg">加载中...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* 表头省略，保留你原来的 <thead> */}
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
                    通过原因
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
                      <td className="whitespace-nowrap px-6 py-4">
                        {survey.city}
                      </td>
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
                        {/* {new Date(survey.updatedAt).toLocaleString()} */}
                        {format(
                          new Date(survey.updatedAt),
                          "yyyy-MM-dd HH:mm:ss"
                        )}
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

          {/* 分页器 */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              上一页
            </button>

            <span>
              第 <strong>{page}</strong> 页 / 共 <strong>{totalPages}</strong>{" "}
              页
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </>
      )}

      {/* 重新审核模态框 */}
      {/* 重新审核模态框 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">重新审核</h2>
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
                onClick={handleReReview}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {/* <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
      /> */}

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
        type="approved"
        onReview={(survey) => handleReview(survey)}
      />
    </div>
  );
}
