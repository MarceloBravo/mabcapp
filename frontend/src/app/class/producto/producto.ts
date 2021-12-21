import { Impuesto } from '../impuesto/impuesto';
import { Categoria } from '../Categoria/categoria';
import { SubCategoria } from '../subCategoria/sub-categoria';
import { Marca } from '../marca/marca';
import { Unidad } from '../Unidad/unidad';
import { ImagenProducto } from '../imagenProducto/imagen-producto';
import { Precio } from '../precio/precio';
import { TallaProducto } from '../tallaProducto/talla-producto';

export class Producto {
  id?: number;
  nombre: string = '';
  descripcion: string = '';
  precio_venta_normal: number = 0;
  precio_costo: number = 0;
  precios: Precio[] = [];
  stock: number = 0;
  descuento_maximo: number = 0;
  unidad_id: number = 0;
  marca_id: number = 0;
  categoria_id: number = 0;
  sub_categoria_id: number = 0;
  foto: File[] = [];
  created_at: string = '';
  updated_at: string = '';
  deleted_at?: string = '';
  imagen_principal: string = '';
  nombre_categoria: string = '';
  nombre_sub_categoria: string = '';
  nombre_marca: string = '';
  nombre_unidad: string = '';

  impuestos: Impuesto[] = [];
  tallas_producto: TallaProducto[] = []
  imagenes: ImagenProducto[] = [];
  categoria: Categoria = new Categoria();
  sub_categoria: SubCategoria = new SubCategoria();
  marca: Marca = new Marca();
  unidad: Unidad = new Unidad();
}
