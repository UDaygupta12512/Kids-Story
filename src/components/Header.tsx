
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { User, LogOut, Menu, X } from "lucide-react";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "See you next time! 👋",
    });
    navigate('/');
  };

  const navLinks = [
    { to: "/", label: "Home", color: "kids-purple" },
    { to: "/games", label: "Games", color: "kids-blue" },
    { to: "/creative", label: "Creative", color: "kids-orange" },
    { to: "/parents-teachers", label: "For Educators", color: "kids-green" },
    { to: "/settings", label: "Settings", color: "kids-purple" },
  ];

  // Static class maps to prevent Tailwind from purging dynamic class strings in production
  const navColorClasses: Record<string, { hover: string; active: string; activeBg: string }> = {
    "kids-purple": { hover: "hover:text-kids-purple", active: "text-kids-purple font-semibold", activeBg: "bg-kids-purple/10 text-kids-purple font-semibold" },
    "kids-blue":   { hover: "hover:text-kids-blue",   active: "text-kids-blue font-semibold",   activeBg: "bg-kids-blue/10 text-kids-blue font-semibold"   },
    "kids-orange": { hover: "hover:text-kids-orange", active: "text-kids-orange font-semibold", activeBg: "bg-kids-orange/10 text-kids-orange font-semibold" },
    "kids-green":  { hover: "hover:text-kids-green",  active: "text-kids-green font-semibold",  activeBg: "bg-kids-green/10 text-kids-green font-semibold"  },
  };

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center relative">
      <Link to="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
        <div className="relative">
          <div className={cn(
            "w-12 h-12 bg-kids-purple rounded-xl flex items-center justify-center",
            "rotate-3 animate-float"
          )}>
            <span className="text-white text-2xl font-bold">K</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-kids-orange rounded-full" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-kids-purple to-kids-blue bg-clip-text text-transparent">
          KidStoryAI
        </h1>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "text-lg transition-all duration-200 hover:scale-105",
              navColorClasses[link.color].hover,
              location.pathname === link.to && navColorClasses[link.color].active
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Auth buttons - desktop */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-kids-purple/10">
                <User className="w-4 h-4 text-kids-purple" />
                <span className="text-sm text-kids-purple font-medium">
                  {session.user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-kids-red hover:bg-opacity-90 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="bg-kids-orange hover:bg-opacity-90 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-kids-purple/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg rounded-b-2xl z-50 p-4 flex flex-col gap-3 md:hidden border-t border-kids-purple/10 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-lg px-4 py-3 rounded-xl transition-all",
                location.pathname === link.to
                  ? navColorClasses[link.color].activeBg
                  : "hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-3 mt-1">
            {session ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-kids-purple/10">
                  <User className="w-4 h-4 text-kids-purple" />
                  <span className="text-sm text-kids-purple font-medium">
                    {session.user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-kids-red hover:bg-opacity-90 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-kids-orange hover:bg-opacity-90 text-white px-4 py-3 rounded-xl font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
