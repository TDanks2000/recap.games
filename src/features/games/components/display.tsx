import type { PaginationOptions } from "@/@types";
import { api } from "@/trpc/server";
import GameCard from "./cards/game";

type GamesDisplayProps = PaginationOptions;

const GamesDisplay = async (options: GamesDisplayProps) => {
	const data = await api.game.getAll();

	return (
		<div className="flex flex-col gap-4">
			{/* Header Section */}
			<div className="flex flex-col items-start justify-between gap-3">
				<h3 className="font-semibold text-xl tracking-tighter sm:text-2xl">
					Games
				</h3>
			</div>

			{/* Games Grid */}
			<div className="flex-1">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{data?.length > 0
						? data.map((game) => <GameCard key={game.id} {...game} />)
						: "No games found."}
				</div>
			</div>

			{/* Pagination Section */}
			{/* <div className="flex justify-end py-4"> */}
			{/* <Pagination totalResults={total} current={page} pageSize={20} /> */}
			{/* </div> */}
		</div>
	);
};

export default GamesDisplay;
