import { useTranslation } from "react-i18next";

export default function GoogleSign() {
	const { t } = useTranslation();
	const sendData = async () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/api/login/google`;
	};

	return (
		<>
			<div className="w-full px-4 sm:px-10 md:px-20 lg:px-0 lg:w-80 mx-auto">
				<button type="button" className="flex flex-row justify-center w-full space-x-1  pt-4 pb-4 border border-black rounded-[10px] hover:shadow-[0px_0px_8px_rgba(0,0,0,0.4)]" onClick={sendData}>
					<svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
						<path fill="#4285F4" d="M533.5 278.4c0-18.4-1.5-36-4.6-53.3H272.1v100.9h146.5c-6.3 33.6-25.6 62-54.8 81.1v67.3h88.5c51.8-47.7 81.2-118 81.2-196z" />
						<path fill="#34A853" d="M272.1 544.3c73.6 0 135.5-24.4 180.7-66.1l-88.5-67.3c-24.6 16.5-56.1 26.3-92.2 26.3-70.8 0-130.8-47.9-152.4-112.3H29.7v70.6c45.1 88.6 137 148.8 242.4 148.8z" />
						<path fill="#FBBC05" d="M119.7 322.9c-11.7-34.5-11.7-71.9 0-106.4V146H29.7c-38.2 74.5-38.2 162.7 0 237.2l90-60.3z" />
						<path fill="#EA4335" d="M272.1 107.7c39.9-.6 78.3 14.2 107.5 40.9l80.4-80.4C405.5 24.9 342.6 0 272.1 0 167 0 75 60.2 29.7 148.8l90 60.3c21.4-64.4 81.4-112.3 152.4-101.4z" />
					</svg>
					<span className="font-russo  text-black">{t("loginWithGoogle")}</span>
				</button>
			</div>
		</>
	);
}
