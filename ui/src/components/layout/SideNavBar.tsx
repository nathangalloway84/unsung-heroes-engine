import React from "react";

interface SideNavBarProps {
  loading: boolean;
  onAnalyze: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function SideNavBar({ loading, onAnalyze, isOpen, setIsOpen }: SideNavBarProps) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Responsive Aside Panel */}
      <aside className={`fixed left-0 top-0 h-full flex flex-col py-6 w-64 bg-slate-950 dark:bg-[#0b1326] border-r border-[#514532] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Mobile Header / Close Action */}
        <div className="px-6 mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#ffba20] font-headline">UNSUNG HEROES</h1>
            <p className="font-mono-data text-[10px] text-slate-500 tracking-widest mt-1">SECTOR: PARALYMPICS</p>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {/* Active Action Button */}
          <button 
            onClick={onAnalyze}
            disabled={loading}
            className={`w-full text-left group flex items-center px-6 py-3 transition-all duration-100 scale-0.98 text-[#ffba20] font-bold border-l-2 ${loading ? 'border-amber-400 bg-[#131b2e] opacity-70 cursor-wait' : 'border-[#ffba20] hover:bg-[#131b2e]'}`}
          >
            <span className="material-symbols-outlined mr-4">sports_kabaddi</span>
            <span className="font-headline tracking-tighter uppercase">Wrestling</span>
          </button>
          
          {/* Inactive Mocks */}
          <button disabled className="w-full text-left group flex items-center px-6 py-3 text-slate-500 font-mono-data text-xs uppercase opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined mr-4">sports_volleyball</span>
            <span>Goalball</span>
          </button>
          <button disabled className="w-full text-left group flex items-center px-6 py-3 text-slate-500 font-mono-data text-xs uppercase opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined mr-4">sports_martial_arts</span>
            <span>Judo</span>
          </button>
        </nav>
        
        {/* Agent Intelligence Footer */}
        <div className="mt-auto px-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant/10">
            <img alt="User Intelligence Profile" className="w-10 h-10 border border-amber-500/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0spgf-pzUeAea0ILh1f2s6bGghbfEeBO1V6i9Oum8FF6c-jypdgwcHanLi9oZrBdSQNc3f5V4f5nSoW2eySnb5L8V1Pxqml0-vY6SjmhRyWxrMs7RY-9bMCV0Eu_1y5dX5TzjBTpYRRrNO5sdW4_PZI46gGF7Esdpjkq0gb_ElJDzTUgReN3BqlOjMaeqH1TwRF7Aj4Muz4pcF1PxnW1gGb1oqe-nCJKeDnxP17lJo4vdR7xQN6wl1E03TwyYCz9jteLs9UgonU-C"/>
            <div className="overflow-hidden">
              <p className="font-mono-data text-[10px] text-[#ffba20] truncate">AGENT_ALPHA_01</p>
              <p className="font-mono-data text-[8px] text-slate-500 uppercase">Status: Operational</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
