import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LevelData {
	levelInteger: number;
	percent: number;
	levelWithDecimal: number;
}

export default function PlayerLevel({ username }: { username: string }) {
	const [totalXP, setTotalXP] = useState(0);
	const [levelData, setLevelData] = useState<LevelData>({
		levelInteger: 0,
		percent: 0,
		levelWithDecimal: 0,
	});
	const {t} = useTranslation();
	const getLevelData = (level: number): LevelData => {
		const levelInteger = Math.floor(level);
		const progressDecimal = level - levelInteger;
		const percent = progressDecimal * 100;

		return {
			levelInteger,
			percent,
			levelWithDecimal: level,
		};
	};

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL
					}/api/profile/UserPlayerStats/${username}`,
					{
						credentials: "include",
						method: "GET",
					}
				);

				if (response.ok) {
					const data = await response.json();
					setTotalXP(data.total_xp);
					if (typeof data.level === "number")
						setLevelData(getLevelData(data.level));
				} else {
					console.error("Failed to fetch XP data");
				}
			} catch (error) {
				console.error("Error fetching XP data:", error);
			}
		};
		getData();
	}, [username]);

	return (
		<div className="w-[280px]  mx-auto">
			<div className="w-full rounded-full h-5 shadow-inner overflow-hidden border border-gray-700">
				<motion.div
					className="h-full rounded-full bg-blue-500"
					initial={{ width: 0 }}
					animate={{ width: `${levelData.percent}%` }}
					transition={{ duration: 2, ease: "easeOut" }}
				/>
			</div>
			<motion.p
				className="text-center text-[11px] text-gray-300 mt-2 tracking-wide font-mono"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2 }}
			>
				{t('level')}{" "}
				<span className="text-blue-400 font-semibold">
					{levelData.levelWithDecimal.toFixed(2)}
				</span>
			</motion.p>
		</div>
	);
}
