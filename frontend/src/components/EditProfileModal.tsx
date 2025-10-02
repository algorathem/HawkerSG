import { useState } from 'react';
import { X, User, Lock, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Define the component to accept close function and current user data
export default function EditProfileModal({ isOpen, onClose, currentUser }: any) {
    const MAX_FILE_SIZE_MB = 1; // 1 MB limit
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    // If the modal isn't open, return null to render nothing
    if (!isOpen) return null;

    // Initialize state with current user data, or empty strings for new input
    const [username, setUsername] = useState(currentUser.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');

    const { updateProfile } = useAuth();

    const handleFileChange = (e: any) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFileError(''); // Reset error

        if (file) {
            // 1. Check File Type
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                setFileError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
                setProfilePicFile(null); // Clear the file
                return;
            }

            // 2. Check File Size (1MB = 1024 * 1024 bytes)
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setFileError(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
                setProfilePicFile(null); // Clear the file
                return;
            }

            // If valid, set the file
            setProfilePicFile(file);
        } else {
            setProfilePicFile(null);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (fileError) return; // Prevent submission if there's a file error
        setLoading(true);
        setError('');

        // 1. Validation for Password Change
        const changingPassword = password.length > 0;

        if (changingPassword) {
            if (password.length < 8) {
                setError('New password must be at least 8 characters long.');
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError('New password and confirm password do not match.');
                setLoading(false);
                return;
            }
        }

        // 2. Prepare data for update
        const updateData = new FormData();
        let isDataToUpdate = false;

        if (username !== currentUser.username && username.trim() !== '') {
            updateData.append('username', username.trim());
            isDataToUpdate = true;
        }

        if (changingPassword) {
            updateData.append('password', password);
            isDataToUpdate = true;
        }

        if (profilePicFile) {
            updateData.append('profile_pic', profilePicFile);
            isDataToUpdate = true;
        }

        if (!isDataToUpdate) {
            setError('No changes detected.');
            setLoading(false);
            return;
        }

        try {
            // console.log('--- Submitting FormData ---');
            // for (let pair of updateData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]);
            // }
            // console.log('---------------------------');
            await updateProfile(updateData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 transform transition-all scale-100 duration-300">

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    {/* Username Field (Non-mandatory) */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <User className="w-4 h-4 mr-2 text-red-500" />
                            New Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={currentUser.username}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Password Field (Non-mandatory) */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-red-500" />
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-red-500" />
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Profile Picture Field (Non-mandatory) */}
                    <div>
                        <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Upload className="w-4 h-4 mr-2 text-red-500" />
                            New Profile Picture
                        </label>
                        <input
                            id="profile_pic"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        {fileError && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {fileError}
                            </p>
                        )}

                        {/* Only display the file name if there is NO file error */}
                        {profilePicFile && !fileError && (
                            <p className="mt-1 text-xs text-gray-500">Selected: {profilePicFile.name}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
