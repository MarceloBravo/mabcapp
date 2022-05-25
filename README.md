# mabcapp
Tienda online desarrollada en Laravel y node con integración de pagos con WebPay  
## Descripción  
Aplicación web que simula una tienda online, en la cuaal se puedem buscar productos, agregar productos a un carrito de compras, ver detalle de productos, simular pagos utilizando la integración con WebPay (WebPay se encuentra implementado en modo develop, por lo cual al interactuar con webpay no se efectúa ninguna transacción, pero webpay retorna una respuesta que simula una vetnta exitosa o una venta fallida).  
La aplicación también contiene un módulo de administración en el cual se puede agregar, modificar y eliminar productos con sus fotos, modificar la configuración de la página home de la tienda, agregando, modificando o eliminando secciones, además de configurar las imágenes de la merquezina deslizante de la página home. También se puede personalizar el módulo de administración creando usuarios administradores, roles, permisos, configurar los nombres de los menús del módulo de administración, entre otras configuraciones.

## Pasos para probar la aplicación  
1. Clonar aplicación:  
  git clone https://github.com/MarceloBravo/mabcapp.git
  
  ### Preparando el Backend  
2. Ingresar a la carpeta backend de la aplicación:  
  cd mabcapp/backend  
  
3. Instalar dependencias con node y composer:  
    composer install  
    npm install  

4. Actualizar los datos de la base de datos del archivo ***.env*** ubicado en la raíz de la carpeta backed  
    DB_CONNECTION=mysql  
    DB_HOST=localhost  
    DB_PORT=3306  
    DB_DATABASE=nombre_base_de_datos  
    DB_USERNAME=nombre_de_usuario  
    DB_PASSWORD=contraseña_base_de_datos    
   
5. Actualizar los datos de conexión para la base de datos, en el array mysql existente en el archivo ***config/database.php***:    
    (Los principales datos a actualizar son host, database, username y password el resto se deben actualizar sólo de ser necesario)  
    
    'mysql' => [  
            'driver' => 'mysql',  
            'url' => env('DATABASE_URL'),  
            'host' => env('DB_HOST', aquí_va_el_host),  
            'port' => env('DB_PORT', '3306'),  
            'database' => env('DB_DATABASE', 'aquí_va_el_nombre_de_la_base_de_datos'),  
            'username' => env('DB_USERNAME', 'aquí_va_el_nombre_de_usuario_de_la_base_de_datos'),  
            'password' => env('DB_PASSWORD', 'aquí_va_la_contraseña_de_la_base_de_datos'),  
            'unix_socket' => env('DB_SOCKET', ''),  
            'charset' => 'utf8mb4',  
            'collation' => 'utf8mb4_unicode_ci',  
            'prefix' => '',  
            'prefix_indexes' => true,  
            'strict' => true,  
            'engine' => 'InnoDB ROW_FORMAT=DYNAMIC',  
            'options' => extension_loaded('pdo_mysql') ? array_filter([  
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),  
            ]) : [],  
        ],    
    
6. Acceder a la carpeta backend a través de una consola de símbolo de sistemas y generar una clave:  
    php artisan key:generate  
    
7. Copiar la clave obtenida dentro del archivo ***.env*** (la clave debe ir sin comillas):  
    APP_KEY=clave_obtenida_en_el_paso_6 

8. Ejecutar migraciones para crear la base de datos de la aplicación:  
    php artisan migrate  
   
9.  Si tuvieramos que incluir o crear nuevas migraciones utilizaríamos:  
    php artisan migrate:refresh   
    php artisan migrate:fresh     //borra y crea todas las tablas de nuevo
    
    (En caso de fallar las migraciones, abrir un programa gestor de basres de datos compatible con MySql y correr en él el script ***mabc.sql***, existente en la raíz de la aplicación - idealmente utilizar la aplicación Navicat ya que el script fue creado con dicha aplicación)  
    
10. Desde una consola de simbolo de sistemas, ubicarse en la raíz de la carpeta backend y levantar el servidor corriendo el comando:  
    php artisan serve      
    
    
    ### Preparando el Frontend  
11. Ingresar a la carpeta frontend de la aplicación a través de una terminal de símbolo de sistemas e instalar dependencias:  
    cd frontend  
    npm install  
    
12. Editar el archivo ***frontend/src/app/services/constantes/constantes.services.ts*** y configurar las variables endPoint y storageImages apuntando al host del servidor levantado en el paso 9    
    public endPoint = "http://localhost:8000/api/"    //Ruta local de las peticiones al backend  
    public storageImages = "http://localhost:8000/storage/"   //Ruta de almnacenamiento de las imágenes en el backend    
      
    ó  
      
    public endPoint = "http://192.168.xx.xxx:3000/api/"   //Ruta pública de las peticiones al backend  
    public storageImages = "http://192.168.xx.xxx:3000/storage/"    //Ruta de almnacenamiento de las imágenes en el backend    
    
13. Levantar el frontend de la aplicación:   
    ng serve -o
    
    Obs: En caso de desear probar la interacción con WebPay, realizando compras y simulando pagos, el frontend de la aplicación deberá estar corriendo en un host público y no en localhost:  
    ng serve -o --host 192.168.xx.xxx --port 3002    

Obs:  
- El backend de la aplicación fue desarrollado en Laravel 8.15.0  
- El frontend de la aplicación fue desarrollado en:  
    Angular CLI: 11.0.7  
    Node: 16.14.0  
    OS: win32 x64  

    Angular: 11.2.14  
    ... core, router  
    Ivy Workspace: Yes      
 - Para acceder al módulo de administración, se debe seleccionar el menú páginaas->Administración, ubicado en la barra de menús existente en la parte superior de la tienda.   
 - Las credenciales para ingresar al módulo de administración son:  
  usuario: mabc@live.cl  
  password: 123456  
      
Última versión:  
Versión 1.5.0
