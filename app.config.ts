// Tema base do Nuxt UI (app autenticado e páginas do site). Os templates da página
// pública têm identidade própria e NÃO dependem dessas cores. A escala `brand` fica
// em assets/css/main.css.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'slate',
    },
    button: {
      // O hover padrão clareia o botão e o texto branco perde contraste.
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'hover:bg-primary-700 active:bg-primary-800 dark:hover:bg-primary-300 dark:active:bg-primary-200',
        },
      ],
    },
  },
})
