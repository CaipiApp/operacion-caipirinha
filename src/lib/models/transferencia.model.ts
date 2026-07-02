import type { EstadoPagoTransferencia } from './enums'
import type { Lock } from './lock.model'
import type { Pagador } from './pagador.model'
import type { PagoLink } from './pagoLink.model'

export type Transferencia = {
  id: number
  pagoLinkId: number
  pagadorId: number
  estado: EstadoPagoTransferencia
  errorMsg: string
  createdAt: Date
  updatedAt: Date
   
  pagoLink: PagoLink
  pagador: Pagador
  txLocks: Lock[]
}