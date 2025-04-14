"use client"
import Link from "next/link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-lg w-full mx-4">
                <div className="text-center">
                    {/* 404 Icon */}
                    <div className="inline-block p-4 bg-red-100 rounded-full">
                        <ErrorOutlineIcon className="text-red-600 w-16 h-16" />
                    </div>

                    {/* Error message */}
                    <h1 className="mt-4 text-4xl font-bold text-gray-900">Page Not Found</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Sorry, we couldn't find the page you're looking for. The page might have been removed, renamed, or doesn't exist.
                    </p>

                    {/* Action buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <HomeIcon className="w-5 h-5 mr-2" />
                            Go to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <ArrowBackIcon className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                    </div>

                    {/* Additional help */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Need help? {" "}
                            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}