export type UserRole =
  | "admin"
  | "juridico"
  | "tecnologia"
  | "santa_catarina"
  | "pedagogico"
  | "operacoes_locais"
  | "relacoes_publicas"
  | "administrativo_financeiro"
  | "viewer";

export function isAdmin(role?: string): boolean {
  return role === "admin";
}

export function canAccessPage(role: string | undefined, page: string): boolean {
  if (isAdmin(role)) return true;

  const alwaysAllowed = [
    "/dashboard",
    "/timeline",
    "/organograma",
    "/contratacoes",
    "/associados",
    "/documentos",
    "/etec",
    "/workstreams",
  ];
  if (alwaysAllowed.some((p) => page.startsWith(p))) return true;

  if (page.startsWith("/juridico")) return role === "juridico";
  if (page.startsWith("/santa-catarina")) return role === "santa_catarina";

  return false;
}
