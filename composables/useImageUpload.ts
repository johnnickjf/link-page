/**
 * Upload genérico de imagem (multipart) → o back envia ao Cloudinary e devolve
 * a URL absoluta. Usado em fundo de página e bloco de imagem.
 */
export function useImageUpload() {
  const { request } = useApi()

  async function uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const res = await request<{ url: string }>('/upload/image', {
      method: 'POST',
      body: form,
    })
    return res.url
  }

  return { uploadImage }
}
