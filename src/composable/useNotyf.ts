import { createSharedComposable } from '@vueuse/core'
import type { INotyfNotificationOptions, NotyfNotification } from 'notyf'
import { Notyf } from 'notyf'

import theme from '@/plugins/vuetify/theme.ts'

const colors = theme.themes.light.colors

export const useNotyf = createSharedComposable(() => {
  const notyf = new Notyf({
    duration: 2000,
    position: {
      x: 'right',
      y: 'bottom',
    },
    types: [
      {
        type: 'warning',
        background: colors.warning,
        icon: {
          className: 'mdi mdi-alert-octagon',
          tagName: 'i',
          text: '',
        },
      },
      {
        type: 'info',
        background: colors.info,
        icon: {
          className: 'mdi mdi-information',
          tagName: 'i',
          text: '',
        },
      },
      {
        type: 'error',
        background: colors.danger,
        icon: {
          className: 'mdi mdi-alert',
          tagName: 'i',
          text: '',
        },
      },
    ],
  })

  return {
    dismiss: (notification: NotyfNotification) => {
      notyf.dismiss(notification)
    },
    dismissAll: () => {
      notyf.dismissAll()
    },
    success: (payload: string | Partial<INotyfNotificationOptions>) => {
      return notyf.success(payload)
    },
    error: (payload: string | Partial<INotyfNotificationOptions>) => {
      return notyf.error(payload)
    },
    info: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'info',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    warning: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'warning',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    primary: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'primary',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    purple: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'purple',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    blue: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'blue',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    green: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'green',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
    orange: (payload: string | Partial<INotyfNotificationOptions>) => {
      const options: Partial<INotyfNotificationOptions> = {
        type: 'orange',
      }

      if (typeof payload === 'string')
        options.message = payload

      else
        Object.assign(options, payload)

      return notyf.open(options)
    },
  }
})
