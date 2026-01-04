import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Language } from '@/lib/languages';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, History, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserMenuProps {
  language?: Language;
  onViewHistory?: () => void;
}

export const UserMenu = ({ language, onViewHistory }: UserMenuProps) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const texts = {
    signIn: language?.code === 'hi' ? 'साइन इन करें' : 'Sign In',
    signOut: language?.code === 'hi' ? 'साइन आउट' : 'Sign Out',
    history: language?.code === 'hi' ? 'पिछली जाँच' : 'History',
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success(language?.code === 'hi' ? 'साइन आउट हो गया' : 'Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error(language?.code === 'hi' ? 'साइन आउट में त्रुटि' : 'Error signing out');
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/auth')}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        {texts.signIn}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-primary/10 hover:bg-primary/20"
        >
          <User className="w-5 h-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        {onViewHistory && (
          <DropdownMenuItem onClick={onViewHistory} className="cursor-pointer">
            <History className="w-4 h-4 mr-2" />
            {texts.history}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-destructive focus:text-destructive"
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          {texts.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
