import type { DocType } from './enums'

export type Document = {
  date: string,
  type: DocType,
  status: string,
  comment: string
}