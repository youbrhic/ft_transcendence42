import { Link, Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";

export default function Settings() {
	const { t } = useTranslation();
	const store = useStore();

	return (
		//Russo One
		<div className="2xl:pt-20 flex justify-center px-4 sm:px-6">
			<div className="bg-[#393E46] rounded-[20px] w-full max-w-[1105px] min-h-[1020px]" style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)" }}>
				<div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-lg sm:text-2xl font-russo p-4 text-white">
					<NavLink to="/settings/profile" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"}>
						{" "}
						{t("profile")}{" "}
					</NavLink>
					<NavLink to="/settings/game" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"}>
						{t("game")}
					</NavLink>
					{store.hasspassword && <NavLink to="/settings/security" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"}>
						{t("security")}
					</NavLink>}
				</div>
				<Outlet />
			</div>
		</div>
	);
}
