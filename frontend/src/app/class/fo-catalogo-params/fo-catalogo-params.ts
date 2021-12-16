import { OrdenarPor } from '../../enum/catalogoParams/ordenarPor';
export class FoCatalogoParams {
  marca_id: number | null = null
  categoria_id: number | null = null
  sub_categoria_id: number | null = null
  productos_por_pagina: number = 9
  ordenar_por: OrdenarPor = OrdenarPor.precio_menor
  rango_precio: object = {desde: 0, hasta: 10000000}
  filtro: string = ''
}
