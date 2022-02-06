<!-- Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7Gdixk0dt -->
<br/>
Estimado {{ $usuario['name'] }} {{ $usuario['a_paterno']}} {{ $usuario['a_materno']}}
<br/>
Seleccione el siguiente link para reestablecer su contraseña
<br/>
{{ $url }}
<br/>
Este correo ha sido enviado automáticamente, por favor no responder.
<br/>
Gracias
<br/>
Este correo ha sido enviado por:
<br/>
{{ $tienda['nombre_tienda']}}
<br/>
Si tiene algún problema o alguna duda puede contactarse a nuestro email : {{ $tienda['email'] }}
<br/>
o a nuestro fono de contacto {{ $tienda['fono_venta'] }}


