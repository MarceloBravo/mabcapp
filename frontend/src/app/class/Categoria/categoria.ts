import { SubCategoria } from "../subCategoria/sub-categoria";

export class Categoria {
  id: number | null = null;
  nombre: string = '';
  src_imagen: string | null = null
  link: string | null = null
  subcategorias: SubCategoria[] = []
  created_at: string = ''
  updated_at: string = ''
  deleted_at?: string
}
