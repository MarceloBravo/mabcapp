<!-- Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7Gdixk0dt -->
<br/>
Estimado {{ $cliente['nombres'] }} {{ $cliente['apellido1']}} {{ $cliente['apellido2']}}
<br/>
Gracias por comprar con nosotros
<br/>
El detalle de su orden se muestra mas abajo
<br/>
<br/>
<div style="color: red; font-weidth: bold; font-size: large">
    <h3>Boleta N° : {{ $folio }}</h3>
</div>
Fecha compra = {{ $fecha }}
<br/>
<br/>
<div style="overflow-x: auto;">
---------- Detalle de su orden----------
    <table style="white-space: nowrap">
        <thead>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
        </thead>
        <tbody>
    @foreach ($carrito as $item)
        <tr>
            <td>{{ $item['nombre'] }} </td>
            <td> {{ $item['cantidad'] }} </td>
            <td> $ {{ number_format($item['cantidad'] * $item['precio'],0, ',','.')}}</td>
        </tr>
    @endforeach
        <tr>
            <td></td>
            <td> <b> Total</b></td>
            <td> $ {{ number_format($total,0, ',','.') }}</td>
        </tr>
        </tbody>
    </table>
</div>
<br/>
<br/>
Gracias
<br/>
Nuestra información de contacto es:
<br/>
{{ $tienda['nombre_tienda']}}
<br/>
Fono: {{ $tienda['fono_venta'] }}
<br/>
email : {{ $tienda['email'] }}
<br/>


