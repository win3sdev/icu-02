import React from "react";


interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: any;
  type?: "pending" | "approved" | "rejected";
  onReview?: (survey: any) => void; // 点击按钮触发的函数
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  survey,
  type = "pending",
  onReview, // 新增
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">详细内容</h2>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="font-medium">学校名称：</span>
              {survey?.schoolName}
            </div>
            <div>
              <span className="font-medium">省份：</span>
              {survey?.province}
            </div>
            <div>
              <span className="font-medium">城市：</span>
              {survey?.city}
            </div>
            <div>
              <span className="font-medium">区县：</span>
              {survey?.district}
            </div>
            <div>
              <span className="font-medium">年级：</span>
              {survey?.grade}
            </div>
            <div>
              <span className="font-medium">上学时间：</span>
              {survey?.schoolStartTime}
            </div>
            <div>
              <span className="font-medium">放学时间：</span>
              {survey?.schoolEndTime}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium">每周学习时间：</span>
              {survey?.weeklyStudyHours}
            </div>
            <div>
              <span className="font-medium">每月放假天数：</span>
              {survey?.monthlyHolidays}
            </div>
            <div>
              <span className="font-medium">24年自杀人数：</span>
              {survey?.suicideCases}
            </div>
            <div>
              <span className="font-medium">学生评论：</span>
              {survey?.studentComments}
            </div>
            <div>
              <span className="font-medium">提交时间：</span>
              {survey?.updatedAt
                ?.replace("T", " ")
                .replace("Z", "")
                .slice(0, 22)}
            </div>
            {type !== "pending" && (
              <>
                <div>
                  <span className="font-medium">审核状态：</span>
                  <span
                    className={
                      type === "approved" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {type === "approved" ? "已通过" : "已拒绝"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">审核人：</span>
                  {survey?.reviewer}
                </div>
                <div>
                  <span className="font-medium">审核时间：</span>
                  {survey?.reviewTime}
                </div>
                <div>
                  <span className="font-medium">审核意见：</span>
                  {survey?.reviewComment}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 审核按钮：仅在 rejected 时显示 */}
        {/* {type === "rejected" && (
          <div className="mt-6 text-right">
            <button
              onClick={() => onReview?.(survey)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              重新审核
            </button>
          </div>
        )} */}
        {onReview && (
          <div className="mt-6 text-right">
            <button
              onClick={() => onReview(survey)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {type === "pending" ? "审核" : "重新审核"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailModal;
