const LoadingDots = () => {
    return (
        <div className="flex space-x-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
    );
};

export default LoadingDots;
