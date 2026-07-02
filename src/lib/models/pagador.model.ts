import type { Empresa } from './empresa.model'
import type { EstadoCivil, TipoPersona } from './enums'
import type { PagadorCuenta } from './pagadorCuenta.model'
import type { Transferencia } from './transferencia.model'

export type Pagador = {
  id: number
  cuil: string
  userId: string
  numberId: string
  name: string
  email: string
  pais: string
  telefono: string
  estadoCivil: EstadoCivil
  createdAt: Date
  updatedAt: Date
  verificado: Date
  tipo: TipoPersona
  
  cuentas: PagadorCuenta[]
  transferencias: Transferencia[]
  empresas: Empresa[]
}