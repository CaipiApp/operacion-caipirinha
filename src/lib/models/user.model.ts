import type { Empresa } from './empresa.model';
import type { Pagador } from './pagador.model';
import type { Rol } from './rol.model';

export type User = {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt?: Date
  
  roles: Rol[]
  empresas: Empresa[]
  pagador: Pagador
}