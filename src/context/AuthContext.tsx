import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, INavLink, IUser } from '@/types';
import {createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: '',
    name: '',
    email: '',
    username: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
    showLoginDialog: false,
    handleRouteChange: () => {},
    setShowLoginDialog: () => {},
    isPWA: false
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [isPWA, setIsPWA] = useState(false);
    const navigate = useNavigate();

    const handleRouteChange = (routeObj: INavLink) => {
        if (!isAuthenticated && routeObj.requireLogin) {
            setShowLoginDialog(true);
        } else {
            navigate(routeObj.route);
        }
    }

    useEffect(() => {
        const mqStandAlone = '(display-mode: standalone)';
        if ('standalone' as string in navigator || window.matchMedia(mqStandAlone).matches) {
          setIsPWA(true);
        }
    }, []);

    const checkAuthUser = async () => {
        try {
            setIsLoading(true);
            const currentAccount = await getCurrentUser();
            
            if(currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email:  currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                    notifications: currentAccount.notifications
                });
                setIsAuthenticated(true);
                return true
            }
            return false;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if( 
            localStorage.getItem('cookieFallback') === '[]'
            // localStorage.getItem('cookieFallback') === null 
        ) {
            navigate('/sign-in');
        }
        checkAuthUser();
    }, [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
        handleRouteChange,
        showLoginDialog,
        setShowLoginDialog,
        isPWA
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);