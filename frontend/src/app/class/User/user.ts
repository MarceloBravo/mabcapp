import { Rol } from "../rol/rol";

export class User {
  id!: number;
  name!: string;
  a_paterno!: string;
  a_materno!: string;
  direccion!: string;
  email!: string;
  email_verified_at?: Date;
  password?: string;
  confirm_password?: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;
  roles!: Rol[];
}
