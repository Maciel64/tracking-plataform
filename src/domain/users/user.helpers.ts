export const mapRoleToLabel = (role: string): string => {
  const mapper: Record<string, string> = {
    OWNER: "Proprietário",
    ADMIN: "Administrador",
    USER: "Usuário",
  };

  return mapper[role] ?? "Desconhecido";
};

export const mapStatusToLabel = (status: string): string => {
  const mapper: Record<string, string> = {
    ENABLED: "Ativo",
    DISABLED: "Inativo",
    PENDING: "Pendente",
  };

  return mapper[status] ?? "Desconhecido";
};
