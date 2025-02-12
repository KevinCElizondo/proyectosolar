
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import i18n from "./i18n/config";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-dark">
            <nav className="bg-dark-lighter border-b border-white/10">
              <div className="container mx-auto px-4 py-3 flex justify-end">
                <button
                  onClick={toggleLanguage}
                  className="px-4 py-2 bg-[#6F3AF2] text-white rounded-lg hover:bg-[#5B2FD9] transition-colors font-inter text-sm flex items-center gap-2"
                >
                  {i18n.language === 'es' ? 'EN' : 'ES'}
                </button>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
