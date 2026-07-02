import type { Cuenta } from "./cuenta.model"
import type { EstadoPagoLink, MedioPago } from "./enums"
import type { Pago } from "./pago.model"
import type { Transferencia } from "./transferencia.model"

export type PagoLink = {
  id: number
  uuid: string
  pagoId: number
 
  medioPago: MedioPago
  estado: EstadoPagoLink

  refCodigo: string
  refConcepto: string
  refArchivo: string
  refNombreCliente: string
  refEmailCliente: string
  refTelefonoCliente: string
  
  createdAt: Date
  expiredAt: Date
  updatedAt: Date

  cuentaId: number

  pago: Pago
  cuenta: Cuenta

  transferencia: Transferencia
}