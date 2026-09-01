import {useLoginMutation} from "@/features/auth/api/authApi.ts";
import {Path} from "./../../routing"

export const Login = () => {
    const [login] = useLoginMutation()

    const loginHandler = () => {
        // Создаем URI для перенаправления после авторизации
        const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        // Создаем URL endpoint OAuth авторизации, добавляя callbackUrl как параметр запроса
        const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

        // Функция-обработчик для получения сообщений из всплывающего окна
        const receiveMessage = async (event: MessageEvent) => {
            // ЛОГ 1 — вообще пришло ли сообщение из popup
            console.log('1. MESSAGE RECEIVED:', event.origin, event.data)
            if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) {
                // ЛОГ 2 — не отбрасываем ли сообщение из-за origin
                console.log(
                    '2. WRONG ORIGIN:',
                    'получили:', event.origin,
                    'ожидали:', import.meta.env.VITE_DOMAIN_ADDRESS
                )
                return
            }


            const {code} = event.data
            if (!code) {
                console.log('3. NO CODE:', event.data)
                return
            }

            // Отписываемся от события, чтобы избежать обработки дублирующихся сообщений
            window.removeEventListener('message', receiveMessage)
            console.log('4. CALLING LOGIN:', code)

            login({code, redirectUri, rememberMe: false})
        }
        //
        //     // Подписываемся на сообщения из всплывающего окна
        //     window.addEventListener('message', receiveMessage)
        // }
        // СНАЧАЛА начинаем слушать
        window.addEventListener('message', receiveMessage)

        // ПОТОМ открываем popup
        window.open(url, 'oauthPopup', 'width=500, height=600')
    }
    return (
        <button type={'button'} onClick={loginHandler}>
            login
        </button>
    )
}