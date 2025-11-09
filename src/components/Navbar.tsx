import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Users, History, FileText, Key } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

export const Navbar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg text-foreground">Extrato Clientes</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Enviar Extrato
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="ghost" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/users">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Usuários
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || profile?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setChangePasswordOpen(true)}
            >
              <Key className="h-4 w-4 mr-2" />
              Mudar Senha
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </nav>
  );
};
