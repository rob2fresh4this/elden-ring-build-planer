"use client";
import React, { useState } from 'react'

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <div className="w-full max-w-md p-8 bg-[#232014] rounded-lg shadow-2xl border border-[#a08c4a]">
                <h2 className="text-3xl font-bold mb-6 text-center tracking-widest text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                    Sign Up
                </h2>
                <form className="space-y-5">
                    <div>
                        <label className="block mb-1 text-[#e5c77b] font-semibold tracking-wide">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded bg-[#18140c] border border-[#a08c4a] focus:outline-none focus:ring-2 focus:ring-[#e5c77b] text-[#e5c77b] placeholder-[#a08c4a]"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-[#e5c77b] font-semibold tracking-wide">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded bg-[#18140c] border border-[#a08c4a] focus:outline-none focus:ring-2 focus:ring-[#e5c77b] text-[#e5c77b] placeholder-[#a08c4a]"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-[#e5c77b] font-semibold tracking-wide">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded bg-[#18140c] border border-[#a08c4a] focus:outline-none focus:ring-2 focus:ring-[#e5c77b] text-[#e5c77b] pr-10 placeholder-[#a08c4a]"
                                placeholder="Enter your password"
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    // Eye open icon (SVG)
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#a08c4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    // Eye closed icon (SVG)
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#a08c4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#a08c4a] to-[#e5c77b] hover:from-[#e5c77b] hover:to-[#a08c4a] text-[#232014] font-bold py-2 rounded shadow-lg tracking-widest transition-all duration-200"
                        style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage