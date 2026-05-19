import { useEffect, useState } from "react";
import API from "../services/api";

function AdminPanel() {

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [uploads, setUploads] = useState([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");


    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // FETCH STATS
    const fetchStats = async () => {
        try {
            const res = await API.get("/admin/stats");
            setStats(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // FETCH UPLOADS
    const fetchUploads = async () => {
        try {
            const res = await API.get("/admin/uploads");
            setUploads(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // LOAD DATA
    useEffect(() => {
        fetchUsers();
        fetchStats();
        fetchUploads();
    }, []);


    // CREATE USER
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post("/admin/users", { username, password, role });
            alert("User created successfully");
            setUsername("");
            setPassword("");
            setRole("user");
            fetchUsers();
            fetchStats();
        } catch (error) {
            console.log(error);
            alert("Failed to create user");
        }
    };

    // DELETE USER
    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");
        if (!confirmDelete) return;
        try {
            await API.delete(`/admin/users/${id}`);
            fetchUsers();
            fetchStats();
        } catch (error) {
            console.log(error);
            alert("Delete failed");
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">

                {/* Page title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Panel</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage users and monitor uploads.</p>
                    </div>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        Admin Access
                    </span>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Users", value: stats.totalUsers || 0 },
                        { label: "Admin Users", value: stats.adminUsers || 0 },
                        { label: "Regular Users", value: stats.regularUsers || 0 },
                        { label: "Total Uploads", value: stats.totalUploads || 0 },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* CREATE USER */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
                        Create New User
                    </h2>
                    <form onSubmit={handleCreateUser} className="grid md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                            required
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm rounded-lg px-6 py-2.5 transition-all duration-200"
                        >
                            Create User
                        </button>
                    </form>
                </div>

                {/* EXISTING USERS TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-800">Existing Users</h2>
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {users.length} total
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["#", "Username", "Role", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-semibold flex-shrink-0">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${user.role === "admin"
                                                    ? "bg-slate-900 text-white"
                                                    : "bg-teal-100 text-teal-700"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.username === "admin" ? (
                                                <span className="text-xs text-slate-400 italic">Current User</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ADMIN ACTIONS */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
                        Admin Actions
                    </h2>
                    <button
                        onClick={() => window.location.href = "/uploads"}
                        className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                        View All User Uploads
                    </button>
                </div>

            </main>
        </div>
    );
}

export default AdminPanel;