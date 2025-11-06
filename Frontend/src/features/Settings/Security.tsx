import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface PasswordBody {
	oldpassowrd?: string;
	password?: string;
	confirmpassword?: string;
	twoFA?: boolean;
}

export default function Security() {
	const { t } = useTranslation();
	const store = useStore();
	const oldpassowrd: any = useRef("");
	const password: any = useRef("");
	const confirmpassword: any = useRef("");
	const [twofavalue, settwofavalue] = useState(store.twofa);
	const [erros, seterros] = useState<{ [key: string]: string }>({});
	const body: PasswordBody = {
		oldpassowrd: undefined,
		password: undefined,
		confirmpassword: undefined,
		twoFA: undefined,
	};

	const Fecthdata = async (e: any) => {
		e.preventDefault();
		const passwordvalues = [
			oldpassowrd.current.value,
			password.current.value,
			confirmpassword.current.value,
		];
		if (
			oldpassowrd.current.value ||
			password.current.value ||
			confirmpassword.current.value
		) {
			body.oldpassowrd = oldpassowrd.current.value;
			body.password = password.current.value;
			body.confirmpassword = confirmpassword.current.value;
		}
		if (twofavalue !== store.twofa) {
			body.twoFA = twofavalue;
			store.setTwoFA(twofavalue);
		}
		if (
			body.oldpassowrd ||
			body.password ||
			body.confirmpassword ||
			body.twoFA !== undefined
		) {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/settings/security`,
				{
					// const response = await fetch("${import.meta.env.VITE_API_URL}/api/settings/security", {
					credentials: "include",
					method: "PUT",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify(body),
				}
			);
			if (!response.ok) {
				const f = await response.json() as { message: string, type: string, errorexplain: boolean };
				if (f.errorexplain) {
					seterros({ [f.type]: f.message });
					toast.error(`${f.message}`);
				} else {
					seterros({ [f.type]: t(`${f.type}_error`) });
					toast.error(t(`${f.type}_error`));
				}
				return;
			}
		}
		toast.success(t('securitySettingsUpdated'));
	};
	const inputClass = (fieldName: string) => {
		const baseStyle = "w-full border bg-[#222831]  p-3 rounded-[10px] outline-none";
		const errorStyle = "border-red-500 placeholder-red-500 text-red-500";
		const normalStyle = "border-black placeholder-white text-white";

		return `${baseStyle} ${erros[fieldName] ? errorStyle : normalStyle}`;
	};

	const clearError = (fieldName: string) => {
		seterros((prev) => {
			const updated = { ...prev };
			delete updated[fieldName];
			return updated;
		});
	};
	return (
		<>
			<div className="mt-20 flex justify-center  w-full max-w-[1100px] font-russo">
				<div className="flex flex-col space-y-10">
					<input type="password" placeholder={t('currentPassword')} className={inputClass('oldpassowrd')} ref={oldpassowrd} onFocus={() => clearError('oldpassowrd')} />
					<input type="password" placeholder={t('newPassword')} className={inputClass('password')} ref={password} onFocus={() => clearError('password')} />
					<input type="password" placeholder={t('passwordConfirmation')} className={inputClass('confirmpassword')} ref={confirmpassword} onFocus={() => clearError('confirmpassword')} />
					<div className="flex flex-row space-x-2">
						<h1 className="text-white">{t('twoFactorAuth')}</h1>
						<label className="relative inline-flex items-center cursor-pointer outline-none">
							<input type="checkbox" checked={twofavalue} onChange={(e) => settwofavalue(e.target.checked)} className="sr-only peer" />
							<div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-all" />
							<div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-full transition-all" />
						</label>
					</div>
					<button className="w-full border text-white border-transparent bg-blue-600 rounded-[10px] hover:text-[#0077FF] hover:bg-transparent hover:border-[#0077FF] transition p-2" onClick={Fecthdata}>
						{t('save')}
					</button>
				</div>
			</div>
		</>
	);
}
