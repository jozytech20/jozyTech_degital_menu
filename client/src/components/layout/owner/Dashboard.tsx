// src/pages/owner/Dashboard.tsx
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Loader2, FolderTree, UtensilsCrossed, CheckCircle2, Star, TrendingUp, Activity } from "lucide-react";
import type { OwnerVenue } from "@/types/ownerVenue";
import type { OwnerCategory } from "@/types/category";
import type { OwnerMenuItem } from "@/types/menuItems";
import api from "@/lib/api";

/* ── brand palette (matching sidebar oklch tokens) ── */
const BRAND = {
    deep: "oklch(0.25 0.08 250)",
    mid: "oklch(0.35 0.08 250)",
    accent: "oklch(0.50 0.10 250)",
    bright: "oklch(0.65 0.15 250)",
    pale: "oklch(0.92 0.03 250)",
    surface: "oklch(0.97 0.01 250)",
};

const CHART_COLORS = [
    "oklch(0.55 0.15 250)",
    "oklch(0.60 0.14 280)",
    "oklch(0.58 0.16 200)",
    "oklch(0.65 0.12 310)",
    "oklch(0.50 0.10 220)",
    "oklch(0.62 0.13 160)",
];

const AVAILABILITY_COLORS = ["oklch(0.60 0.17 155)", "oklch(0.75 0.04 250)"];

