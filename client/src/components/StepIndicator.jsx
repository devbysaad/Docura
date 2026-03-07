const STEPS = ["Basic Info", "Skills", "Experience", "Projects", "Education"];

export default function StepIndicator({ currentStep, totalSteps }) {
    const steps = STEPS.slice(0, totalSteps || STEPS.length);

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
            {steps.map((label, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                return (
                    <div key={label} className="flex items-center gap-1 sm:gap-2">
                        {/* Circle */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                                    : isActive
                                        ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-purple-400/40"
                                        : "bg-white/5 text-gray-500 border border-white/10"
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>
                            <span
                                className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${isActive ? "text-purple-300" : isCompleted ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div
                                className={`w-6 sm:w-10 h-0.5 rounded-full mb-5 transition-colors duration-300 ${step < currentStep ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
