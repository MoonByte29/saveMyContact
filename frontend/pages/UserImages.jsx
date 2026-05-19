import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function UserImages() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [uploads, setUploads] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchUserUploads();
        }
    }, [userId]);

    const fetchUserUploads = async () => {
        try {
            const res = await API.get(`/upload/user/${userId}`);
            setUploads(res.data.uploads || []);
            setUserInfo(res.data.user || null);
        } catch (err) {
            console.log(err);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleDelete = async (uploadId) => {
        if (!window.confirm("Are you sure you want to delete this upload?")) return;
        try {
            await API.delete(`/upload/${uploadId}`);
            setUploads(uploads.filter(u => u._id !== uploadId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Delete all uploads for this user?")) return;
        try {
            await API.delete(`/upload/user/${userId}`);
            setUploads([]);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">

                {/* Page title + user info */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Images</h1>
                        <p className="text-sm text-slate-500 mt-1">Viewing uploads for a specific user.</p>
                    </div>
                    {userInfo && (
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {uploads.length} upload{uploads.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* USER INFO CARD */}
                {userInfo && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg font-bold flex-shrink-0">
                            {userInfo.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">{userInfo.username}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                ID: {userInfo._id} &middot; {uploads.length} total uploads
                            </p>
                        </div>
                    </div>
                )}

                {/* UPLOADS GRID */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                            Uploaded Images
                        </h2>
                        <div className="flex items-center gap-2">
                            <a
                                href={`/admin/uploads/${userId}/csv`}
                                onClick={(e) => { e.preventDefault(); navigate(`/admin/uploads/${userId}/csv`); }}
                                className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download Latest CSV
                            </a>
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Clear All Uploads
                            </button>
                        </div>
                    </div>

                    {uploads.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <p className="text-sm">No uploads found for this user.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {uploads.map((upload) => (
                                <div
                                    key={upload._id}
                                    className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={upload.imageUrls?.[0] || "https://placehold.co/600x400?text=No+Image"}
                                        alt={upload.originalName}
                                        className="w-full h-48 object-cover bg-slate-100"
                                    />
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-800 break-all leading-snug">
                                                {upload.originalName}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(upload.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            {upload.totalNumbers} phone numbers
                                        </span>
                                        <div className="flex gap-2 pt-1">
                                            <a
                                                href={`http://localhost:5000/csv/${upload.filename}.csv`}
                                                download
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                                CSV
                                            </a>
                                            <button
                                                onClick={() => handleDelete(upload._id)}
                                                className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

export default UserImages;