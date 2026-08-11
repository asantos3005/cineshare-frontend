import { Outlet, useLocation } from 'react-router';
import MenuDrawer from '../components/MenuDrawer';
import ProfileCircle from '../components/ProfileCircle';
import Searchbar from '../components/Searchbar';

function StandardLayout() {
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    return (
        <main className="min-h-screen bg-neutral-100 px-4 py-3 sm:px-6 lg:px-8">
            
            {/* This div is the header row for the entire app. Can add specific page 
            header elements to be in same row as the menudrawer button. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <MenuDrawer />

                {isHome && (
                    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
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
