import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const LoginPage: React.FC = () => {
    const { signIn, authError } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900">
            <div className="w-full max-w-md text-center">
                <Logo className="h-20 w-20 mx-auto" showText={false} />
                <h1 className="text-3xl font-bold text-white mt-6">พรรคประชาชน AI</h1>
                <p className="text-gray-400 mt-2">กรุณาเข้าสู่ระบบเพื่อเข้าถึงเวิร์กสเตชัน</p>
                
                <div className="mt-8">
                    <button
                        onClick={signIn}
                        className="w-full h-14 flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.565-3.108-11.127-7.462l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.405,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span>เข้าสู่ระบบด้วย Google</span>
                    </button>
                </div>

                {authError && (
                    <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-xl" role="alert">
                        <strong className="font-bold">เกิดข้อผิดพลาดในการเข้าสู่ระบบ:</strong>
                        <p className="mt-1">{authError}</p>
                    </div>
                )}
                 <p className="text-xs text-gray-600 mt-12">การเข้าถึงถูกจำกัดสำหรับบุคลากรที่ได้รับอนุญาตเท่านั้น</p>
            </div>
        </div>
    );
};

export default LoginPage;