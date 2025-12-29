"use client";

import dynamic from "next/dynamic";

import "@/app/admin/index.css";


const AdminApp = dynamic(() => import("@admin/App"), {
  ssr: false,
  loading: () => <LoadingSpinner />
});


function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-indigo-500 animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-3 border-transparent border-t-violet-500 animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite_0.15s]"></div>
        <div className="absolute inset-4 rounded-full border-3 border-transparent border-t-purple-400 animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite_0.3s]"></div>
      </div>
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading admin panel...</p>
    </div>
  );
}


export default function AdminCatchAll() {
  return <AdminApp />;
}
