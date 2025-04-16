import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("") // Reset error message
        
        try {
            // First authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (authError) {
                throw authError
            }

            // Then check for admin role in your users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select()
                .eq('email', formData.email)
                .eq('role', 'admin')
                .single()

            if (userError || !userData) {
                throw new Error("Admin user not found")
            }

            // Store user data and redirect
            localStorage.setItem('user', JSON.stringify(userData))
            window.location.href = '/'
            
        } catch (error) {
            console.error("Login error:", error)
            setError(error.message || "Invalid credentials")
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-glass p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-800 mb-2">Welcome Back</h1>
                    <p className="text-primary-600">Please enter your credentials to login</p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-accent-100 text-accent-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition duration-200"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login