import { useState } from 'react';
import AppSidebar from '../AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const [activeModule, setActiveModule] = useState('dashboard');
  
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          userPoints={1250}
        />
        <main className="flex-1 p-4">
          <p>Active module: {activeModule}</p>
        </main>
      </div>
    </SidebarProvider>
  );
}