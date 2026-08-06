import ReviewCard from "../components/ReviewCard";

function Home(){
    return (
        <>
            <div className="flex flex-col h-screen">
                <h1 className="text-4xl font-bold mb-4">Latest Reviews</h1>
                <p className="text-lg text-gray-600">See what fellow movie lovers are saying!</p>
            </div>
            <div className="flex flex-col h-screen">
                {/* Review Cards will go in here */}
            </div>
        </>
    );
}

export default Home;
