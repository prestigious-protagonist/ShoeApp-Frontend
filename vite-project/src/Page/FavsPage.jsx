    import React from 'react';
    import Favourites from '../Components/Favourites';
    import MiniCart from '../Components/MinCart';
    const FavsPage = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Section - 1/4 width */}
        <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '16px' }}>
            <h2>Left (1/4)</h2>
            <p>This is the left section.</p>
            <MiniCart />
        </div>

        {/* Right Section - 3/4 width */}
        <div style={{ flex: 3, backgroundColor: '#fff', padding: '16px' }}>
            <h2>Right (3/4)</h2>
            <p>This is the right section.</p>
            <Favourites />
        </div>
        </div>
    );
    };

    export default FavsPage;
