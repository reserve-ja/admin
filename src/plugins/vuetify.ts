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
          primary: '#212121',
          secondary: '#5CBBF6',
          background: '#F0F4F9'
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
