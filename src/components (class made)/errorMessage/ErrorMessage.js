import img from './error.gif'

const ErrorMessage = () => {
    // Проставляємо шлях з папки public ТІЛЬКИ ТАК process.env.PUBLIC_URL + '/error.gif'
    return (
        <img style={{ display: 'block', width: "250px", height: "250px", objectFit: 'contain', margin: "0 auto" }} src={img} alt="error" />
    )
}

export default ErrorMessage;