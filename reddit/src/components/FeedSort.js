import React from 'react';
import { Rocket, Whatshot, Label, TrendingUp } from '@mui/icons-material';

const FeedSort = () => {

    const toggleSortBtn = (e) => {
        Array.from(e.target.parentNode.children).forEach(elem => elem.classList.remove('feed-sort-btn-active'));
        e.target.classList.add('feed-sort-btn-active');
    }
    
    return (
        <div className="feed-sort">
            <button className="feed-sort-btn feed-sort-btn-active" onClick={toggleSortBtn}>
                <Rocket />
                <span>Best</span>
            </button>
            <button className="feed-sort-btn" onClick={toggleSortBtn}>
                <Whatshot />
                <span>Hot</span>
            </button>
            <button className="feed-sort-btn" onClick={toggleSortBtn}>
                <Label />
                <span>New</span>
            </button>
            <button className="feed-sort-btn" onClick={toggleSortBtn}>
                <TrendingUp />
                <span>Top</span>
            </button>
        </div>
    )
}

export default FeedSort;