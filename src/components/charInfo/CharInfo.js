import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';


import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    // Коли оновлюється стейт - запускається рендер
    // Після ренжеру може запуститися componentDidUpdate
    // При отриманні провсів перевіряємо, чи оновилися вони
    // Якщо оновилися - оновлюємо компонент 
    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) this.updateChar();
    }

    updateChar = () => {
        const { charId } = this.props;

        if (!charId) return;

        this.onCharLoading();

        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({ char, loading: false });
    }

    onCharLoading = () => {
        this.setState({ loading: true });
    }

    onError = () => {
        this.setState({ loading: false, error: true });
    }

    render() {
        const { char, loading, error } = this.state;

        // Робимо заглушку
        const skeleton = char || loading || error ? null : <Skeleton />;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !loading && !error && char ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let imgStyle = { 'objectFit': 'cover' };

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') imgStyle = { 'objectFit': 'unset' };

    const comicsList = comics.map((comic, i) => {
        // використовуємо ключем і, тому що комікси динамічно рендеритися не будуть
        if (i < 10) {
            return (
                <li key={i} className="char__comics-item">
                    {comic.name}
                </li>
            )
        }
    });

    return (
        <>
            <div className="char__basics">
                <img style={imgStyle} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList.length === 0 ? 'Seems like the character has no comics list...' : comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;