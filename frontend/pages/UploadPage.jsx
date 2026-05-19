import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";


function UploadPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            let endpoint = "/admin/uploads";
            if (userId) {
                endpoint = `/upload/user/${userId}`;
            }
            const dataRes = await API.get(endpoint);
            setUploads(dataRes.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this upload?")) return;
        try {
            await API.delete(`/upload/${id}`);
            setUploads(uploads.filter(u => u._id !== id));
        } catch (error) {
            console.log(error);
            alert("Failed to delete upload");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete ALL uploads? This action cannot be undone.")) return;

        try {
            await API.delete("/admin/uploads");
            setUploads([]);
            alert("All uploads deleted successfully.");
        } catch (error) {
            console.log(error);
            alert("Failed to delete all uploads");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">

                {/* Page title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">All Uploads</h1>
                        <p className="text-sm text-slate-500 mt-1">Full history of uploaded business cards.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {uploads.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Clear All
                            </button>
                        )}
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {uploads.length} records
                        </span>
                    </div>
                </div>

                {/* Table card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["#", "User", "Filename", "Upload Time", "Phone Numbers", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {uploads.map((upload, index) => (
                                    <tr
                                        key={upload._id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-semibold flex-shrink-0">
                                                    {(upload.userId?.username || "U").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800">
                                                        {upload.userId?.username || "User"}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        #{upload.userId?._id ? upload.userId._id.slice(-4) : "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[240px]">
                                            {upload.originalName}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            {new Date(upload.createdAt).toISOString().replace("T", " ").substring(0, 19)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                {upload.totalNumbers}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/uploads/${upload.userId?._id}`)}
                                                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                    View
                                                </button>

                                                <a
                                                    href={`http://localhost:5000/csv/${upload.filename}.csv`}
                                                    download
                                                    className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    CSV
                                                </a>

                                                <button
                                                    onClick={() => handleDelete(upload._id)}
                                                    className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty state */}
                        {uploads.length === 0 && (
                            <div className="text-center py-16 text-slate-400">
                                <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                <p className="text-sm">No uploads found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}

export default UploadPage;