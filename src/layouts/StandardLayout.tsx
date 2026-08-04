import { Outlet, useLocation } from 'react-router';
import MenuDrawer from '../components/MenuDrawer';
import ProfileCircle from '../components/ProfileCircle';
import Searchbar from '../components/Searchbar';

function StandardLayout() {
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    return (
        <main className="px-7 bg-neutral-100">
            
            {/* This div is the header row for the entire app. Can add specific page 
            header elements to be in same row as the menudrawer button. */}
            <div className="flex items-center justify-between mt-2 gap-4">
                <MenuDrawer />

                {isHome && (
                    <div className="flex items-center gap-4">
                        <Searchbar />
                        <ProfileCircle />
                    </div>
                )}
            </div>
            <Outlet />
        </main>
    )
}

export default StandardLayout;
