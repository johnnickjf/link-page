<template>
  <footer class="border-t border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-6xl px-5 py-10">
        <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-xs">
            <Logo to="/" sm />
            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Todos os seus links numa página só — bonita, rápida e brasileira.
            </p>
          </div>

          <div class="flex gap-14 text-sm">
            <nav aria-label="Produto">
              <p class="font-semibold text-gray-900 dark:text-gray-100">Produto</p>
              <ul class="mt-3 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <NuxtLink to="/register" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Criar conta
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/login" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Entrar
                  </NuxtLink>
                </li>
            <li>
              <NuxtLink to="/gamer" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                Para gamers
              </NuxtLink>
            </li>
              </ul>
            </nav>
            <nav aria-label="Links institucionais">
              <p class="font-semibold text-gray-900 dark:text-gray-100">Legal</p>
              <ul class="mt-3 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <NuxtLink to="/termos" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Termos de Uso
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/privacidade" class="transition hover:text-gray-900 dark:hover:text-gray-100">
                    Privacidade
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          class="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-sm text-gray-600 sm:flex-row dark:border-gray-800/80 dark:text-gray-300"
        >
          <span>© {{ new Date().getFullYear() }} LinkLand</span>
          <a
            href="https://trackpath.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rastreado por TrackPath"
            data-gtm-category="rodape"
            data-gtm-action="click_rodape"
            data-gtm-label="TrackPath"
            class="inline-flex items-center gap-1.5 transition hover:text-gray-900 dark:hover:text-gray-100"
          >
            <img
              src="https://trackpath.com.br/assets/logo/favicon.png"
              alt="TrackPath"
              width="16"
              height="16"
              loading="lazy"
              decoding="async"
              class="size-4"
            />
            Rastreado por TrackPath
          </a>
        </div>
      </div>
    </footer>
</template>
