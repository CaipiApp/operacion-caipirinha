import type { LoggedUser } from "./models";

export const paths = [
  {
    root: "/admin/empresas", 
    roles: ['admin']
  },
  {
    root: "/admin/comisiones", 
    roles: ['admin']
  },
  {
    root: "/admin/users",
    roles: ["admin"]
  },
  {
    root: "/admin/configs",
    roles: ["admin"]
  },
  {
    root: "/admin/profile",
    roles: ["admin", "empresa"]
  },
  {
    root: "/admin/cobros",
    roles: ["empresa"]
  },
  {
    root: "/admin/cobros-qr",
    roles: ["empresa"]
  },
  {
    root: "/admin/pagos",
    roles: ["admin"]
  },
  {
    root: "/admin/cuentas",
    roles: ["empresa"]
  },
  {
    root: "/admin/manteca",
    roles: ["admin"]
  }
  ,
  {
    root: "/admin/noticias",
    roles: ["admin"]
  },
   {
    root: "/admin/notificaciones",
    roles: ["admin"]
  }
]


export function canAccess(user: LoggedUser, path: string){
  if(!user) return false;
  const userRoles = user.roles?.map(rol => rol.nombre);
  const ruta = paths.find(ruta => path.startsWith(ruta.root));
  if(!ruta) return false;

  return userRoles?.some(rol => ruta.roles.includes(rol));
}

export function getHomeUrl(user: LoggedUser){
  if(!user) return "/login";
  const userRoles = user.roles?.map(rol => rol.nombre);
  if(userRoles.includes('admin')) return "/admin/empresas";
  return "/admin/cobros"
}