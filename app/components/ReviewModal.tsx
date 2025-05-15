import React from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  comment: string;
  setComment: (comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  comment,
  setComment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">审核操作</h2>
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            审核备注
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            placeholder="请输入审核备注（可选）"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            取消
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            拒绝
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            通过
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
