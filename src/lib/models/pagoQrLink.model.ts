import type { Empresa } from "./empresa.model"
import type { PagoQr } from "./pagoQr.model"


export type PagoQrLink = {
  id: number
  uuid: string
  monto: number
  concepto: string
  pagoQrId: number
  empresaId: number

  pagoQr?: PagoQr
  empresa?: Empresa
}