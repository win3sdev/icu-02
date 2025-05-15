import React from "react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: any;
  type?: "pending" | "approved" | "rejected";
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  survey,
  type = "pending",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
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
              <span>{survey?.schoolName}</span>
            </div>
            <div>
              <span className="font-medium">省份：</span>
              <span>{survey?.province}</span>
            </div>
            <div>
              <span className="font-medium">城市：</span>
              <span>{survey?.city}</span>
            </div>
            <div>
              <span className="font-medium">区县：</span>
              <span>{survey?.district}</span>
            </div>
            <div>
              <span className="font-medium">年级：</span>
              <span>{survey?.grade}</span>
            </div>
            <div>
              <span className="font-medium">上学时间：</span>
              <span>{survey?.schoolStartTime}</span>
            </div>
            <div>
              <span className="font-medium">放学时间：</span>
              <span>{survey?.schoolEndTime}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium">每周学习时间：</span>
              <span>{survey?.weeklyStudyHours}</span>
            </div>
            <div>
              <span className="font-medium">每月放假天数：</span>
              <span>{survey?.monthlyHolidays}</span>
            </div>
            <div>
              <span className="font-medium">24年自杀人数：</span>
              <span>{survey?.suicideCases}</span>
            </div>
            <div>
              <span className="font-medium">学生评论：</span>
              <span>{survey?.studentComments}</span>
            </div>
            <div>
              <span className="font-medium">提交时间：</span>
              <span>
                {survey?.updatedAt
                  ?.replace("T", " ")
                  .replace("Z", "")
                  .slice(0, 22)}
              </span>
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
                  <span>{survey?.reviewer}</span>
                </div>
                <div>
                  <span className="font-medium">审核时间：</span>
                  <span>{survey?.reviewTime}</span>
                </div>
                <div>
                  <span className="font-medium">审核意见：</span>
                  <span>{survey?.reviewComment}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* <div className="mt-4">
          <h3 className="font-medium mb-2">问卷内容：</h3>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(survey?.content, null, 2)}</pre>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DetailModal;
