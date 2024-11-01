/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

// Components
import { VNumberInput } from 'vuetify/labs/VNumberInput'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#04466E',
          secondary: '#364453',
          background: '#e6e8ee',
          surface: '#F7F9FF',
          error: '#8C0009',
          "on-primary": '#FFFFFF',
          "on-secondary": '#FFFFFF',
          "on-background": '#181C20',
          "on-surface": '#181C20',
          "on-error": '#FFFFFF',
        },
        dark: false,
        variables: {

        },
      },
    },
  },
  components: {
    VNumberInput,
  },
  defaults: {
    VBtn: {
      class: 'text-none',
    },
    VTextField: {
      variant: 'outlined',
    },
    VSelect: {
      variant: 'outlined',
    },
    VAutocomplete: {
      variant: 'outlined',
    },
    VTextarea: {
      variant: 'outlined',
    },
    VNumberInput: {
      variant: 'outlined',
      inset: true,
    }
  },
  blueprint: md3,
})
