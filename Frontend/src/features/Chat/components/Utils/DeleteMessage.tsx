import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface DeleteMessageProps {
  showDeleteModal: boolean;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({
  confirmDelete,
  cancelDelete,
  showDeleteModal,
}) => {
  const {t} = useTranslation();
  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4 ">
          <div className="bg-white rounded-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <MdDelete className="size-10 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("Delete_Message")}
              </h3>
            </div>

            <div className="border-t border-gray-200">
              <div className="flex">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 px-4 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 text-red-600 font-medium hover:bg-red-50 transition-colors duration-150"
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteMessage;
