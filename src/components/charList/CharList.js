import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charEnded: false
    }
    itemRefs = [];

    marvelService = new MarvelService()

    componentDidMount() {
        this.initialLoadChars();
    }

    initialLoadChars = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded).catch(this.onError);
    }

    // Змінюємо інтерфейс при завантаженні даних
    onCharListLoading = () => {
        this.setState({ newItemsLoading: true });
    }

    // Додаємо елементи при пагінації у стейт charList
    onCharListLoaded = (newCharList) => {
        let isEnded = false;
        if (newCharList.length < 9) isEnded = true

        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9, // дозавантажуємо 9 елементів
            charEnded: isEnded, // для блокування завантаження, коли немає чого вантажити
        }));
    }

    onError = () => {
        this.setState({ loading: false, error: true });
    }

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (array) => {

        const items = array.map((item, i) => {
            const { id, thumbnail, name } = item;
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') imgStyle = { 'objectFit': 'unset' };
            // https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/tabindex
            return (
                <li
                    key={id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onSelectedChar(id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onSelectedChar(id);
                            this.focusOnItem(i);
                        }
                    }}
                    className="char__item">
                    <img src={thumbnail} alt={name} style={imgStyle} />
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, newItemsLoading, offset, charEnded } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? this.renderItems(charList) : null;

        // style={{ 'display': charEnded ? 'none' : 'block' }} - якщо білше немає чого вантажити
        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button
                    disabled={newItemsLoading}
                    onClick={() => this.initialLoadChars(offset)}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired
}


export default CharList;