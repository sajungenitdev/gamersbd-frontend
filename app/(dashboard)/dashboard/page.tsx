// app/(dashboard)/dashboard/page.tsx
"use client";
import {
  Gamepad2,
  Trophy,
  Star,
  Users,
  TrendingUp,
  Medal,
} from "lucide-react";
import { useUserAuth } from "../../contexts/UserAuthContext";

export default function DashboardPage() {
  const { user } = useUserAuth();

  const stats = {
    gamesPlayed: 42,
    tournamentsWon: 8,
    achievements: 23,
    friends: 156,
    winRate: 68,
    currentRank: "Gold III",
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {user?.firstName || user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-400 mt-1">
              Ready to level up your gaming experience?
            </p>
          </div>

          {/* Quick Stats Badge */}
          <div className="flex items-center gap-4 bg-black/30 rounded-xl px-4 py-2">
            <div className="text-center">
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-lg font-bold text-green-400">
                {stats.winRate}%
              </p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Games</p>
              <p className="text-lg font-bold text-white">
                {stats.gamesPlayed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>

        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.tournamentsWon}
          </p>
          <p className="text-xs text-gray-500">Completed Orders</p>
        </div>

        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.achievements}</p>
          <p className="text-xs text-gray-500">Pending Orders</p>
        </div>

        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-500">Reviews</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.friends}</p>
          <p className="text-xs text-gray-500">Total Reviews</p>
        </div>

        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Medal className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-500">Rank</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.currentRank}</p>
          <p className="text-xs text-gray-500">Current Rank</p>
        </div>
      </div>
    </div>
  );
}