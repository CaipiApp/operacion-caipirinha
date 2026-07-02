import type { Moneda, EstadoPago } from './enums'
import type { PagoLink } from './pagoLink.model'
import type { PagoQr } from './pagoQr.model'


export type Pago = {
  id: number
  estado: EstadoPago
  monedaDestino: Moneda 
  montoDestino: number
  monedaOrigen: Moneda
  createdAt: Date
  updatedAt?: Date  

  pagoLink?: PagoLink
  pagoQr?: PagoQr
}