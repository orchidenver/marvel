import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        // Якщо initial передаємо тру, то це первинне завантаження
        // Якщо повторне завантаження - фолс (завантажуємо нових персонажів)
        initialLoadChars(offset, true);
    }, []);

    const initialLoadChars = (offset, initial) => {
        // Змінюємо інтерфейс при завантаженні даних
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset).then(onCharListLoaded);
    }

    // Додаємо елементи при пагінації у стейт charList
    const onCharListLoaded = (newCharList) => {
        let isEnded = false;
        if (newCharList.length < 9) isEnded = true;

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 9); // дозавантажуємо 9 елементів
        setCharEnded(charEnded => isEnded); // для блокування завантаження, коли немає чого вантажити
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(array) {

        const items = array.map((item, i) => {
            const { id, thumbnail, name } = item;
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') imgStyle = { 'objectFit': 'unset' };
            // https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/tabindex
            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        key={id}
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el} // додаємо до конкретного ДОМ елемента реф
                        onClick={() => {
                            props.onSelectedChar(id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onSelectedChar(id);
                                focusOnItem(i);
                            }
                        }}
                        className="char__item">
                        <img src={thumbnail} alt={name} style={imgStyle} />
                        <div className="char__name">{name}</div>
                    </li>
                </CSSTransition>
            )
        })

        return (

            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    // Є завантаження і при цьому зе не завантаження нових компонентів
    // За таких умов спінер буде вантажитися тільки у перший раз, коли ми завантажуємо персонажів
    // За умов додаткового завантаження персонажів спінеру не буде
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    // style={{ 'display': charEnded ? 'none' : 'block' }} - якщо білше немає чого вантажити
    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {renderItems(charList)}
            <button
                disabled={newItemsLoading}
                onClick={() => initialLoadChars(offset)}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired
}


export default CharList;