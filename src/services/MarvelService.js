import { useHttp } from "../hooks/http.hook";


function useMarvelService() {
    const { loading, request, error, clearError } = useHttp();


    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=ab2b21b125345293e506596e2a74051b';
    const _baseOffset = '210';

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getCharByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return _transformCharOnSearchDemand(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        const fitDescription = char.description ? `${char.description.slice(0, 210)}...` : 'Info coming soon...';

        return {
            id: char.id,
            name: char.name,
            description: fitDescription,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    const _transformComics = (comicItem) => {
        const fitDescription = comicItem.description ? `${comicItem.description.slice(0, 210)}...` : 'Info coming soon...';

        return {
            id: comicItem.id,
            title: comicItem.title,
            description: fitDescription,
            thumbnail: `${comicItem.thumbnail.path}.${comicItem.thumbnail.extension}`,
            pageCount: comicItem.pageCount ? `${comicItem.pageCount} $` : 'No information about the number of pages',
            language: comicItem.textObjects.language || 'en-us',
            price: comicItem.prices.price ? `${comicItem.prices.price}$` : 'not available'
        }
    }

    const _transformCharOnSearchDemand = (char) => {
        if (char) {
            return {
                id: char.id,
                name: char.name,
                description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
                thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            }
        } else {
            return {
                name: null
            };
        }
    }

    return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharByName };
}

export default useMarvelService;
