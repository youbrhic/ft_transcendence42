import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { MdCancel, MdDelete } from "react-icons/md";
import { Message } from "../../types/Message";
import { useTranslation } from "react-i18next";

interface Messageprops {
  messages: Message[];
  loggedInUserId: number;
  handleThreeDotsClick: (
    messageId: string | number,
    e: React.MouseEvent
  ) => void;
  showMenu: string | number | null;
  setShowMenu: React.Dispatch<React.SetStateAction<string | number | null>>;
  handleDeleteClick: (messgaeId: string | number) => void;
}

const Messages: React.FC<Messageprops> = ({
  messages,
  loggedInUserId,
  handleThreeDotsClick,
  showMenu,
  setShowMenu,
  handleDeleteClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {t} = useTranslation();
  
  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    messagesEndRef.current?.scrollIntoView();
  }, [visibleMessages]);

  useEffect(() => {
    const start = Math.max(messages.length - page * pageSize, 0);
    const end = messages.length;
    setVisibleMessages(messages.slice(start, end));
  }, [messages, page]);
  const handleScroll = () => {
    if (!containerRef.current) return;

    if (
      containerRef.current.scrollTop === 0 &&
      page * pageSize < messages.length
    ) {
      const oldScrollHeight = containerRef.current.scrollHeight;
      setPage((prev) => prev + 1);
      setLoading(true);

      setTimeout(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - oldScrollHeight;
          setLoading(false);
        }
      }, 800);
    }
  };

  return (
    <div
      className="flex-grow overflow-y-auto pr-4 space-y-4 mt-4 custom-scroll overflow-x-hidden"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {loading && (
        <div className="flex justify-center items-center py-2">
          <DotLottieReact
            className="w-72 "
            src="https://lottie.host/93ceb104-8e2e-44e3-9af2-713435818c5b/OGOprlL4O4.lottie"
            loop
            autoplay
          />
        </div>
      )}

      {visibleMessages.map((msg, index) => {
        const msgDate = new Date(msg.timestamp);
        const currentDateStr = msgDate.toLocaleDateString(t("date_conv"), {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const previousDateStr =
          index > 0
            ? new Date(visibleMessages[index - 1].timestamp).toLocaleDateString(
                t("date_conv"),
                { day: "numeric", month: "long", year: "numeric" }
              )
            : null;
        const time = msgDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const isMe = msg.senderId === loggedInUserId;
        const showDate = index === 0 || currentDateStr !== previousDateStr;

        return (
          <div key={msg.id || index}>
            {showDate && (
              <div className="flex items-center justify-center my-4">
                <span className="bg-[#2f3542] text-gray-400 text-xs px-3 py-1 rounded-md">
                  {currentDateStr}
                </span>
              </div>
            )}
            <div className={`flex ${!isMe ? "justify-start" : "justify-end"}`}>
              <div className="relative group max-w-xs sm:max-w-sm md:max-w-md break-words">

                <div
                  className={`rounded-xl p-2 whitespace-pre-wrap shadow-lg  ${
                    isMe
                      ? "bg-[#0077FF] text-white self-end"
                      : "bg-[#393E46] text-white self-start"
                  }`}
                >
                  {msg.text}
                </div>
                {isMe && (
                  <button
                    onClick={(e) => handleThreeDotsClick(msg.id, e)}
                    className={`absolute top-2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-gray-200`}
                  >
                    <HiEllipsisVertical className="w-4 h-4" />
                  </button>
                )}

                {isMe && showMenu === msg.id && (
                  <div className={`absolute top-0 z-50 right-full mr-2 mb-2`}>
                    <div className="bg-white rounded-lg shadow-lg pb-0 border border-gray-200 min-w-[120px]">
                      <button
                        onClick={() => handleDeleteClick(msg.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
                      >
                        <MdDelete />
                        {t("delete")}
                      </button>
                      <button
                        onClick={() => setShowMenu(null)}
                        className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                      >
                        <MdCancel />
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                )}

                <span className="text-xs text-gray-500 mt-1 block text-right">
                  {time}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
