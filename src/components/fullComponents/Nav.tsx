import React from 'react';
import { useSession } from '../../context/SupabaseContext';
import SignedInNavbar from './SignedInNavBar';
import TopNavbar from './DefaultNavbar';

const Navbar: React.FC = () => {
  const { session } = useSession();

  return session ? <SignedInNavbar /> : <TopNavbar />;
};

export default Navbar;
