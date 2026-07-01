<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Termos de Uso · LinkLand' })
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        <Logo to="/" />
        <NuxtLink
          to="/login"
          class="text-sm text-gray-500 transition hover:text-gray-900 dark:hover:text-gray-100"
        >
          Entrar
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <h1>Termos de Uso</h1>
        <p class="lead">
          Última atualização: 30 de junho de 2026
        </p>
        <p>
          Estes Termos de Uso regulam o acesso e a utilização do <strong>LinkLand</strong>
          (disponível em <strong>linkland.me</strong>), plataforma de criação de páginas de links
          operada por:
        </p>
        <ul>
          <li><strong>Responsável:</strong> Johnnick Landim</li>
          <li><strong>CNPJ:</strong> 49.143.393/0001-81</li>
          <li><strong>Localização:</strong> Juiz de Fora – MG, Brasil</li>
          <li><strong>Contato:</strong> <a href="mailto:contato@linkland.me">contato@linkland.me</a></li>
        </ul>
        <p>
          Ao criar uma conta ou usar o LinkLand, você declara que leu, entendeu e concordou com estes
          Termos. Se não concordar, não utilize o serviço.
        </p>

        <hr />

        <h2>1. O Serviço</h2>
        <p>
          O LinkLand é uma plataforma <em>SaaS</em> (Software como Serviço) que permite criar páginas
          pessoais ou profissionais de links — também chamadas de <em>bio links</em> — de forma simples
          e personalizável. A plataforma é acessível via navegador web e não requer instalação.
        </p>

        <h2>2. Elegibilidade</h2>
        <p>Para usar o LinkLand você deve:</p>
        <ul>
          <li>Ter ao menos <strong>18 anos</strong>, ou entre 13 e 17 anos com autorização expressa dos responsáveis legais;</li>
          <li>Ter capacidade legal para celebrar contratos segundo a legislação brasileira;</li>
          <li>Não ter sido suspenso ou excluído da plataforma anteriormente.</li>
        </ul>

        <h2>3. Conta de Usuário</h2>
        <p>
          Ao se registrar, você se compromete a fornecer informações verdadeiras e a mantê-las atualizadas.
          Você é o único responsável pela confidencialidade de suas credenciais (e-mail e senha) e por todas
          as atividades realizadas em sua conta. Em caso de acesso não autorizado, notifique-nos
          imediatamente pelo e-mail <a href="mailto:contato@linkland.me">contato@linkland.me</a>.
        </p>

        <h2>4. Uso Aceitável</h2>
        <p>É expressamente <strong>proibido</strong> utilizar o LinkLand para:</p>
        <ul>
          <li>Publicar conteúdo ilegal, difamatório, obsceno, discriminatório ou que viole direitos de terceiros;</li>
          <li>Distribuir spam, malware, vírus ou realizar phishing;</li>
          <li>Se fazer passar por outra pessoa, marca ou entidade (impersonation);</li>
          <li>Violar direitos de propriedade intelectual de terceiros;</li>
          <li>Coletar dados de outros usuários sem autorização;</li>
          <li>Tentar acessar sistemas, contas ou dados sem autorização;</li>
          <li>Praticar qualquer atividade que prejudique o funcionamento ou a reputação da plataforma.</li>
        </ul>
        <p>
          O LinkLand se reserva o direito de remover conteúdo que viole estas regras e de suspender ou
          encerrar contas infratoras sem aviso prévio em casos graves.
        </p>

        <h2>5. Planos e Pagamento</h2>

        <h3>5.1 Plano Free</h3>
        <p>
          Gratuito, sem necessidade de cartão de crédito, com funcionalidades limitadas conforme descrito
          na plataforma. Pode ser descontinuado ou alterado com aviso prévio de 30 dias.
        </p>

        <h3>5.2 Plano Premium</h3>
        <ul>
          <li><strong>Valor:</strong> R$ 19,90 por mês;</li>
          <li><strong>Cobrança:</strong> mensal, via cartão de crédito, processada pela <strong>Stripe Payments</strong>;</li>
          <li><strong>Renovação:</strong> automática a cada ciclo mensal;</li>
          <li><strong>Acesso:</strong> imediato após confirmação do pagamento.</li>
        </ul>

        <h3>5.3 Falha de Pagamento</h3>
        <p>
          Em caso de falha no pagamento (cartão recusado, limite excedido etc.), enviaremos um e-mail de
          aviso. Se a situação não for regularizada dentro do prazo informado pela operadora de pagamento,
          o acesso às funcionalidades Premium poderá ser suspenso automaticamente.
        </p>

        <h2>6. Cancelamento e Reembolso</h2>

        <h3>6.1 Cancelamento</h3>
        <p>
          Você pode cancelar sua assinatura a qualquer momento pelo <strong>portal de gerenciamento da
          assinatura</strong> acessível em <em>Configurações → Gerenciar assinatura</em>. O cancelamento
          não gera multa ou fidelidade. Após o cancelamento, o acesso Premium permanece ativo até o fim do
          período já pago.
        </p>

        <h3>6.2 Reembolso</h3>
        <p>
          Solicitações de reembolso realizadas em até <strong>7 (sete) dias corridos</strong> após a
          cobrança serão atendidas integralmente. Após esse prazo, não há reembolso proporcional para o
          período já em curso. Para solicitar reembolso, entre em contato pelo e-mail
          <a href="mailto:contato@linkland.me">contato@linkland.me</a> informando o e-mail da
          conta e a data da cobrança.
        </p>

        <h3>6.3 Dados após o Cancelamento</h3>
        <p>
          Ao encerrar o plano Premium, sua conta retorna ao plano Free. Seus dados (páginas e blocos)
          são mantidos, mas o acesso a funcionalidades exclusivas do Premium é bloqueado. Páginas que
          excedam os limites do plano Free não são excluídas, mas podem ser desativadas automaticamente.
        </p>

        <h2>7. Propriedade Intelectual</h2>

        <h3>7.1 Seu Conteúdo</h3>
        <p>
          Você é o titular do conteúdo que cria e publica no LinkLand (textos, imagens, links). Ao
          publicar, você concede ao LinkLand uma licença não exclusiva, gratuita e mundial para exibir
          esse conteúdo exclusivamente nos limites do serviço (ex.: renderizar sua página pública). Essa
          licença é revogada quando você exclui o conteúdo ou encerra sua conta.
        </p>

        <h3>7.2 Nossa Plataforma</h3>
        <p>
          O código-fonte, design, marca, logotipo e funcionalidades do LinkLand são propriedade de
          Johnnick Landim. É proibido copiar, reproduzir, modificar, distribuir ou criar produtos
          derivados sem autorização escrita prévia.
        </p>

        <h2>8. Disponibilidade do Serviço</h2>
        <p>
          O LinkLand é fornecido "como está" (<em>as is</em>). Empreendemos esforços razoáveis para
          manter o serviço disponível, mas não garantimos disponibilidade ininterrupta. Podemos realizar
          manutenções programadas (com aviso) ou de emergência (sem aviso) a qualquer momento.
        </p>

        <h2>9. Limitação de Responsabilidade</h2>
        <p>Na máxima extensão permitida pela legislação brasileira, o LinkLand não se responsabiliza por:</p>
        <ul>
          <li>Perda de dados decorrente de falhas técnicas ou caso fortuito;</li>
          <li>Danos indiretos, lucros cessantes ou perda de oportunidades;</li>
          <li>Conteúdo publicado por usuários em suas páginas públicas;</li>
          <li>Ações de terceiros (ex.: hackers, provedores de hospedagem).</li>
        </ul>

        <h2>10. Alterações nos Termos</h2>
        <p>
          Podemos atualizar estes Termos a qualquer momento. Alterações relevantes serão comunicadas
          por e-mail com pelo menos <strong>15 (quinze) dias</strong> de antecedência. O uso continuado
          do serviço após a entrada em vigor das alterações constitui aceitação dos novos Termos.
        </p>

        <h2>11. Lei Aplicável e Foro</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
          Comarca de <strong>Juiz de Fora – MG</strong> para dirimir quaisquer controvérsias decorrentes
          deste instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
        </p>

        <h2>12. Contato</h2>
        <p>
          Dúvidas sobre estes Termos? Entre em contato pelo e-mail
          <a href="mailto:contato@linkland.me">contato@linkland.me</a>.
        </p>
      </div>
    </main>

    <footer class="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-gray-500 dark:text-gray-400">
        <span>© {{ new Date().getFullYear() }} LinkLand · Johnnick Landim · CNPJ 49.143.393/0001-81</span>
        <div class="flex gap-4">
          <NuxtLink to="/termos" class="hover:text-gray-900 dark:hover:text-gray-100">Termos de Uso</NuxtLink>
          <NuxtLink to="/privacidade" class="hover:text-gray-900 dark:hover:text-gray-100">Privacidade</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