function Dashboard() {
    const [venue, setVenue] = useState<OwnerVenue | null>(null);
    const [categories, setCategories] = useState<OwnerCategory[]>([]);
    const [items, setItems] = useState<OwnerMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [venueRes, categoriesRes, itemsRes] = await Promise.all([
                    api.get<{ data: OwnerVenue }>("/owner/venue"),
                    api.get<{ data: OwnerCategory[] }>("/owner/categories"),
                    api.get<{ data: OwnerMenuItem[] }>("/owner/menu-items"),
                ]);
                setVenue(venueRes.data.data);
                setCategories(categoriesRes.data.data);
                setItems(itemsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
                    style={{ background: BRAND.pale }}
                >
                    <Loader2 className="size-6 animate-spin" style={{ color: BRAND.bright }} />
                </div>
                <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
            </div>
        );
    }

    const totalCategories = categories.length;
    const totalItems = items.length;
    const availableCount = items.filter((i) => i.isAvailable).length;
    const unavailableCount = totalItems - availableCount;
    const featuredCount = items.filter((i) => i.isFeatured).length;
    const availabilityPct = totalItems > 0 ? Math.round((availableCount / totalItems) * 100) : 0;

    const itemsPerCategory = categories.map((c) => ({
        name: c.name,
        items: items.filter((i) => i.categoryId === c._id).length,
    }));

    const availabilityData = [
        { name: "Available", value: availableCount },
        { name: "Unavailable", value: unavailableCount },
    ];

    const statCards = [
        {
            label: "Total Categories",
            value: totalCategories,
            icon: FolderTree,
            gradient: `linear-gradient(135deg, oklch(0.55 0.15 250), oklch(0.45 0.12 260))`,
            iconBg: "oklch(0.50 0.13 255)",
        },
        {
            label: "Total Menu Items",
            value: totalItems,
            icon: UtensilsCrossed,
            gradient: `linear-gradient(135deg, oklch(0.55 0.16 280), oklch(0.45 0.13 290))`,
            iconBg: "oklch(0.50 0.14 285)",
        },
        {
            label: "Available Items",
            value: availableCount,
            icon: CheckCircle2,
            gradient: `linear-gradient(135deg, oklch(0.55 0.16 155), oklch(0.45 0.13 165))`,
            iconBg: "oklch(0.50 0.14 160)",
            badge: `${availabilityPct}%`,
        },
        {
            label: "Featured Items",
            value: featuredCount,
            icon: Star,
            gradient: `linear-gradient(135deg, oklch(0.65 0.16 80), oklch(0.55 0.14 70))`,
            iconBg: "oklch(0.60 0.15 75)",
        },
    ];

    /* ── custom tooltip for charts ── */
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        return (
            <div
                className="rounded-lg px-3 py-2 text-sm shadow-lg border"
                style={{
                    background: "oklch(0.98 0.005 250)",
                    borderColor: "oklch(0.90 0.02 250)",
                }}
            >
                <p className="font-semibold text-gray-800">{label ?? payload[0].name}</p>
                <p style={{ color: BRAND.bright }} className="font-bold">
                    {payload[0].value} {payload[0].value === 1 ? "item" : "items"}
                </p>
            </div>
        );
    };

    return (
        <div
            className="space-y-6 sm:p-6 max-w-7xl mx-auto min-h-screen"
            style={{ background: BRAND.surface }}
        >
            {/* ── Header ── */}
            <div
                className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${BRAND.deep}, oklch(0.30 0.10 260))`,
                }}
            >
                {/* decorative shapes */}
                <div
                    className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.08]"
                    style={{ background: BRAND.bright }}
                />
                <div
                    className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.06]"
                    style={{ background: BRAND.accent }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: BRAND.mid }}
                            >
                                <Activity className="size-5 text-white/80" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    {venue?.name}
                                </h1>
                                <p className="text-white/50 text-sm">Venue Dashboard</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm transition-all ${venue?.status === "active"
                                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
                                    : "bg-white/10 text-white/60 ring-1 ring-white/20"
                                }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${venue?.status === "active"
                                        ? "bg-emerald-400 animate-pulse"
                                        : "bg-white/40"
                                    }`}
                            />
                            {venue?.status === "active" ? "Active" : "Paused"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div
                        key={stat.label}
                        className="group relative rounded-2xl p-5 text-white overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            background: stat.gradient,
                            animationDelay: `${idx * 80}ms`,
                        }}
                    >
                        {/* shimmer on hover */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300" />

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                                    {stat.badge && (
                                        <span className="text-xs font-semibold text-white/50 pb-1">
                                            ({stat.badge})
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: "rgba(255,255,255,0.15)" }}
                            >
                                <stat.icon className="size-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar chart */}
                <div
                    className="rounded-2xl p-6 border transition-shadow duration-300 hover:shadow-lg"
                    style={{
                        background: "white",
                        borderColor: "oklch(0.92 0.01 250)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: BRAND.pale }}
                            >
                                <TrendingUp className="size-4" style={{ color: BRAND.bright }} />
                            </div>
                            <h2 className="font-semibold text-gray-900">Items per Category</h2>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            {totalCategories} categories
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={itemsPerCategory} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.93 0 0)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "oklch(0.50 0 0)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: "oklch(0.55 0 0)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.96 0.01 250)" }} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(0.60 0.15 250)" />
                                    <stop offset="100%" stopColor="oklch(0.45 0.12 260)" />
                                </linearGradient>
                            </defs>
                            <Bar dataKey="items" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                                {itemsPerCategory.map((_, index) => (
                                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div
                    className="rounded-2xl p-6 border transition-shadow duration-300 hover:shadow-lg"
                    style={{
                        background: "white",
                        borderColor: "oklch(0.92 0.01 250)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: "oklch(0.93 0.04 155)" }}
                            >
                                <CheckCircle2 className="size-4" style={{ color: "oklch(0.55 0.16 155)" }} />
                            </div>
                            <h2 className="font-semibold text-gray-900">Availability</h2>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            {availabilityPct}% available
                        </span>
                    </div>
                    <div className="relative">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={availabilityData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={72}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    strokeWidth={0}
                                >
                                    {availabilityData.map((_, index) => (
                                        <Cell key={index} fill={AVAILABILITY_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "13px", color: "oklch(0.50 0 0)" }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* centre label */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                            style={{ marginBottom: 24 }}
                        >
                            <span
                                className="text-4xl font-bold"
                                style={{ color: BRAND.deep }}
                            >
                                {totalItems}
                            </span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                total items
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick glance footer ── */}
            <div
                className="rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
                style={{
                    background: "white",
                    borderColor: "oklch(0.92 0.01 250)",
                }}
            >
                <p className="text-sm font-medium text-gray-400 shrink-0">Quick glance</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {[
                        { label: "Venue slug", value: venue?.slug },
                        { label: "Email", value: venue?.email },
                        { label: "Phone", value: venue?.phone },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{item.label}:</span>
                            <span className="text-sm font-medium text-gray-700">{item.value || "—"}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;