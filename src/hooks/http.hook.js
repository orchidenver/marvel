import { useState, useCallback } from "react";

export function useHttp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Відправляємо запит
    const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
        setLoading(true);
        try {
            const resposne = await fetch(url, { method, body, headers });

            if (!resposne.ok) {
                throw new Error(`Could not fetch ${url}, status: ${resposne.status}`);
            }

            const data = await resposne.json();
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    // Чистимо помилки. Повертаємо стейту null
    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError };
}