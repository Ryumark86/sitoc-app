// =============================================
//  SITOC - Configuración de Bloques y Fotos
// =============================================
//
//  ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR
//  para adaptar el formulario a otro proyecto.
//
//  ESTRUCTURA DE CADA BLOQUE:
//  {
//      bloque: "BLOQUE N: NOMBRE DEL BLOQUE",
//      subtitulos: [
//          {
//              nombre: "Nombre de la subsección",
//              fotos: [
//                  "Descripción foto 1",
//                  "Descripción foto 2",
//                  ...
//              ]
//          },
//          ...más subsecciones
//      ]
//  }
//
//  PARA AGREGAR UN BLOQUE  → copia uno de los objetos y pégalo al final del array (antes del ];)
//  PARA QUITAR UN BLOQUE   → borra el objeto completo del array
//  PARA AGREGAR UNA FOTO   → añade un string al array fotos[] de la subsección correspondiente
//  PARA AGREGAR SUBSECCIÓN → añade un objeto { nombre, fotos[] } al array subtitulos[]
// =============================================

var estructuraBloques = [

    // ── BLOQUE 1 ──────────────────────────────────────────────────────────
    {
        bloque: "BLOQUE 1: INSTALACION DE ANTENAS",
        subtitulos: [
            {
                nombre: "Foto Antena / ODU / RAU",
                fotos: [
                    "Foto linea de vista de la antena",
                    "Foto panoramica de la antena lado derecho",
                    "Foto panoramica de la antena lado izquierdo",
                    "Foto panoramica de la antena lado superior",
                    "Foto panoramica de la antena lado inferior",
                    "Foto panoramica del herraje de la antena",
                    "Foto de la marquilla acrilica de la antena",
                    "Foto de la marquilla acrilica tierras odus",
                    "Foto de la marquilla acrilica cables IF",
                    "Foto de los encintados RX - TX conexion ODUS",
                    "Foto de la conexion y termoencogible cable de tierra"
                ]
            }
        ]
    },

    // ── BLOQUE 2 ──────────────────────────────────────────────────────────
    {
        bloque: "BLOQUE 2: RECORRIDO DEL CABLEADO IF EXTERIOR/INTERIOR",
        subtitulos: [
            {
                nombre: "Panoramica de recorrido a lo largo de la torre Vertical",
                fotos: [
                    "Foto panoramica de conexion cable IF - ODU",
                    "Foto panoramica del recorrido en estructura de la torre",
                    "Foto panoramica de inicio de escalerilla vertical",
                    "Foto panoramica del recorrido escalerilla vertical de la mitad hacia abajo",
                    "Foto panoramica del recorrido escalerilla vertical de la mitad hacia arriba",
                    "Foto panoramica del recorrido escalerilla vertical llegando a la escalerilla horizontal"
                ]
            },
            {
                nombre: "Panoramica de recorrido en escalerilla horizontal",
                fotos: [
                    "Foto panoramica de la curvatura de la escalerilla vertical a horizontal",
                    "Foto panoramica del recorrido escalerilla horizontal - por tramos de escalerilla",
                    "Foto panoramica del recorrido e ingreso a pasamuros / gabinete",
                    "Foto panoramica del recorrido escalerilla interior",
                    "Foto panoramica del recorrido en rack o gabinete and conexion a la IDU",
                    "Foto de las marquillas de los cable IF conectados a la IDU"
                ]
            }
        ]
    },

    // ── BLOQUE 3 ──────────────────────────────────────────────────────────
    {
        bloque: "BLOQUE 3: PDB",
        subtitulos: [
            {
                nombre: "Conexiones PDB",
                fotos: [
                    "Foto panoramica del PDB tapas cerradas",
                    "Foto panoramica del PDB tapas abiertas",
                    "Foto panoramica de los breakers conectados MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion +0v MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion -48v MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion GND MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion hilo de drenaje MAIN/STANDBY"
                ]
            }
        ]
    },

    // ── BLOQUE 4 ──────────────────────────────────────────────────────────
    {
        bloque: "BLOQUE 4: SISTEMA PUESTA DE TIERRA",
        subtitulos: [
            {
                nombre: "Conexion sistema de tierra",
                fotos: [
                    "Foto conexion del cable de tierra en IDU and marquilla de tierra",
                    "Foto conexion del cable de tierra en barraje de tierra and marquilla de tierra",
                    "Foto conexion del cable de tierra de las ODUS en guaya and marquillas acrilicas",
                    "Foto conexion del cable de cable de tierra cables IF en torres/barrajes, encintados and marquillas acrilicas"
                ]
            }
        ]
    },

    // ── BLOQUE 5 ──────────────────────────────────────────────────────────
    {
        bloque: "BLOQUE 5: IDU y MARQUILLADO",
        subtitulos: [
            {
                nombre: "Vistas y marquilla de la IDU",
                fotos: [
                    "Foto panoramica frontal de la IDU",
                    "Foto de la marquilla de la IDU",
                    "Foto panoramica lado derecho de la IDU",
                    "Foto panoramica lado izquierdo de la IDU",
                    "Foto panoramica lado posterior/trasero de la IDU"
                ]
            }
        ]
    }

    // ── AGREGA AQUÍ MÁS BLOQUES SEGÚN EL PROYECTO ─────────────────────────
    // ,
    // {
    //     bloque: "BLOQUE 6: NOMBRE DEL NUEVO BLOQUE",
    //     subtitulos: [
    //         {
    //             nombre: "Nombre subsección",
    //             fotos: [
    //                 "Descripción foto 1",
    //                 "Descripción foto 2"
    //             ]
    //         }
    //     ]
    // }

];
