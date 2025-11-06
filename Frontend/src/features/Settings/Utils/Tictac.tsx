import { useEffect, useState } from "react";

import { Square_Costume } from "../../Game/Tic-Tac/Local/Componant/Square";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface TictacProps {
	sendTicTacData: (e: React.FormEvent) => Promise<void>;
}

const TicTac: React.FC = () => {
	const [xColor, setXColor] = useState("#FF0000");
	const [oColor, setOColor] = useState("#0000FF");
	const [gridColor, setGridColor] = useState("#EEEEEE");
	const [boardColor, setBoardColor] = useState("#EEEEEE");
	const [squares, setSquares] = useState<(string | null)[]>(
		Array(9).fill(null)
	);
	const [xisNext, setXisNext] = useState<boolean>(true);
	const {t} = useTranslation();
	useEffect(() => {
		const setTicTacInfo = async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/settings/tictacinfo`,
				{
					credentials: "include",
				}
			);
			if (response.ok) {
				const data = (await response.json()) as {
					x_color: string;
					o_color: string;
					grid_color: string;
					board_color: string;
				};
				setXColor(data.x_color || "#FF0000");
				setOColor(data.o_color || "#0000FF");
				setGridColor(data.grid_color || "#EEEEEE");
				setBoardColor(data.board_color || "#EEEEEE");
			}
		};
		setTicTacInfo();
	}, []);

	const sendTicTacData = async (e: any) => {
		e.preventDefault();
		const body = {
			x_color: xColor,
			o_color: oColor,
			grid_color: gridColor,
			board_color: boardColor,
		};
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/settings/tictac`,
			{
				method: "PUT",
				credentials: "include",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify(body),
			}
		);
		if (response.ok) {
			toast.success(t('tictacSettingsUpdated'));
		} else {
			toast.error(t('tictacSettingsError'));
		}
	};
	const resetTicTacDefault = async (e: any) => {
		e.preventDefault();
		setXColor("#FF0000");
		setOColor("#0000FF");
		setBoardColor("#EEEEEE");
		setGridColor("#EEEEEE");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-start pl-12">
				<h1 className="text-white">{t('preview')}</h1>
			</div>
			<div className="flex flex-col items-center">
				<div className="mb-4 text-white">{status}</div>
				<div
					className="p-6 rounded-2xl grid grid-cols-3 gap-4 w-72 sm:w-96"
					style={{ backgroundColor: boardColor }}
				>
					{squares.map((square, i) => (
						<Square_Costume
							key={i}
							value={square}
							onClick={() => {
								const newSquares = [...squares];
								if (!newSquares[i]) {
									newSquares[i] = xisNext ? "X" : "O";
									setSquares(newSquares);
									setXisNext(!xisNext);
								}
							}}
							xColor={xColor}
							oColor={oColor}
							gridColor={gridColor}
							boardColor={boardColor}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-2 sm:gap-0 ">
				<div className="flex-1 sm:pl-10 text-white font-semibold">
					<label>{t('xColor')}</label>
				</div>
				<div className="flex-1 sm:pr-10 flex justify-start sm:justify-end">
					<input
						type="color"
						className="w-12 h-10 rounded-lg border-2 border-white cursor-pointer transition-transform hover:scale-110"
						value={xColor}
						onChange={(e) => setXColor(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-2 sm:gap-0">
				<div className="flex-1 sm:pl-10 text-white font-semibold">
					<label>{t('oColor')}</label>
				</div>
				<div className="flex-1 sm:pr-10 flex justify-start sm:justify-end">
					<input
						type="color"
						className="w-12 h-10 rounded-lg border-2 border-white cursor-pointer transition-transform hover:scale-110"
						value={oColor}
						onChange={(e) => setOColor(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-2 sm:gap-0">
				<div className="flex-1 sm:pl-10 text-white font-semibold">
					<label>{t('gridColor')}</label>
				</div>
				<div className="flex-1 sm:pr-10 flex justify-start sm:justify-end">
					<input
						type="color"
						className="w-12 h-10 rounded-lg border-2 border-white cursor-pointer transition-transform hover:scale-110"
						value={gridColor}
						onChange={(e) => setGridColor(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-2 sm:gap-0">
				<div className="flex-1 sm:pl-10 text-white font-semibold">
					<label>{t('boardColor')}</label>
				</div>
				<div className="flex-1 sm:pr-10 flex justify-start sm:justify-end">
					<input
						type="color"
						className="w-12 h-10 rounded-lg border-2 border-white cursor-pointer transition-transform hover:scale-110"
						value={boardColor}
						onChange={(e) => setBoardColor(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row justify-end sm:pr-10 pt-7 pb-3 gap-4 text-white">
				<button
					className="w-full px-5 py-3  sm:w-[201px]  border border-transparent bg-blue-600 rounded-[10px] hover:text-[#0077FF] hover:bg-transparent hover:border-[#0077FF] transition"
					onClick={resetTicTacDefault}
				>
					{t('resetDefault')}
				</button>
				<button
					className=" px-5 py-3  border border-transparent bg-blue-600 rounded-[10px] hover:text-[#0077FF] hover:bg-transparent hover:border-[#0077FF] transition"
					onClick={sendTicTacData}
				>
					{t('save')}
				</button>
			</div>
		</div>
	);
};

export default TicTac;
