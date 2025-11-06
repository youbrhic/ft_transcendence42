import { Pie } from "react-chartjs-2"; // changed import from Doughnut to Pie
import { useTranslation } from "react-i18next";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
} from "chart.js";
import { useEffect, useState } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

type game_state = {
	win: number;
	lose: number;
	draw: number;
	rank?: number;
};

const Gamestatenormal = ({ win, lose, draw, rank }: game_state) => {
	const { t } = useTranslation();
	return (
		<>
			<div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 2xl:gap-[220px] w-full ove">
				<div className="flex flex-col w-[100px] h-[57px] border border-[#393E46] bg-[#393E46] rounded-[15px] items-center text-green-600">
					<h1>{t('wins')}</h1>
					<h1>{win}</h1>
				</div>
				<div className="flex flex-col w-[100px] h-[57px] border border-[#393E46] bg-[#393E46] rounded-[15px] items-center text-red-600">
					<h1>{t('loses')}</h1>
					<h1>{lose}</h1>
				</div>
				<div className="flex flex-col w-[100px] h-[57px] border border-[#393E46] bg-[#393E46] rounded-[15px] items-center text-blue-500">
					<h1>{t('draws')}</h1>
					<h1>{draw}</h1>
				</div>
				<div className="flex flex-col w-[100px] h-[57px] border border-[#393E46] bg-[#393E46] rounded-[15px] items-center text-yellow-300">
					<h1>{t('matches')}</h1>
					<h1>{win + lose + draw}</h1>
				</div>
				<div className="flex flex-col w-[100px] h-[57px] border border-[#393E46] bg-[#393E46] rounded-[15px] items-center text-[#00E1E4]">
					<h1>{t('rank')}</h1>
					<h1>{rank}</h1>
				</div>
			</div>
		</>
	);
};
const GamestatePie = ({ win, lose, draw }: game_state) => {
	const { t } = useTranslation();

	const data: ChartData<"pie", number[], string> = {
		labels: [`${t('wins')}`, `${t('loses')}`, `${t('draws')}`],
		datasets: [
			{
				data: [win, lose, draw],
				backgroundColor: [
					"rgba(21, 128, 61, 1)",  // normal green
					"rgba(185, 28, 28, 1)",  // normal red
					"rgba(59, 130, 246, 0.8)", // normal blue
				],
				borderColor: "rgba(0, 0, 0, 0.4)",
				borderWidth: 2
			},
		],
	};

	const options: ChartOptions<"pie"> = {
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			easing: "easeOutBack",
			duration: 1000,
		},
		hover: {
			mode: 'none',  // Disable all hover interactions
		},
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					color: "#E0E0E0", // softer white
					font: {
						size: 16,
						family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
						weight: "600",
					},
					padding: 20,
				},
			},
			tooltip: {
				backgroundColor: "rgba(0, 0, 0, 0.75)",
				titleFont: {
					size: 16,
					weight: "700",
				},
				bodyFont: {
					size: 14,
				},
				padding: 10,
				callbacks: {
					label: function (context) {
						const data = context.dataset.data as number[];
						const total = data.reduce(
							(sum, val) => sum + (typeof val === "number" ? val : 0),
							0
						);
						const value = context.raw as number;
						const percentage =
							total > 0 ? ((value / total) * 100).toFixed(2) : 0;
						return `${context.label}: ${percentage}% (${value})`;
					},
				},
			},
		},
	};

	return (
		<div className="w-full p-7 space-y-0 rounded-xl ">
			<h2 className="text-center text-xl font-bold text-white mb-10 font-russo tracking-wide drop-shadow-md">
				{t('game_results_overview')}
			</h2>
			<div className="h-[250px] md:h-[350px] lg:h-[370px]">
				<Pie data={data} options={options} />
			</div>
		</div>
	);
};

export default function GameStats({
	type,
	username,
}: {
	type: string;
	username: string;
}) {
	const [GameSates, setGameSates] = useState<game_state>({
		win: 0,
		lose: 0,
		draw: 0,
	});
	const [rank, setRank] = useState(0);
	useEffect(() => {
		const getGameSate = async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/profile/GameStats/${username}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (response.ok) {
				const GameSate = (await response.json()) as {
					gamestate: game_state;
					rank: number;
				};
				setGameSates(GameSate.gamestate);
				setRank(GameSate.rank);
			} else {
				console.error("###### :  problem");
			}
		};
		getGameSate();
	}, [username]);

	const wins = GameSates?.win;
	const losses = GameSates?.lose;
	const draws = GameSates?.draw;

	return type === "Doughnut" ? (
		<GamestatePie win={wins} lose={losses} draw={draws} />
	) : (
		<Gamestatenormal win={wins} lose={losses} draw={draws} rank={rank} />
	);
}
