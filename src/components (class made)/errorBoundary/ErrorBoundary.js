import { Component } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // Тільки для оновлення стейту. Після оновлення стейту
    // можна додатково рендерити UI у іншому методі за умови того,
    // що в стейт ми вже встановили помилку
    static getDerivedStateFromError(error) {
        return { error: true };
    }

    // Тількт для того, щоб протоколювати помилку (згідно документації реакту)
    componentDidCatch(error, info) {
        this.setState({ error: true });
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage />
        }

        return this.props.children;
    }
}

export default ErrorBoundary;