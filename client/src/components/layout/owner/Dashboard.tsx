// src/pages/owner/Dashboard.tsx
import { useEffect, useState } from "react";
// import api from "../../lib/api";
// import type { OwnerVenue } from "../../types/venue";
// import type { OwnerCategory } from "../../types/category";
// import type { OwnerMenuItem } from "../../types/menuItems";
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
import { Loader2, FolderTree, UtensilsCrossed, CheckCircle2, Star } from "lucide-react";
import type { OwnerVenue } from "@/types/ownerVenue";
import type { OwnerCategory } from "@/types/category";
import type { OwnerMenuItem } from "@/types/menuItems";
import api from "@/lib/api";

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
            <div className="flex items-center justify-center py-32">
                <Loader2 className="size-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const totalCategories = categories.length;
    const totalItems = items.length;
    const availableCount = items.filter((i) => i.isAvailable).length;
    const unavailableCount = totalItems - availableCount;
    const featuredCount = items.filter((i) => i.isFeatured).length;

    const itemsPerCategory = categories.map((c) => ({
        name: c.name,
        items: items.filter((i) => i.categoryId === c._id).length,
    }));

    const availabilityData = [
        { name: "Available", value: availableCount },
        { name: "Unavailable", value: unavailableCount },
    ];
    const AVAILABILITY_COLORS = ["#16a34a", "#d1d5db"];

    const statCards = [
        { label: "Total Categories", value: totalCategories, icon: FolderTree, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Menu Items", value: totalItems, icon: UtensilsCrossed, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Available Items", value: availableCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "Featured Items", value: featuredCount, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-6 sm:p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{venue?.name}</h1>
                    <span
                        className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${venue?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {venue?.status === "active" ? "Active" : "Paused"}
                    </span>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                        <div className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                            <stat.icon className={`size-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-gray-900 mb-4">Items per Category</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={itemsPerCategory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="items" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-gray-900 mb-4">Availability</h2>
                    <div className="relative">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={availabilityData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                    outerRadius={100}
                                >
                                    {availabilityData.map((_, index) => (
                                        <Cell key={index} fill={AVAILABILITY_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: 24 }}>
                            <span className="text-4xl font-bold text-gray-900">{totalItems}</span>
                            <span className="text-sm text-gray-500">total items</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;