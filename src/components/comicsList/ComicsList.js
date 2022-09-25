import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        initialLoadChars(offset, true);
    }, []);

    const initialLoadChars = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllComics(offset).then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let isEnded = false;
        if (newComicsList.length < 8) isEnded = true;

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemsLoading(false);
        setOffset(offset + 8);
        setComicsEnded(isEnded);
    }

    function renderItems(array) {

        const items = array.map((item, i) => {
            const { id, thumbnail, title, price } = item;

            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img" />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {renderItems(comicsList)}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                onClick={() => initialLoadChars(offset)}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;