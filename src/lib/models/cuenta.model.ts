import type { Empresa } from './empresa.model'
import type { Pago } from './pago.model'

export type Cuenta = {
  id: number
  tipo: string
  documentNumber: string
  clave: string
  empresaId: number
  createdAt: Date
  updatedAt?: Date
  deleteAt: Date
  
  pagos: Pago[]
  empresa: Empresa
}