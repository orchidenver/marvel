import { Helmet } from "react-helmet";

import AppBanner from "../appBanner/AppBanner";
import ComicsList from '../comicsList/ComicsList';

function Comics() {
    return (
        <>
            <Helmet>
                <meta name="description" content="Page with list of comics" />
                <title>Comics Page</title>
            </Helmet>
            <AppBanner />
            <ComicsList />
        </>
    )
}

export default Comics;