import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";
// import { MainPage, Comics, SingleComicPage } from "../pages";
// Динамічні імпорти вставляємо після статичних
// Так як помилки ми тут через catch обробити не можемо, то необхіден компонент Suspense
const Page404 = lazy(() => import('../pages/Page404')); // import for lazy loading
const MainPage = lazy(() => import('../pages/MainPage'));
const Comics = lazy(() => import('../pages/Comics'));
const ComicPage = lazy(() => import('../pages/comicPage/ComicPage'));
const CharPage = lazy(() => import('../pages/charPage/CharPage'));
const WrapperPage = lazy(() => import('../pages/WrapperPage'));

const App = () => {

    return (
        <Router >
            <div className="app">
                <AppHeader />
                <main>
                    {
                        // fallback - запасний компонент, котрий можна показати, 
                        // вантажеться динамічний імпорт
                    }
                    <Suspense fallback={<Spinner />}>
                        <Switch>
                            <Route exact path="/">
                                <MainPage />
                            </Route>
                            <Route exact path="/comics">
                                <Comics />
                            </Route>
                            {
                                // Для рендеру унікальної сторінки по айді прописуємо у шляху :comicId
                            }
                            <Route exact path="/comics/:id">
                                <WrapperPage Component={ComicPage} dataType='comic' />
                            </Route>
                            <Route exact path="/characters/:id">
                                <WrapperPage Component={CharPage} dataType='character' />
                            </Route>
                            <Route exact path="*">
                                <Page404 />
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </ Router >
    )
}

export default App;