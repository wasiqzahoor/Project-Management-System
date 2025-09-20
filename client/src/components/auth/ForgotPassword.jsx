// client/src/components/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // useAuth ko import karein

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // 'token' ko 'otp' se badal dein
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth(); // AuthContext se naya function istemal karenge

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('An OTP has been sent to your email.');
      setStep('otp'); // 'token' ki jagah 'otp' step par jayein
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('OTP must be 4 digits.');
      return;
    }
    setLoading(true);
    try {
      // Ab hum 'otp' bhejenge
      const response = await api.patch('/auth/reset-password', { otp, password }); 
      toast.success('Password reset successfully! You are now logged in.');
      
      // Password reset ke baad user ko automatically login karwa dein
      // Iske liye humein AuthContext mein ek naya function banana hoga
      // Filhal, hum wapas login page par bhej dete hain.
      onBackToLogin();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <button onClick={onBackToLogin} className="flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700 dark:hover:text-gray-300">
          <ArrowLeft size={16} className="mr-2" />
          Back to Login
        </button>

        {step === 'email' && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Forgot Password</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Enter your email to get a 4-digit OTP.</p>
            <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              <Button type="submit" loading={loading} className="w-full">Send OTP</Button>
            </form>
          </motion.div>
        )}
        
        {step === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Enter OTP & New Password</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Check your email for the OTP.</p>
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <input 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="4-Digit OTP" 
                required 
                maxLength="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
              />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="New Password" 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
              />
              <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;