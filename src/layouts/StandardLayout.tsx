import { Outlet } from 'react-router/internal/react-server-client';
import MenuDrawer from '../components/MenuDrawer';

function StandardLayout() {
    return (
        <>
        <MenuDrawer/>
        <main className="px-7 bg-neutral-100">
            <Outlet />
        </main>
        </>
        
    )
}

export default StandardLayout;