import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const navigate = useNavigate();

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isPasswordFocus) return;

      const moveEye = (eye) => {
        if (!eye) return;

        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;

        const angle = Math.atan2(dy, dx);

        const moveX = Math.cos(angle) * 6;
        const moveY = Math.sin(angle) * 6;

        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      };

      moveEye(leftEyeRef.current);
      moveEye(rightEyeRef.current);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPasswordFocus]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login gagal: " + error.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-2xl p-8 text-center">
        
        {/* MINION */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
            
            {/* strap */}
            <div className="absolute top-1/2 w-full h-6 bg-gray-700 -z-10"></div>

            {/* goggles */}
            <div className="absolute w-full flex justify-center gap-4">
              
              {/* LEFT EYE */}
              <div className="relative w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-500 flex items-center justify-center overflow-hidden">
                
                {/* eyelid animation */}
                <div
                  className={`absolute inset-0 bg-yellow-400 z-10 origin-top transition-transform duration-300 ${
                    isPasswordFocus ? "scale-y-100" : "scale-y-0"
                  }`}
                ></div>

                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <div
                    ref={leftEyeRef}
                    className="w-3 h-3 bg-black rounded-full transition-transform duration-75"
                  ></div>
                </div>
              </div>

              {/* RIGHT EYE */}
              <div className="relative w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-500 flex items-center justify-center overflow-hidden">
                
                {/* eyelid animation */}
                <div
                  className={`absolute inset-0 bg-yellow-400 z-10 origin-top transition-transform duration-300 ${
                    isPasswordFocus ? "scale-y-100" : "scale-y-0"
                  }`}
                ></div>

                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <div
                    ref={rightEyeRef}
                    className="w-3 h-3 bg-black rounded-full transition-transform duration-75"
                  ></div>
                </div>
              </div>
            </div>

            {/* mouth */}
            <div className="absolute bottom-6 w-12 h-5 border-b-4 border-gray-700 rounded-b-full"></div>
          </div>
        </div>

        {/* TEXT */}
        <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>

        <p className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 opacity-70">
          <ShieldCheck size={16} className="text-emerald-700" />
          kpmdatamanagement
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8">
          <input
            type="email"
            className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Password"
            value={password}
            onFocus={() => setIsPasswordFocus(true)}
            onBlur={() => setIsPasswordFocus(false)}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          by ngodinginaja
        </p>
      </div>
    </div>
  );
}
