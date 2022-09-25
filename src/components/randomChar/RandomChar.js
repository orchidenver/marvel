import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


const RandomChar = () => {
    const [char, setChar] = useState(null);
    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        // Оновлюємо дані коли конструюється клас
        updateChar();
        const timerId = setInterval(updateChar, 3000);

        return () => clearInterval(timerId);
    }, []);

    // прибераємо спінер
    const onCharLoaded = (char) => {
        setChar(char);
    }

    // рендеремо персонажа
    const updateChar = () => {
        // Якщо при завантаженні персонажу є помилка, наприклад, за айді не може знайти персонажа, то чистимо помилку
        // Якщо не зробимо це, то у разі, якщо персонажу немає, то якщо будемо клацати на кнопку TRY
        // То дані вантажитися не будуть. Ми прибираємо помилку, що блокує завантаження нових даних
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id).then(onCharLoaded);
    }

    // створюємо помилку
    const errorMessage = error ? <ErrorMessage /> : null;
    // створюємо спінер
    const spinner = loading ? <Spinner /> : null;
    // умова відображення контенту
    // якщо немає або помилки, або спінеру:
    const content = !(loading || error || !char) ? <View char={char} /> : null;

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
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
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