import Searchbar from '../components/Searchbar';
import ProfileCircle from '../components/ProfileCircle';

function Home(){
    return (
        <>
        <div className="flex justify-end items-center mt-2 gap-4">
            <Searchbar />
            <ProfileCircle />
        </div>

        <div className="flex flex-col h-screen">
            <h1 className="text-4xl font-bold mb-4">Latest Reviews</h1>
            <p className="text-lg text-gray-600">See what fellow movie lovers are saying!</p>
        </div>
        </>
        
    );
}

export default Home;