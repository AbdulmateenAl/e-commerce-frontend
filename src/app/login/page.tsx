"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
    const router = useRouter()

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleLogin = async () => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value

        if (username && password) {
            const user = { 
                username: username,
                password: password
            }
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            const data = await response.json()
            if (response.ok) {
                localStorage.setItem("token", data.token)
                console.log("Login successful", data.token)
                router.push("/")
            } else {
                console.error("Login failed", data)
            }
        } else {
            console.error("Username and password are required")
        }
    }
    
    return (
        <div className="flex items-center justify-center bg-linear-to-r from-blue-950 to-cyan-500 h-screen p-5">
            <div className="bg-black px-4 py-2 rounded-xl">
                <h3 className="text-white font-bold">ALMAZ STORE</h3>
            </div>
            <div className="flex flex-col gap-4 bg-white rounded-3xl size-fit px-10 py-6">
                <h3 className="text-2xl font-semibold">Log into Your account</h3>
                <div>
                    <p>Username</p>
                    <input type="text" ref={usernameRef} placeholder="Username" className="border-2 border-gray-200 p-1 rounded-md w-full" />
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" ref={passwordRef} placeholder="Password" className="border-2 border-gray-200 p-1 rounded-md w-full" />
                </div>
                <button onClick={handleLogin} className="bg-blue-600 rounded-xl py-2 cursor-pointer">
                    Login now
                </button>
            </div>
        </div>
    )
}