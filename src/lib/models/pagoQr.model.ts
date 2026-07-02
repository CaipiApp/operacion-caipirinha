import type { Empresa } from "./empresa.model"
import type { EstadoPagoQr } from "./enums"
import type { Pagador } from "./pagador.model"
import type { PagadorPix } from "./pagadorPix.model"
import type { Pago } from "./pago.model"


export type PagoQr = {
  id: number
  
  estado: EstadoPagoQr
  pagoId: number
  empresaId: number
  pagadorId: number
  pagadorPixId: number

  comision: number

  concepto: string
  referencia: string
  
  // manteca
  ordernLock: string
  priceLock: number
  blockFeeIn: number 
  blockFeeOut: number
  expires: number

  // smartPay
  timeout: string 
  address: string 
  txid: string 
  operationType: string 
  curout: string 
  curbase: string 
  curconv: string 
  curin: string 
  nfe: string 
  user: string 
  remove: string 
  profile: string 

  amount_brl: string //'19.56',
  price_usd: string //'5.9988',
  total_brl: string //'21.41',
  fee_brl: string //'1.85',
  send_usd: string //'3.260650',
  amount_usd: string //'3.260650',
  price_pxusdt: number //1,
  value_pxusdt: string //'3.260650',
  send_pxusdt: string //'3.259916'
  
  operationId: string
  qr: string

  // pagadores address
  fromAddress: string
  toAddress: string

  montoUsdt: number

  createdAt: Date
  updatedAt: Date

  pago: Pago
  empresa: Empresa
  pagador: Pagador
  pagadorPix: PagadorPix
}