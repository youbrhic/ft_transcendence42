import { StateCreator } from "zustand";

export type userinfo = {
	id: number;
	username: string;
	display_name: string;
	first_name: string;
	family_name: string;
	email: string;
	Language: string;
	image_url: string;
	cover_url: string;
	hasFetchedUser: boolean;
	twofa: boolean;
	hasspassword: boolean;

	setid: (newid: number) => void;
	setusername: (newusername: string) => void;
	setfirst_name: (newfirst_name: string) => void;
	setfamily_name: (newfamily_name: string) => void;
	setLanguage: (newLanguage: string) => void;
	setUserinfo: (
		newusername: string,
		newdisplay_name: string,
		newfirst_name: string,
		newfamily_name: string,
		newLanguage: string
	) => void;
	setimage_url: (newimage_url: string) => void;
	setcover_url: (newcover_url: string) => void;
	fetchUserInfo: () => Promise<void>;
	setTwoFA: (TwoFA: boolean) => void;
};

export const createUserSlice: StateCreator<userinfo> = (set) => ({
	id: -1,
	username: "",
	first_name: "",
	family_name: "",
	email: "",
	Language: "",
	image_url: "",
	cover_url: "",
	hasFetchedUser: false,
	twofa: false,

	setid: (newid) => set({ id: newid }),
	setusername: (newusername) => set({ username: newusername }),
	setfirst_name: (newfirst_name) => set({ first_name: newfirst_name }),
	setfamily_name: (newfamily_name) => set({ family_name: newfamily_name }),
	setLanguage: (newLanguage) => set({ Language: newLanguage }),
	setUserinfo: (newusername, newdisplay_name, newfirst_name, newfamily_name, newLanguage) =>
		set({
			username: newusername,
			display_name: newdisplay_name,
			first_name: newfirst_name,
			family_name: newfamily_name,
			Language: newLanguage,
		}),
	setimage_url: (newimage_url) => set({ image_url: newimage_url }),
	setcover_url: (newcover_url) => set({ cover_url: newcover_url }),
	setTwoFA: (TwoFA) => set({ twofa: TwoFA }),
	fetchUserInfo: async () => {
		try {
			const respone = (await fetch(
				`${import.meta.env.VITE_API_URL}/api/userinfo`,
				{
					credentials: "include",
				}
			).then((e) => e.json())) as { userinfo: boolean; data: userinfo };

			if (!respone.userinfo) throw new Error("cannot fetch");

			set({
				id: respone.data.id,
				username: respone.data.username,
				display_name: respone.data.display_name,
				first_name: respone.data.first_name,
				family_name: respone.data.family_name,
				email: respone.data.email,
				Language: respone.data.Language,
				image_url: respone.data.image_url,
				cover_url: respone.data.cover_url,
				twofa: respone.data.twofa,
				hasspassword: respone.data.hasspassword
			});
			set({ hasFetchedUser: true });
		} catch (error) {
			console.error("Failed to fetch user info:", error);
			set({ hasFetchedUser: false });
		}
	},
});
