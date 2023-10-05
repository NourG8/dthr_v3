import { useUserSession } from '@/stores/userSession'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  // const { t } = useI18n()

  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  })

  api.interceptors.request.use(config => {
    const userSession = useUserSession()

    config.headers.FromWeb = true

    if (userSession.isLoggedIn) {
      config.headers = {
        ...config.headers,
        // withCredentials: false,
        Authorization: `Bearer ${userSession.token}`,
      }
    }

    return config
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error) {
        let text = ''

        if (Array.isArray(error.response.data.error)) {
          // console.log(error.response.data.error)
            Object.values(error.response.data.error).forEach(el => {
              el.forEach(element => {
                text += `${element}<br>`
              })
            })
        }
        else { text = JSON.stringify(error.response.data.error) }
        Swal.fire({
          title: 'Error!',
          html: text,
          icon: 'error',
        })
      }

      return Promise.reject(error)
    },
  )

  return api
}

export function useApi() {
  if (!api)
    createApi()

  return api
}
