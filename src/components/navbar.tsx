import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background px-10'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Link to='/' className='font-bold text-xl'>
            Brand
          </Link>

          <nav className='hidden md:flex gap-6'>
            <Link
              to='/'
              className='text-sm font-medium transition-colors hover:text-primary'
            >
              Home
            </Link>
            <Link
              to='/features'
              className='text-sm font-medium transition-colors hover:text-primary'
            >
              Features
            </Link>
            <Link
              to='/pricing'
              className='text-sm font-medium transition-colors hover:text-primary'
            >
              Pricing
            </Link>
            <Link
              to='/about'
              className='text-sm font-medium transition-colors hover:text-primary'
            >
              About
            </Link>
          </nav>
        </div>

        {/* Desktop auth buttons */}
        <div className='hidden md:flex items-center gap-4'>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='right'>
            <nav className='flex flex-col gap-4 mt-8'>
              <Link
                to='/'
                className='text-sm font-medium transition-colors hover:text-primary'
              >
                Home
              </Link>
              <Link
                to='/features'
                className='text-sm font-medium transition-colors hover:text-primary'
              >
                Features
              </Link>
              <Link
                to='/pricing'
                className='text-sm font-medium transition-colors hover:text-primary'
              >
                Pricing
              </Link>
              <Link
                to='/about'
                className='text-sm font-medium transition-colors hover:text-primary'
              >
                About
              </Link>
              <div className='h-px bg-border my-4' />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
