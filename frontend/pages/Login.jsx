import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData
            );

            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            alert("Login Successful");

            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center px-4">

            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mb-5">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                            </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">ContactScan</p>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="username"
                                className="block text-xs font-semibold text-slate-500 uppercase tracking-widest"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-slate-500 uppercase tracking-widest"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                            />
                        </div>

                        <div className="flex justify-end">
                            <a
                                href="#"
                                className="text-xs text-teal-600 hover:text-teal-500 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-2.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-slate-400 mt-6">
                        Don't have an account?{" "}
                        <a href="/register" className="text-teal-600 hover:text-teal-500 font-semibold transition-colors">
                            Create one
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;