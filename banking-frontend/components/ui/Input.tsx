import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const [isFocused, setIsFocused] = React.useState(false)
        const [hasValue, setHasValue] = React.useState(false)

        const inputType = type === "password" && showPassword ? "text" : type

        return (
            <div className="relative w-full">
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}

                    <input
                        type={inputType}
                        className={cn(
                            "peer w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-transparent transition-all",
                            "focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-slate-800",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            icon && "pl-10",
                            type === "password" && "pr-10",
                            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                            className
                        )}
                        ref={ref}
                        placeholder={label || props.placeholder}
                        onFocus={(e) => {
                            setIsFocused(true)
                            props.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            props.onBlur?.(e)
                        }}
                        onChange={(e) => {
                            setHasValue(e.target.value.length > 0)
                            props.onChange?.(e)
                        }}
                        {...props}
                    />

                    {label && (
                        <label
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all pointer-events-none",
                                icon && "left-10",
                                "peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-slate-900 peer-focus:px-1 peer-focus:text-purple-500",
                                (isFocused || hasValue || props.value) && "top-0 left-3 text-xs bg-slate-900 px-1",
                                error && "peer-focus:text-rose-500"
                            )}
                        >
                            {label}
                        </label>
                    )}

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-rose-500">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
