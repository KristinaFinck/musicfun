export function isErrorWithError(error: unknown): error is { error: string } {
    return (
        typeof error === 'object' && // Проверяем, что error – это объект
        error != null && // Убеждаемся, что это не null
        'error' in error && // Проверяем, что у объекта есть свойство 'message'
        typeof (error as Record<string, unknown>).message === 'string' // Убеждаемся, что это строка
    )
}
