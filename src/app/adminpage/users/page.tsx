"use client";
import AdminNav from "@/app/components/AdminNav";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";

type User = {
    id: number;
    username: string;
    email?: string;
    role?: string;
    createdAt?: string;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/user/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (response.ok) {
                setUsers(users.filter((user) => user.id !== id));
            } else {
                setError(data.message || "Error deleting user");
            }
        } catch (err) {
            setError("Failed to delete user. Please try again.");
        }
    };

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setError("Failed to load users");
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav>
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                            <p className="text-gray-600 mt-1">Manage system users</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-500 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                Loading users...
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                            <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                                                                <PersonIcon className="text-gray-500" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.username}
                                                            </div>
                                                            {user.email && (
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {user.role || "User"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                    >
                                                        <DeleteRoundedIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminNav>
        </div>
    );
}
