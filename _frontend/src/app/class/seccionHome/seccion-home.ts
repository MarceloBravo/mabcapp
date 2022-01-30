import { Producto } from "../producto/producto"
export class SeccionHome {
  id: number | null = null
  nombre: string = ''
  productos: Producto[] = []
  created_at: string = ''
  updated_at: string = ''
  deleted_at: string| null = null
}
