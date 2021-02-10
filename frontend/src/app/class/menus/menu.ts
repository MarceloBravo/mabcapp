export class Menu {
  id!: number;
  nombre!: string;
  url!: string;
  menu_padre_id?: number;
  posicion!: number;
  grupos_menus_id!: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;
}
