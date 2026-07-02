import type { Empresa } from './empresa.model';
import type { Rol } from './rol.model';

export type LoggedUser = {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt?: Date
  empresaId?: number | null
  
  empresas?: Empresa | undefined
  roles: Rol[]
}