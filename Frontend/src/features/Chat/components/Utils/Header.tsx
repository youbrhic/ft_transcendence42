import OnlineStatusIcon from "./OnlineStatusIcon";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
interface HeaderProps {
  isMobile: boolean;
  user: { username: string; id: number; image_url: string; online: boolean };
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, user, onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-x-6">
      {isMobile && (
        <button onClick={onBack} className="text-white  transition-colors">
          <IoIosArrowBack className="size-7  rounded-full p-0.5" />
        </button>
      )}
      <img
        src={user.image_url}
        className="size-14 rounded-full max-lg:w-12 max-lg:h-12 border-2 border-[#0077FF] cursor-pointer"
        alt="User profile"
        onClick={() => {
          navigate(`/profile/${user.username}`);
        }}
      />
      <div className="flex flex-col">
        <strong className="text-white text-lg font-bold max-lg:text-sm">
          {user?.username || "User"}
        </strong>
        <strong className="text-gray-400 text-sm max-lg:text-xs flex items-center gap-x-2">
          <OnlineStatusIcon isOnline={user.online} />
          {user.online ? t("online") : t("offline")}
        </strong>
      </div>
    </div>
  );
};

export default Header;
