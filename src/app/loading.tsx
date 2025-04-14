export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {/* Loading spinner */}
                <div className="inline-block relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="w-full h-full border-4 border-blue-200 rounded-full"></div>
                        <div className="w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                </div>
                
                {/* Loading text */}
                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-700">Loading</h2>
                    <p className="text-gray-500 mt-1">Please wait while we prepare your content...</p>
                </div>

                {/* Animated dots */}
                <div className="mt-2 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
            </div>
        </div>
    );
}