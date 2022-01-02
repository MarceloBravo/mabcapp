export class Despacho {
  id?: number | null
  venta_id: number = 0
  direccion: string = ''
  region: string = ''
  provincia: string = ''
  comuna: string = ''
  ciudad: string = ''
  casa_num: string = ''
  block_num: string = ''
  referencia: string = ''
  shipping_cod: number = 0
  fecha_despacho: string = ''
  created_at: string = ''
  updated_at: string = ''
  deleted_at?: string
}
