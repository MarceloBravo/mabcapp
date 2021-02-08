import { Menu } from '../menus/menu';
export class Pantalla {
  id?: number;
  nombre!: string;
  menus_id!: number;
  menu?: string;
  url?: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?:Date;
}
