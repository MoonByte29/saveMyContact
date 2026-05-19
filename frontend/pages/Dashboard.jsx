import { useRef, useState } from "react";
import API from "../services/api";


function Dashboard() {
    const [images, setImages] = useState([]);
    const [prefix, setPrefix] = useState("");
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [csvFile, setCsvFile] = useState("");
    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (images.length === 0) {
            alert("Please select at least one image.");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
            formData.append("prefix", prefix);

            const res = await API.post("/upload", formData);
            setContacts(res.data.contacts);

            setCsvFile(res.data.csvFile);
            // CLEAR UPLOAD AREA
            setImages([]);

            setPrefix("");

            setIsDragging(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || error.message || "Upload Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setImages(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* Topbar */}
            {/* <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                        </svg>
                    </div>
                    <span className="text-slate-800 font-semibold text-sm tracking-tight">ContactScan</span>
                </div>
                <div className="flex items-center gap-4">

                    <button
                        onClick={() => window.location.href = "/admin"}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                        Admin Panel
                    </button>

                    <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                        Dashboard
                    </span>

                </div>            </header> */}

            <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">

                {/* Page title */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Extract Contacts</h1>
                    <p className="text-sm text-slate-500 mt-1">Upload business card images to extract contact details automatically.</p>
                </div>

                {/* Upload card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

                    {/* Prefix input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                            Contact Prefix
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Dr., Mr., Ms."
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                    </div>

                    {/* File drop zone */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                            Images
                        </label>
                        <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl px-6 py-10 cursor-pointer transition-all duration-200
                                ${isDragging
                                    ? "border-teal-400 bg-teal-50"
                                    : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50"
                                }`}
                        >
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-700">
                                    Drop images here or <span className="text-teal-600">browse</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP supported</p>
                            </div>
                            {images.length > 0 && (
                                <div className="flex items-center gap-1.5 bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                    {images.length} file{images.length > 1 ? "s" : ""} selected
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImages(e.target.files)}
                            />
                        </label>
                    </div>

                    {/* Upload button */}
                    <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-3 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Extracting contacts...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Upload & Extract
                            </>
                        )}
                    </button>
                </div>
                {contacts.length > 0 && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                        Successfully extracted {contacts.length} phone numbers!
                    </div>
                )}

                {/* Contacts results */}
                {contacts.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-800">Extracted Contacts</h2>
                            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {contacts.length} found
                            </span>
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {contacts.map((contact, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-semibold flex-shrink-0">
                                            {contact.name?.charAt(0) ?? "?"}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800">{contact.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        {contact.phone}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {csvFile && (
                    <div className="flex justify-center">

                        <a
                            href={`http://localhost:5000/csv/${csvFile}`}
                            download
                            className="bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-sm"
                        >
                            Download CSV
                        </a>

                    </div>
                )}

                {/* Empty state */}
                {contacts.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-slate-400">
                        <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <p className="text-sm">No contacts extracted yet.</p>
                        <p className="text-xs mt-1">Upload images above to get started.</p>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Dashboard;