import type { Empresa } from "./empresa.model"
import type { Flujos } from "./enums"

export type  EmpresaComision = {
  id: number
  empresaId: number
  flujo: Flujos
  monto: number
  empresa: Empresa
}