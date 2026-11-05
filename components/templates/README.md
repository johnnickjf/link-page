# Templates da página pública

Um template é **só identidade**: classes, cabeçalho e CSS. A estrutura (redes,
blocos, assinatura, WhatsApp) vem do `TemplateShell.vue`, e a lógica de tema
(`page.theme` virando variáveis CSS) do `useTemplateLayout`.

## Criar um template

1. Copie um template parecido e troque o `rootClass`, o cabeçalho e o CSS.
2. Registre em `TemplateRenderer.vue`.
3. Registre em `link-land/src/page/services/template_service.py` (é o catálogo,
   e é dele que sai o plano que libera o template).
4. Adicione o id em `TEMPLATES` de `e2e/fixtures.ts` para ganhar screenshots.

## Contrato de variáveis

Definidas no root do template; o `theme` do usuário sobrescreve por cima.

| Variável | Para quê |
|---|---|
| `--lp-accent` | destaque (hover, foco, glow) |
| `--lp-text` | título e textos principais |
| `--lp-muted` | bio e textos secundários |
| `--lp-link-bg` / `--lp-link-fg` | fundo e texto dos botões |
| `--lp-link-border` | borda dos botões |
| `--lp-link-radius` | raio dos botões |
| `--lp-link-shadow` | sombra dos botões no hover |
| `--lp-link-justify` / `--lp-link-text-align` | alinhamento (vem do `theme`) |
| `--lp-social-fg` | ícones de redes (vem do `theme`; senão `--lp-muted`) |

Componente novo de bloco consome essas variáveis, sempre com fallback. Assim
funciona em todos os templates, inclusive nos futuros, sem saber qual é.
