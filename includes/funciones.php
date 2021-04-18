<?php 

function obtenerServicios () : array {
    try {
        //importar una conexion
        require 'database.php';

        //Escribir codigo sql
        $sql="SELECT * FROM servicio";

        $consulta = mysqli_query($db,$sql); 

        //Arreglo vacio

        $servicios = [];

        //obtener resultados
        $i=0;
        while ($row = mysqli_fetch_assoc($consulta)){
            $servicios[$i]["id"]=$row["id"];
            $servicios[$i]["nombre"]=$row["nombre"];
            $servicios[$i]["precio"]=$row["precio"];

            $i++;
        }
        return $servicios;

/*         echo "<pre>";
        var_dump(json_encode($servicios));
        echo "</pre>"; */

    } catch (\Throwable $th) {
        var_dump($th);
    }
}

obtenerServicios();