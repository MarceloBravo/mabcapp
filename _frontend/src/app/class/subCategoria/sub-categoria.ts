import { Categoria } from "../Categoria/categoria";

export class SubCategoria {
  id: number | null = null;
    nombre: string = '';
    categoria_id: number = 0;
    categoria: Categoria | null = null;
    nombre_categoria: string = '';
    created_at: string = '';
    updated_at: string = '';
    deleted_at: string = '';
}
