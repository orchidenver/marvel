import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';

import './charSearchForm.scss';

function CharSearchForm() {
    const [char, setChar] = useState(null);
    const { loading, error, clearError, getCharByName } = useMarvelService();

    function onCharLoaded(char) {
        setChar(char);
    }

    function updateChar(char) {
        clearError();
        getCharByName(char).then(onCharLoaded);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    const results = !char ? null : char.name ?
        <div className="char__search-wrapper">
            <div className="char__search-success">There is! Visit {char.name} page?</div>
            <Link to={`/characters/${char.id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div> :
        <div className="char__search-error">
            The character was not found. Check the name and try again
        </div>;

    return (

        <div className="char__search-form">
            <Formik
                initialValues={{ charName: '' }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('Ruquired field')
                })}
                onSubmit={({ charName }) => updateChar(charName)}>
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="charName"
                            name='charName'
                            type='text'
                            placeholder="Enter name" />
                        <button
                            type='submit'
                            className="button button__main"
                            disabled={loading}
                        >
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage className='char__search-error' name="charName" component="div" />
                </Form>
            </Formik>
            {errorMessage}
            {results}
        </div >
    )
}

export default CharSearchForm;