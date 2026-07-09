export function friendlyErrorMessage(error: unknown, fallback: string): string {
  const status = httpStatus(error);

  if (status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';
  }

  if (status === 401 || status === 403) {
    return 'Seu acesso expirou ou você não tem permissão para esta ação. Saia e entre novamente.';
  }

  const apiMessage = responseMessage(error);
  return apiMessage ? humanize(apiMessage) : fallback;
}

function httpStatus(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
    return error.status;
  }

  return null;
}

function responseMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('error' in error)) {
    return null;
  }

  const body = error.error as { message?: string } | string;

  if (typeof body === 'string') {
    return body;
  }

  return body?.message?.trim() || null;
}

function humanize(message: string): string {
  const normalized = message
    .replace(/\bUsuario\b/g, 'Usuário')
    .replace(/\busuario\b/g, 'usuário')
    .replace(/\bEndereco\b/g, 'Endereço')
    .replace(/\bendereco\b/g, 'endereço')
    .replace(/\bSolicitacao\b/g, 'Solicitação')
    .replace(/\bsolicitacao\b/g, 'solicitação')
    .replace(/\bNao\b/g, 'Não')
    .replace(/\bnao\b/g, 'não')
    .replace(/\binvalido\b/g, 'inválido')
    .replace(/\binvalidos\b/g, 'inválidos')
    .replace(/\bobrigatorio\b/g, 'obrigatório')
    .replace(/\bobrigatoria\b/g, 'obrigatória')
    .replace(/\bconcluidas\b/g, 'concluídas')
    .replace(/\bconcluida\b/g, 'concluída')
    .replace(/\bAracoiaba\b/g, 'Araçoiaba')
    .replace(/\barvores\b/g, 'árvores')
    .replace(/\barvore\b/g, 'árvore')
    .replace(/\bLocalizacao\b/g, 'Localização')
    .replace(/\blocalizacao\b/g, 'localização')
    .trim();

  return normalized.endsWith('.') ? normalized : `${normalized}.`;
}
