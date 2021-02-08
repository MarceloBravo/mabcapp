export class Permisos {
  id?: number;
  roles_id!: number;
  pantallas_id!: number;
  acceder?: boolean =  false;
  crear?: boolean = false;
  modificar?: boolean = false;
  eliminar?: boolean = false;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;
  rol?: string = "";
  pantalla?: string = "";
}
