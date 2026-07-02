import type { EmpresaComision } from "./empresaComision.model"
import type { Pagador } from "./pagador.model"
import type { StaticQr } from "./staticQr.model"
import type { User } from "./user.model"

export type Empresa = {
  id: number
  nombre: string
  telefono?: string
  direccion?: string
  imagen?: string
  createdAt: Date
  updatedAt?: Date
  apiKey: string
  callbackUrl: string

  usuarios: User[]
  pagadores: Pagador[]
  staticQr: StaticQr
  comisiones: EmpresaComision[]
}