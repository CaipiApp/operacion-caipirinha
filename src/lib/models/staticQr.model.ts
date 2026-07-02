import type { Empresa } from "./empresa.model"

export type StaticQr = {
  id: number
  whiteList: Date
  codeQr: string
  empresaId: number

  createdAt: Date
  updatedAt: Date
  deleteAt: Date

  empresa: Empresa

}