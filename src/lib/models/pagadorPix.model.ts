import type { PagoQr } from './pagoQr.model'

export type PagadorPix = {
  id: number
  cpf: string
  email: string
  publicAddress: string
  privateKey: string

  pagosQr: PagoQr[]
}