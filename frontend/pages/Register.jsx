import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            username: "",
            password: "",
            role: "user",
        });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            await API.post("/auth/register", formData);

            alert("Registered successfully! Please login.");
            navigate("/");

        } catch (err) {

            const msg =
                err.response?.data?.message || "Registration failed";
            setError(msg);

        } finally {
            setLoading(false);
        }
    };

    return (

        <div style={{ padding: "50px" }}>

            <h1>Register</h1>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <br /><br />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

            </form>

            <br />
            <p>
                Already have an account?{" "}
                <Link to="/">Login</Link>
            </p>

        </div>
    );
}

export default Register;
