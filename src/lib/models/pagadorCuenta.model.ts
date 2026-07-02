import type { PagadorMoneda } from './enums'
import type { Pagador } from './pagador.model'

export type PagadorCuenta =  {
  id: number         
  manteca_id: string  
  description: string 
  cbu: string         
  bankCode: string    
  bankName: string    
  cvu: boolean
  actualCbu: string   
  accountType: string 
  coin: PagadorMoneda
  pagadorId: number

  pagador: Pagador
}