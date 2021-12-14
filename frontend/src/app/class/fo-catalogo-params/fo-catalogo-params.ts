import { CatalogoParams } from "src/app/enum/catalogoParams/ordenarPor"

export class FoCatalogoParams {
  marca_id: number | null = null
  catagoria_id: number | null = null
  sub_categoria_id: number | null = null
  productos_por_pagina: number = 12
  ordenar_por: CatalogoParams = CatalogoParams.precio_menor
  rango_precio: object = {desde: 0, hasta: 10000000}
}
