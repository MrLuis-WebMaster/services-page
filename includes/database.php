<?php

$db = mysqli_connect('localhost', 'root',"root",'app');

if (!$db) {
    echo "no conecto";
    exit;
} 

/* echo 'conexion corrrecta'; */