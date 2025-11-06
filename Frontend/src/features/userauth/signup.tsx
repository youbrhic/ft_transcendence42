import { Link } from "react-router";
import { useRef, useState } from "react";
import GoogleSign from "./googlesign";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function Signup() {
	const username: any = useRef(null);
	const email: any = useRef(null);
	const password: any = useRef(null);
	const confirmpassword: any = useRef(null);
	const first_name: any = useRef(null);
	const family_name: any = useRef(null);
	const [erros, seterros] = useState<{ [key: string]: string }>({});
	const nav = useNavigate()
	const { t } = useTranslation();
	const cleanUpString = (input: any) => {
		return input.trim().replace(/\s+/g, ' ');
	}
	const ErroNotify = (error: string) => toast.error(`${error}`);
	const senddata = async (e?: React.MouseEvent<HTMLButtonElement>) => {
		e?.preventDefault();
		try {
			const body = {
				username: cleanUpString(username.current?.value) || "",
				email: cleanUpString(email.current?.value) || "",
				password: password.current?.value || "",
				confirmpassword: confirmpassword.current?.value || "",
				first_name: cleanUpString(first_name.current?.value) || "",
				family_name: cleanUpString(family_name.current?.value) || "",
			};
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/login/signup`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				}
			);
			const data = await response.json();
			if (!response.ok || data.statusCode === 400) {
				seterros({ [data.type]: data.TypeError ? t(`${data.TypeError}`) : t(`${data.type}_error`) });
			} else {
				toast.success(t('successAccountCreated'));
				nav('/login/Signin')
			}
		} catch (err: any) {
			ErroNotify(err);
		}
	};
	const inputClass = (fieldName: any) => {
		const defaultSytle =
			"placeholder-black w-full mb-4 p-3 sm:p-4 border  rounded-[10px] hover:scale-105 transition-transform";
		const errorBorder = "border-red-500";
		const normalBorder = "border-black";

		return `${defaultSytle} ${erros[fieldName] ? errorBorder : normalBorder}`;
	};
	const writeError = (fieldName: any) => {
		if (!erros[fieldName]) return null;
		return (
			<>
				<p className="text-red-500 text-xs">{erros[fieldName]}</p>
				<br />
			</>
		);
	};
	const clearError = (fieldName: string) => {
		seterros((prev) => {
			const updated = { ...prev };
			delete updated[fieldName];
			return updated;
		});
	};
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>,
		nextRef: React.RefObject<HTMLInputElement> | null
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (nextRef && nextRef.current) {
				nextRef.current.focus();
			} else {
				senddata();
			}
		}
	};
	return (
		<>
			<h1 className="font-russo text-3xl sm:text-4xl md:text-5xl text-[#222831] text-center sm:text-left">
				{t('register')}
			</h1>
			<br />
			<GoogleSign />
			<div className="flex items-center justify-center my-6">
				<div className="w-8 sm:w-10 md:w-14 lg:w-16 h-px bg-black"></div>
				<h1 className="mx-2 text-black text-base sm:text-lg md:text-xl lg:text-2xl font-medium">
					{t('orText')}
				</h1>
				<div className="w-8 sm:w-10 md:w-14 lg:w-16 h-px bg-black"></div>
			</div>
			<div className="w-full px-4 sm:px-10 md:px-20 lg:px-0 lg:w-80 mx-auto">
				<div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
					<input type="text" placeholder={t('firstNamePlaceholder')} className={inputClass("first_name")} ref={first_name} onFocus={() => clearError("first_name")} onKeyDown={(e) => handleKeyDown(e, family_name)} />
					<input type="text" placeholder={t('familyNamePlaceholder')} className={inputClass("family_name")} ref={family_name} onFocus={() => clearError("family_name")} onKeyDown={(e) => handleKeyDown(e, username)} />
				</div>
				{writeError("first_name")} {writeError("family_name")}
				<input type="text" placeholder={t('usernamePlaceholder')} className={inputClass("username")} ref={username} onFocus={() => clearError("username")} onKeyDown={(e) => handleKeyDown(e, email)} />{" "}
				{writeError("username")}
				<input type="text" placeholder={t('emailPlaceholder')} className={inputClass("email")} ref={email} onFocus={() => clearError("email")} onKeyDown={(e) => handleKeyDown(e, password)} />{" "}
				{writeError("email")}
				<input type="password" placeholder={t('passwordPlaceholder')} className={inputClass("password")} ref={password} onFocus={() => clearError("password")} onKeyDown={(e) => handleKeyDown(e, confirmpassword)} />{" "}
				{writeError("password")}
				<input type="password" placeholder={t('confirmPasswordPlaceholder')} className={inputClass("confirmpassword")} ref={confirmpassword} onFocus={() => clearError("confirmpassword")} onKeyDown={(e) => handleKeyDown(e, null)} />{" "}
				{writeError("confirmpassword")}
				<button className="font-russo w-full bg-blue-500 text-white py-2 sm:py-3 md:py-4 rounded-[10px] mb-4 hover:shadow-[0px_0px_8px_rgba(0,0,0,0.4)] transition-all" onClick={senddata}>
					{t('register')}
				</button>
				<div className="text-center text-xs sm:text-sm">
					<span>{t('already_have_account')} </span>
					<Link className="text-blue-600 underline" to="/login/Signin">
						{t('loginTitle')}
					</Link>
				</div>
			</div>
		</>
	);
}
