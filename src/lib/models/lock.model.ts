import type { EstadoLock } from "./enums"
import type { Transferencia } from "./transferencia.model"

export type Lock = {
  id: number
  comision: number
  estado: EstadoLock
  
  // manteca
  cbu: string
  ordernLock: string
  priceLock: number
  blockFeeIn: number
  blockFeeOut: number
  ordenTxLock: string
  expires: number
  // smartpay
  montoUsdt: number
  priceBrl: number
  totalBrl: number
  feeBrl: number
  sendBrl: number
  valueUsd: number

  createdAt: Date
  updatedAt: Date

  transferencia: Transferencia
  operationId: string
}