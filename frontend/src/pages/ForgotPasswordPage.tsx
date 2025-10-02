import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await forgotPassword(email);
            
            // Set success to true upon successful API response (regardless of email existence)
            setSuccess(true);
        } catch (err) {
            // Only show an error if the API request itself failed (e.g., server down, network issue)
            setError('We encountered a temporary error. Please try again in a moment.');
        } finally {
            setLoading(false);
        }
    };

    // --- Conditional Content Rendering ---
    const renderContent = () => {
        if (success) {
            return (
                <div className="text-center p-8 bg-green-50 rounded-xl">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
                    {/* The NEUTRAL SECURITY MESSAGE */}
                    <p className="text-gray-600 mb-6">
                        If an account with that email is registered, a password reset link will be sent.
                    </p>
                    {/* End of NEUTRAL SECURITY MESSAGE */}
                    <Link 
                        to="/login"
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                        Return to Sign In
                    </Link>
                </div>
            );
        }

        return (
            <>
                <div className="text-center">
                    <Mail className="h-8 w-8 text-red-600 mx-auto mb-3" />
                    <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-gray-600">Enter your email address.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 text-sm bg-red-50 py-2 px-4 rounded-lg">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="text-red-600 hover:text-red-700 font-medium text-sm">
                            &larr; Back to Sign In
                        </Link>
                    </div>
                </form>
            </>
        );
    };
    // --- End Conditional Content Rendering ---

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                {renderContent()}
            </div>
        </div>
    );
}