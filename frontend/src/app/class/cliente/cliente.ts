export class Cliente {
    id!: number;
    rut: string = '';
    nombres: string = '';
    apellido1: string = '';
    apellido2?: string = '';
    cod_region: string = '';
    cod_provincia: string = '';
    cod_comuna: string = '';
    ciudad: string = '';
    direccion: string = '';
    password?: string = '';
    confirm_password?: string = '';
    email: string = '';
    fono: string = '';
    foto?: string;
    fotoObject?: File;  //Archivo de imágen
    casa_num: string = '';
    block_num?: string;
    referencia: string = '';
    created_at: string = '';
    updated_at: string = '';
    deleted_at?: string;
}
