// src/features/Game/PingPong/Tournaments/TournamentPong.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Tile: React.FC<{ title: string; to: string; emoji: string }> = ({ title, to, emoji }) => (
  <Link
    to={to}
    className="rounded-2xl shadow-lg border border-white/10 bg-[#2b2f36] p-6 hover:bg-[#343945] transition block"
  >
    <div className="text-4xl mb-3">{emoji}</div>
    <div className="text-xl font-semibold text-white">{title}</div>
  </Link>
);

const TournamentPong: React.FC = () => {
  const {t} = useTranslation();

  return (
    <div className="min-h-[70vh] w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">🏆 {t("Pong_Tournaments")}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <Tile title={t("Create_a_Tournament")} emoji="➕" to="tournament-create" />
        <Tile title={t("Join_a_Tournament")} emoji="🎮" to="tournament-join" />
      </div>
    </div>
  );
};

export default TournamentPong;
