import React,{useState} from 'react'
import {supabase} from "./src/lib/supabase"
import toast from 'react-hot-toast';
import { log } from 'console';

function Reset() {
    const [email , setEmail] = useState(null)

    const handleSubmit = async(e) =>{
        e.preventDefult();

        try{
            const {error} = await supabase.auth.resetPasswordForEmail(email)

            if(!error){
                toast.success('Invalid or expired password reset link');
            }else if(error){
                toast.error('Invalid or expired password reset link');
                console.error('Error getting user from token:', error);
            }
        }catch(error){
            console.error("error",error);
        }
    }
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >Update Password
        </button>
      </form>
    </div>
  )
}

export default Reset
