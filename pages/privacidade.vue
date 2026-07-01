<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Política de Privacidade · LinkLand' })
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
        <h1>Política de Privacidade</h1>
        <p class="lead">
          Última atualização: 30 de junho de 2026
        </p>
        <p>
          Esta Política de Privacidade descreve como o <strong>LinkLand</strong> coleta, usa, armazena e
          protege seus dados pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados
          Pessoais (Lei nº 13.709/2018 – LGPD)</strong>.
        </p>
        <p><strong>Controlador dos dados:</strong></p>
        <ul>
          <li><strong>Responsável:</strong> Johnnick Landim</li>
          <li><strong>CNPJ:</strong> 49.143.393/0001-81</li>
          <li><strong>Localização:</strong> Juiz de Fora – MG, Brasil</li>
          <li><strong>E-mail do Encarregado (DPO):</strong> <a href="mailto:contato@linkland.me">contato@linkland.me</a></li>
        </ul>

        <hr />

        <h2>1. Dados que Coletamos</h2>

        <h3>1.1 Dados fornecidos por você</h3>
        <ul>
          <li><strong>Nome e e-mail</strong> — fornecidos no cadastro;</li>
          <li><strong>Senha</strong> — armazenada exclusivamente em formato criptografado (bcrypt); nunca em texto claro;</li>
          <li><strong>Conteúdo das páginas</strong> — título, biografia, links, imagens e configurações visuais que você cria;</li>
          <li><strong>Código de indicação</strong> — opcional, utilizado para aplicar descontos.</li>
        </ul>

        <h3>1.2 Dados coletados automaticamente</h3>
        <ul>
          <li><strong>Endereço IP</strong> e país de acesso;</li>
          <li><strong>Informações do dispositivo e navegador</strong> (User-Agent) para fins de segurança;</li>
          <li><strong>Logs de acesso e erros</strong> para diagnóstico e estabilidade do serviço.</li>
        </ul>

        <h3>1.3 Dados de pagamento</h3>
        <p>
          Pagamentos são integralmente processados pela <strong>Stripe Payments</strong>. O LinkLand
          <strong>não armazena</strong> dados de cartão de crédito (número, CVV, data de validade).
          Apenas os identificadores de cliente (<code>customer_id</code>) e de assinatura
          (<code>subscription_id</code>) gerados pela Stripe são armazenados em nossos sistemas.
        </p>

        <h2>2. Por que Coletamos — Base Legal (LGPD)</h2>
        <table>
          <thead>
            <tr>
              <th>Finalidade</th>
              <th>Base Legal (LGPD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Criar e gerenciar sua conta</td>
              <td>Execução de contrato (art. 7º, V)</td>
            </tr>
            <tr>
              <td>Processar pagamento da assinatura Premium</td>
              <td>Execução de contrato (art. 7º, V)</td>
            </tr>
            <tr>
              <td>Enviar e-mails transacionais (verificação de e-mail, redefinição de senha, confirmação de pagamento)</td>
              <td>Execução de contrato (art. 7º, V)</td>
            </tr>
            <tr>
              <td>Segurança, prevenção a fraudes e abuso</td>
              <td>Legítimo interesse (art. 7º, IX)</td>
            </tr>
            <tr>
              <td>Melhoria e diagnóstico do serviço</td>
              <td>Legítimo interesse (art. 7º, IX)</td>
            </tr>
            <tr>
              <td>Comunicações de marketing e novidades (quando autorizado)</td>
              <td>Consentimento (art. 7º, I)</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Compartilhamento com Terceiros</h2>
        <p>
          Seus dados são compartilhados <strong>apenas</strong> com os fornecedores indispensáveis para
          operar o serviço. Não vendemos, alugamos nem cedemos dados pessoais a terceiros para fins
          comerciais ou de marketing.
        </p>
        <table>
          <thead>
            <tr>
              <th>Fornecedor</th>
              <th>Finalidade</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Stripe</strong></td>
              <td>Processamento de pagamentos e gestão de assinaturas</td>
              <td>EUA</td>
            </tr>
            <tr>
              <td><strong>Cloudinary</strong></td>
              <td>Armazenamento e entrega de imagens (avatares e imagens de blocos)</td>
              <td>EUA</td>
            </tr>
            <tr>
              <td><strong>Resend</strong></td>
              <td>Envio de e-mails transacionais</td>
              <td>EUA</td>
            </tr>
          </tbody>
        </table>
        <p>
          As transferências internacionais para esses fornecedores são realizadas com garantias adequadas
          (Standard Contractual Clauses – SCCs), conforme previsto no art. 33 da LGPD.
        </p>

        <h2>4. Retenção de Dados</h2>
        <ul>
          <li><strong>Dados de conta ativa:</strong> mantidos enquanto a conta existir;</li>
          <li><strong>Após exclusão da conta:</strong> dados pessoais removidos em até 30 dias, ressalvadas obrigações legais (ex.: dados fiscais retidos por 5 anos, conforme legislação tributária brasileira);</li>
          <li><strong>Logs de acesso:</strong> retidos por até 6 meses para fins de segurança e diagnóstico.</li>
        </ul>

        <h2>5. Seus Direitos como Titular (LGPD – art. 18)</h2>
        <p>Você tem direito a, a qualquer momento:</p>
        <ul>
          <li><strong>Confirmar</strong> a existência de tratamento dos seus dados;</li>
          <li><strong>Acessar</strong> os dados pessoais que temos sobre você;</li>
          <li><strong>Corrigir</strong> dados incompletos, inexatos ou desatualizados;</li>
          <li><strong>Anonimizar, bloquear ou eliminar</strong> dados desnecessários ou excessivos;</li>
          <li><strong>Solicitar portabilidade</strong> dos seus dados para outro serviço;</li>
          <li><strong>Eliminar</strong> dados tratados com base no seu consentimento;</li>
          <li><strong>Revogar</strong> o consentimento que você tenha dado;</li>
          <li><strong>Opor-se</strong> a tratamentos que violem a LGPD;</li>
          <li><strong>Solicitar informações</strong> sobre com quem seus dados são compartilhados.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, envie um e-mail para
          <a href="mailto:contato@linkland.me">contato@linkland.me</a> com o assunto
          <em>"Direitos do Titular – LGPD"</em>. Responderemos em até <strong>15 dias úteis</strong>.
        </p>
        <p>
          Você também pode excluir sua conta diretamente em <em>Configurações → Excluir conta</em> na
          plataforma.
        </p>

        <h2>6. Cookies</h2>
        <p>Utilizamos apenas <strong>cookies essenciais</strong> para:</p>
        <ul>
          <li>Manter sua sessão autenticada (token JWT armazenado localmente);</li>
          <li>Lembrar preferências básicas de interface.</li>
        </ul>
        <p>
          <strong>Não utilizamos</strong> cookies de rastreamento, publicidade ou de terceiros (como
          Google Analytics ou Meta Pixel).
        </p>

        <h2>7. Segurança</h2>
        <p>Adotamos as seguintes medidas técnicas para proteger seus dados:</p>
        <ul>
          <li>Senhas armazenadas com <strong>bcrypt</strong> (hash + salt individual por senha);</li>
          <li>Toda comunicação entre navegador e servidor via <strong>HTTPS/TLS</strong>;</li>
          <li>Autenticação via <strong>tokens JWT</strong> com tempo de expiração;</li>
          <li>Acesso ao banco de dados restrito a sistemas internos autorizados;</li>
          <li>Credenciais de serviços externos gerenciadas via variáveis de ambiente, nunca expostas no código.</li>
        </ul>
        <p>
          Nenhum sistema é 100% seguro. Em caso de incidente de segurança que afete seus dados, você
          será notificado por e-mail no prazo legal.
        </p>

        <h2>8. Transferência Internacional de Dados</h2>
        <p>
          Alguns de nossos fornecedores (Stripe, Cloudinary, Resend) têm infraestrutura nos Estados
          Unidos. Essas transferências são realizadas em conformidade com o art. 33 da LGPD, mediante
          garantias contratuais adequadas (SCCs — Standard Contractual Clauses adotadas pela Comissão
          Europeia e reconhecidas como mecanismo válido).
        </p>

        <h2>9. Encarregado pelo Tratamento de Dados (DPO)</h2>
        <p>
          Conforme o art. 41 da LGPD, o encarregado pelo tratamento de dados pessoais do LinkLand é:
        </p>
        <ul>
          <li><strong>Nome:</strong> Johnnick Landim</li>
          <li><strong>E-mail:</strong> <a href="mailto:contato@linkland.me">contato@linkland.me</a></li>
        </ul>

        <h2>10. Alterações nesta Política</h2>
        <p>
          Esta Política pode ser atualizada periodicamente. A versão vigente estará sempre disponível
          nesta página, com a data da última atualização. Alterações relevantes serão comunicadas por
          e-mail com antecedência mínima de <strong>15 dias</strong>.
        </p>

        <h2>11. Contato e Reclamações</h2>
        <p>
          Para dúvidas, solicitações ou reclamações relacionadas à sua privacidade:
        </p>
        <ul>
          <li><strong>E-mail:</strong> <a href="mailto:contato@linkland.me">contato@linkland.me</a></li>
        </ul>
        <p>
          Caso não obtenha resposta satisfatória, você também pode contatar a
          <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">www.gov.br/anpd</a>.
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
