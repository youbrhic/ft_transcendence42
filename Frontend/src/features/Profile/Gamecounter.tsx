import React, { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
	ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Gamecounter({ username }: { username: string }) {
	const [gamescounter, setgamescounter] = useState({ Pong: 0, Tic_Tac: 0 });
	const { t } = useTranslation();

	useEffect(() => {
		const getdata = async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/profile/CountGames/${username}`,
				{
					credentials: "include",
					method: "GET",
				}
			);
			if (response.ok) {
				const data = await response.json();
				setgamescounter({ Pong: data.Pong, Tic_Tac: data.Tic_Tac });
			} else console.error(`the error : ${JSON.stringify(data)}`);
		};
		getdata();
	}, [username]);
	const data = {
		labels: [`${t('game_pong')}`, `${t('game_tictac')}`],
		datasets: [
			{
				label: "Games Played",
				data: [gamescounter.Pong, gamescounter.Tic_Tac], // Replace with dynamic values
				backgroundColor: ["#00ADB5", "#FF6B6B"],
				borderRadius: 0,
				barThickness: 70,
			},
		],
	};
	const options: ChartOptions<"bar"> = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				ticks: {
					color: "#EEEEEE",
					font: {
						size: 16,
						weight: "bold",
					},
				},
				grid: {
					color: "#444",
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: "#EEEEEE",
					stepSize: 1,
					font: {
						size: 14,
					},
				},
				grid: {
					color: "#444"
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: "#222831",
				titleColor: "#00E1E4",
				bodyColor: "#fff",
				bodyFont: {
					size: 14,
				},
			},
		},
	};
	return (
		<div className="p-6 w-full max-w-[500px] h-[300px] md:h-[400px] lg:h-[500px]">
			<h2 className="text-center text-xl font-bold text-white mb-4 font-russo tracking-wide">
				{t('games_played_title')}
			</h2>
			<div className="h-[200px] md:h-[300px] lg:h-[370px]">
				<Bar data={data} options={options} />
			</div>
		</div>
	);
}
