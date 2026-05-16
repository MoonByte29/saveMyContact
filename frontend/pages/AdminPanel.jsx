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

            const res =
                await API.get("/admin/users");

            setUsers(res.data);

        } catch (error) {
            console.log(error);
        }
    };



    // FETCH STATS
    const fetchStats = async () => {

        try {

            const res =
                await API.get("/admin/stats");

            setStats(res.data);

        } catch (error) {
            console.log(error);
        }
    };



    // FETCH UPLOADS
    const fetchUploads = async () => {

        try {

            const res =
                await API.get("/admin/uploads");

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

            await API.post(
                "/admin/users",
                {
                    username,
                    password,
                    role,
                }
            );

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

        const confirmDelete =
            window.confirm(
                "Delete this user?"
            );

        if (!confirmDelete) return;

        try {

            await API.delete(
                `/admin/users/${id}`
            );

            fetchUsers();
            fetchStats();

        } catch (error) {

            console.log(error);

            alert("Delete failed");
        }
    };




    return (

        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Admin Panel
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Manage users and uploads
                        </p>
                    </div>

                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold">
                        Admin Access
                    </div>
                </div>



                {/* CREATE USER */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <h2 className="text-xl font-semibold text-slate-800 mb-6">
                        Create New User
                    </h2>

                    <form
                        onSubmit={handleCreateUser}
                        className="grid md:grid-cols-4 gap-4"
                    >

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            className="border border-slate-200 rounded-xl px-4 py-3"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className="border border-slate-200 rounded-xl px-4 py-3"
                            required
                        />

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )
                            }
                            className="border border-slate-200 rounded-xl px-4 py-3"
                        >

                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                        </select>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl px-6 py-3"
                        >
                            Create User
                        </button>

                    </form>
                </div>




                {/* STATS */}
                <div className="grid md:grid-cols-4 gap-4">

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

                        <h3 className="text-slate-500 text-sm">
                            Total Users
                        </h3>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {stats.totalUsers || 0}
                        </p>
                    </div>


                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

                        <h3 className="text-slate-500 text-sm">
                            Admin Users
                        </h3>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {stats.adminUsers || 0}
                        </p>
                    </div>


                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

                        <h3 className="text-slate-500 text-sm">
                            Regular Users
                        </h3>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {stats.regularUsers || 0}
                        </p>
                    </div>


                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

                        <h3 className="text-slate-500 text-sm">
                            Total Uploads
                        </h3>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {stats.totalUploads || 0}
                        </p>
                    </div>
                </div>




                {/* USERS TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100">

                        <h2 className="text-xl font-semibold text-slate-800">
                            Users
                        </h2>
                    </div>


                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-4">
                                    Username
                                </th>

                                <th className="text-left px-6 py-4">
                                    Role
                                </th>

                                <th className="text-left px-6 py-4">
                                    Actions
                                </th>

                            </tr>
                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr
                                    key={user._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
                                        {user.username}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.role}
                                    </td>

                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() =>
                                                handleDeleteUser(
                                                    user._id
                                                )
                                            }
                                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




                {/* UPLOADS */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100">

                        <h2 className="text-xl font-semibold text-slate-800">
                            Upload History
                        </h2>
                    </div>


                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-4">
                                    User
                                </th>

                                <th className="text-left px-6 py-4">
                                    File
                                </th>

                                <th className="text-left px-6 py-4">
                                    Contacts
                                </th>

                                <th className="text-left px-6 py-4">
                                    Date
                                </th>

                            </tr>
                        </thead>


                        <tbody>

                            {uploads.map((upload) => (

                                <tr
                                    key={upload._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
                                        {
                                            upload.userId
                                                ?.username
                                        }
                                    </td>

                                    <td className="px-6 py-4">
                                        {
                                            upload.originalName
                                        }
                                    </td>

                                    <td className="px-6 py-4">
                                        {
                                            upload.totalNumbers
                                        }
                                    </td>

                                    <td className="px-6 py-4">
                                        {new Date(
                                            upload.createdAt
                                        ).toLocaleString()}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default AdminPanel;