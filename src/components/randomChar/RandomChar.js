import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        // Оновлюємо дані коли конструюється клас
        this.updateChar();
        this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    // прибераємо спінер
    onCharLoaded = (char) => {
        this.setState({ char, loading: false });
    }

    // додаємо спінер
    onCharLoading = () => {
        this.setState({ loading: true });
    }

    // додаємо помилку
    onError = () => {
        this.setState({ loading: false, error: true });
    }

    // рендеремо персонажа
    updateChar = () => {
        this.onCharLoading();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService.getCharacter(id).then(this.onCharLoaded).catch(this.onError);
    }

    // наступний персонаж на кліком
    nextChar = () => {
        clearInterval(this.timerId);
        this.updateChar();
    }

    render() {

        const { char, loading, error } = this.state;
        // створюємо помилку
        const errorMessage = error ? <ErrorMessage /> : null;
        // створюємо спінер
        const spinner = loading ? <Spinner /> : null;
        // умова відображення контенту
        // якщо немає або помилки, або спінеру:
        const content = !(loading || error) ? <View char={char} /> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.nextChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

// Виокремлюємо у окремий компонент блок, котрий відповідає за рендеринг даних
// Він не виконує ніяких логічних дій/розрахувань 
const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;