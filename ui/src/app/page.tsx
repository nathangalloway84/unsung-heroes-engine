"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const aggregatedData = [
  { name: 'Olympics (Mainstream)', visibility: 85, strain: 45 },
  { name: 'Paralympics (Niche)', visibility: 12, strain: 90 },
];

export default function RootPage() {
  return (
    <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
      <div className="flex flex-col mb-8 pb-4 border-b border-outline-variant/10">
        <h1 className="font-headline text-5xl font-black text-[#ffba20] tracking-tighter uppercase mb-2">UNSUNG HEROES DATA COMMAND</h1>
        <p className="text-slate-400 font-mono-data text-xs tracking-widest uppercase">Initializing Macro-Level Parity Engine Telemetry...</p>
      </div>

      <div className="bg-surface-container-low p-8 relative shadow-lg border border-outline-variant/30 mt-8">
         <h2 className="font-headline text-3xl font-black uppercase tracking-tighter mb-6 text-on-surface border-l-4 border-[#ffba20] pl-4">Systemic Discrepancy Matrix</h2>
         <div className="w-full h-[400px]">
           <ResponsiveContainer width="100%" height={400}>
             <BarChart data={aggregatedData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#514532" />
               <XAxis dataKey="name" stroke="#dae2fd" />
               <YAxis stroke="#dae2fd" />
               <Tooltip contentStyle={{ backgroundColor: '#0b1326', borderColor: '#ffba20' }} />
               <Legend />
               <Bar dataKey="visibility" fill="#ffba20" name="Mainstream Media Visibility" />
               <Bar dataKey="strain" fill="#ff453a" name="Athlete Strain / Financial Burden" />
             </BarChart>
           </ResponsiveContainer>
         </div>
      </div>
      
      <div className="mt-8 flex gap-4 font-mono-data">
        <div className="p-6 bg-surface-container-high border-l-4 border-error shadow-xl flex-1">
           <h3 className="text-error font-bold mb-2 uppercase tracking-widest">Action Required</h3>
           <p className="text-slate-400 text-sm">Select a sector feed from the navigation array or engage [COMPARE MODE] to overlay explicit sport data architectures natively.</p>
        </div>
      </div>
    </main>
  );
}
