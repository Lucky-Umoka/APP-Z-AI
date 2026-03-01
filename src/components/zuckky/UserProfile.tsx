
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, LifeBuoy, LogOut, Settings, User, LogIn } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export function UserProfile() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isLoggedIn = user && !user.isAnonymous;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto w-full items-center justify-start gap-2 px-0 py-1"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'guest'}/40/40`} alt="User" />
            <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'G'}</AvatarFallback>
          </Avatar>
          <div className="text-left group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate max-w-[120px]">
              {isLoggedIn ? (user?.displayName || 'User') : 'Guest User'}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {isLoggedIn ? user?.email : 'Sign in with Google'}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoggedIn ? (user?.displayName || 'User') : 'Guest'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'Not signed in'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!isLoggedIn ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/login')}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log in with Google</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing (1,200 credits)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
