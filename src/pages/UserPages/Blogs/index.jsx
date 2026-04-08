import React from 'react';
import NewBlog from "./NewBlog.jsx";
import OldBlog from "./OldBlog.jsx";
import Cards from "./Cards.jsx";
import ScrollToTop from "../../../components/ScrollToTop/index.jsx";

function Blogs() {
    return (
        <div id="blogs-page">
            <ScrollToTop/>
            <NewBlog/>
            <OldBlog/>
            <Cards/>
        </div>
    );
}

export default Blogs;
