"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const user = { 
                username: username,
                password: password
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem("token", data.token);
                router.push("/adminpage");
            } else {
                setError(data.message || "Invalid username or password");
            }
        }finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4 py-8 sm:p-4">
            {/* Logo */}
            <Link href="/" className="absolute top-4 sm:top-8 left-4 sm:left-8">
                <div className="bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl">
                    <h3 className="text-white font-bold text-lg sm:text-xl">ALMAZ STORE</h3>
                </div>
            </Link>

            {/* Login Form */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Please sign in to your account</p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            ref={usernameRef}
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}