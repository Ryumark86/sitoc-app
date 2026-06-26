// =============================================
//  SITOC - Lógica de Inspección de Campo
// =============================================

var estructuraBloques = [
    {
        bloque: "BLOQUE 1: INSTALACION DE ANTENAS",
        subtitulos: [
            {
                nombre: "Foto Antena / ODU / RAU",
                fotos: [
                    "Foto linea de vista de la antena", "Foto panoramica de la antena lado derecho",
                    "Foto panoramica de la antena lado izquierdo", "Foto panoramica de la antena lado superior",
                    "Foto panoramica de la antena lado inferior", "Foto panoramica del herraje de la antena",
                    "Foto de la marquilla acrilica de la antena", "Foto de la marquilla acrilica tierras odus",
                    "Foto de la marquilla acrilica cables IF", "Foto de los encintados RX - TX conexion ODUS",
                    "Foto de la conexion y termoencogible cable de tierra"
                ]
            }
        ]
    },
    {
        bloque: "BLOQUE 2: RECORRIDO DEL CABLEADO IF EXTERIOR/INTERIOR",
        subtitulos: [
            {
                nombre: "Panoramica de recorrido a lo largo de la torre Vertical",
                fotos: [
                    "Foto panoramica de conexion cable IF - ODU", "Foto panoramica del recorrido en estructura de la torre",
                    "Foto panoramica de inicio de escalerilla vertical", "Foto panoramica del recorrido escalerilla vertical de la mitad hacia abajo",
                    "Foto panoramica del recorrido escalerilla vertical de la mitad hacia arriba", "Foto panoramica del recorrido escalerilla vertical llegando a la escalerilla horizontal"
                ]
            },
            {
                nombre: "Panoramica de recorrido en escalerilla horizontal",
                fotos: [
                    "Foto panoramica de la curvatura de la escalerilla vertical a horizontal", "Foto panoramica del recorrido escalerilla horizontal - por tramos de escalerilla",
                    "Foto panoramica del recorrido e ingreso a pasamuros / gabinete", "Foto panoramica del recorrido escalerilla interior",
                    "Foto panoramica del recorrido en rack o gabinete and conexion a la IDU", "Foto de las marquillas de los cable IF conectados a la IDU"
                ]
            }
        ]
    },
    {
        bloque: "BLOQUE 3: PDB",
        subtitulos: [
            {
                nombre: "Conexiones PDB",
                fotos: [
                    "Foto panoramica del PDB tapas cerradas", "Foto panoramica del PDB tapas abiertas",
                    "Foto panoramica de los breakers conectados MAIN/STANDBY", "Foto panoramica de la marquilla and conexion +0v MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion -48v MAIN/STANDBY", "Foto panoramica de la marquilla and conexion GND MAIN/STANDBY",
                    "Foto panoramica de la marquilla and conexion hilo de drenaje MAIN/STANDBY"
                ]
            }
        ]
    },
    {
        bloque: "BLOQUE 4: SISTEMA PUESTA DE TIERRA",
        subtitulos: [
            {
                nombre: "Conexion sistema de tierra",
                fotos: [
                    "Foto conexion del cable de tierra en IDU and marquilla de tierra", "Foto conexion del cable de tierra en barraje de tierra and marquilla de tierra",
                    "Foto conexion del cable de tierra de las ODUS en guaya and marquillas acrilicas", "Foto conexion del cable de cable de tierra cables IF en torres/barrajes, encintados and marquillas acrilicas"
                ]
            }
        ]
    },
    {
        bloque: "BLOQUE 5: IDU y MARQUILLADO",
        subtitulos: [
            {
                nombre: "Conexion sistema de tierra",
                fotos: [
                    "Foto panoramica frontal de la IDU", "Foto de la marquilla de la IDU",
                    "Foto panoramica lado derecho de la IDU", "Foto panoramica lado izquierdo de la IDU",
                    "Foto panoramica lado posterior/trasero de la IDU"
                ]
            }
        ]
    }
];

var almacenamientoReporte = {};
var contenedor = document.getElementById("formularioContenedor");
var contadorInput = 0;
var gpsActual = { lat: "PENDIENTE", lon: "PENDIENTE" };
var azimutActual = "0° N";

// --- Fecha inicial ---
document.getElementById('txtDiaActividad').value = new Date().toISOString().split('T')[0];

// --- Brújula / Orientación ---
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientationabsolute", manejarOrientacion, true);
    window.addEventListener("deviceorientation", manejarOrientacion, true);
}

function manejarOrientacion(e) {
    var grados = e.webkitCompassHeading || e.alpha;
    if (e.absolute === true || e.webkitCompassHeading) { grados = e.webkitCompassHeading || (360 - e.alpha); }
    if (grados !== null && grados !== undefined) {
        var gradosDireccion = Math.round(grados);
        if (gradosDireccion < 0) gradosDireccion += 360;
        gradosDireccion = gradosDireccion % 360;
        var cardinal = "N";
        if (gradosDireccion >= 23 && gradosDireccion < 68) cardinal = "NE";
        else if (gradosDireccion >= 68 && gradosDireccion < 113) cardinal = "E";
        else if (gradosDireccion >= 113 && gradosDireccion < 158) cardinal = "SE";
        else if (gradosDireccion >= 158 && gradosDireccion < 203) cardinal = "S";
        else if (gradosDireccion >= 203 && gradosDireccion < 248) cardinal = "SO";
        else if (gradosDireccion >= 248 && gradosDireccion < 293) cardinal = "O";
        else if (gradosDireccion >= 293 && gradosDireccion < 338) cardinal = "NO";
        azimutActual = gradosDireccion + "° " + cardinal;
    }
}

// --- Base de Datos Local (IndexedDB) ---
var dbLocal = null;
var peticionDB = indexedDB.open("SITOC_Offline_DB", 1);
peticionDB.onupgradeneeded = function(e) {
    dbLocal = e.target.result;
    if (!dbLocal.objectStoreNames.contains("borradores")) {
        dbLocal.createObjectStore("borradores", { keyPath: "idClaveCompuesta" });
    }
};
peticionDB.onsuccess = function(e) {
    dbLocal = e.target.result;
    actualizarContadorBorradoresOffline();
    verificarYAutocargarUltimaSesion();
};

// --- 1. CONSTRUCCIÓN DEL FORMULARIO ---
function inicializarConstruccionFormulario() {
    contenedor.innerHTML = "";
    contadorInput = 0;

    for (var i = 0; i < estructuraBloques.length; i++) {
        var b = estructuraBloques[i];
        var divBloque = document.createElement("div");
        divBloque.className = "bloque";
        divBloque.setAttribute("id", "bloque_container_" + i);

        var cabecera = document.createElement("div");
        cabecera.className = "cabecera-bloque";
        cabecera.setAttribute("data-bloque-idx", i);

        var h3 = document.createElement("h3");
        h3.className = "titulo-bloque";
        h3.textContent = b.bloque;

        var badge = document.createElement("span");
        badge.className = "status-badge";
        badge.setAttribute("id", "badge_bloque_" + i);
        badge.textContent = "Calculando...";

        cabecera.appendChild(h3);
        cabecera.appendChild(badge);
        divBloque.appendChild(cabecera);

        var divContenido = document.createElement("div");
        divContenido.className = "contenido-bloque";
        var mapeoInputsDelBloque = [];

        for (var j = 0; j < b.subtitulos.length; j++) {
            var sub = b.subtitulos[j];
            var divSubt = document.createElement("div");
            divSubt.className = "subtitulo-seccion";
            divSubt.textContent = sub.nombre;
            divContenido.appendChild(divSubt);

            for (var k = 0; k < sub.fotos.length; k++) {
                var fotoTexto = sub.fotos[k];
                var bNum = b.bloque.split(' ')[1] ? b.bloque.split(' ')[1].replace(/[^0-9]/g, '') : "0";
                var nombreBaseSITOC = "B" + bNum + "_" + fotoTexto.replace(/[^a-zA-Z0-9]/g, "_");

                if (!almacenamientoReporte[contadorInput]) {
                    almacenamientoReporte[contadorInput] = {
                        nombreBase: nombreBaseSITOC, noAplica: false, archivos: [], bloquePertenece: i
                    };
                }
                mapeoInputsDelBloque.push(contadorInput);

                var divFoto = document.createElement("div");
                divFoto.className = "foto-item";
                divFoto.setAttribute("id", "item_bloque_" + contadorInput);

                var label = document.createElement("label");
                label.textContent = "📋 " + fotoTexto;
                divFoto.appendChild(label);

                var divBotonera = document.createElement("div");
                divBotonera.className = "botonera";

                var btnCam = document.createElement("button");
                btnCam.type = "button"; btnCam.className = "btn-opcion btn-camara"; btnCam.innerHTML = "📸 Tomar Foto"; btnCam.setAttribute("data-id", contadorInput);
                var btnGal = document.createElement("button");
                btnGal.type = "button"; btnGal.className = "btn-opcion btn-galeria"; btnGal.innerHTML = "🖼️ Desde Galería"; btnGal.setAttribute("data-id", contadorInput);
                var btnNA = document.createElement("button");
                btnNA.type = "button"; btnNA.className = "btn-opcion btn-na"; btnNA.innerHTML = "🚫 No Aplica"; btnNA.setAttribute("data-id", contadorInput);

                divBotonera.appendChild(btnCam); divBotonera.appendChild(btnGal); divBotonera.appendChild(btnNA); divFoto.appendChild(divBotonera);

                var divLista = document.createElement("div");
                divLista.className = "lista-archivos"; divLista.setAttribute("id", "lista_archivos_" + contadorInput);
                var txtSin = document.createElement("span"); txtSin.className = "sin-archivos"; txtSin.textContent = "Ninguna fotografía capturada";
                divLista.appendChild(txtSin); divFoto.appendChild(divLista);

                var inCam = document.createElement("input"); inCam.type = "file"; inCam.accept = "image/*"; inCam.setAttribute("capture", "environment"); inCam.className = "input-oculto"; inCam.setAttribute("id", "transit_cam_" + contadorInput);
                var inGal = document.createElement("input"); inGal.type = "file"; inGal.accept = "image/*"; inGal.className = "input-oculto"; inGal.setAttribute("id", "transit_gal_" + contadorInput);

                divFoto.appendChild(inCam); divFoto.appendChild(inGal); divContenido.appendChild(divFoto);

                btnCam.onclick = function() { var id = this.getAttribute("data-id"); if (validarCamposIniciales()) capturarUbicacionYDisparar(id, "transit_cam_"); };
                btnGal.onclick = function() { var id = this.getAttribute("data-id"); if (validarCamposIniciales()) capturarUbicacionYDisparar(id, "transit_gal_"); };

                inCam.onchange = function() { var id = this.id.split("_")[2]; if (this.files.length > 0) { procesarFotoCanvasPro(id, this.files[0]); this.value = ""; } };
                inGal.onchange = function() { var id = this.id.split("_")[2]; if (this.files.length > 0) { procesarFotoCanvasPro(id, this.files[0]); this.value = ""; } };

                btnNA.onclick = function() {
                    var id = this.getAttribute("data-id");
                    var contenedorItem = document.getElementById("item_bloque_" + id);
                    var btnCamara = contenedorItem.querySelector(".btn-camara");
                    var btnGaleria = contenedorItem.querySelector(".btn-galeria");
                    contenedorItem.classList.remove("incompleto");

                    if (almacenamientoReporte[id].noAplica) {
                        almacenamientoReporte[id].noAplica = false; this.innerHTML = "🚫 No Aplica"; this.classList.remove("activo");
                        contenedorItem.className = "foto-item"; btnCamara.disabled = false; btnGaleria.disabled = false;
                    } else {
                        almacenamientoReporte[id].noAplica = true; almacenamientoReporte[id].archivos = []; this.classList.add("activo"); this.innerHTML = "🚫 No Aplica ✓";
                        contenedorItem.className = "foto-item no-aplica"; btnCamara.disabled = true; btnGaleria.disabled = true;
                    }
                    actualizarListaVisual(id);
                };
                contadorInput++;
            }
        }

        divBloque.setAttribute("data-inputs-mapeados", JSON.stringify(mapeoInputsDelBloque));
        contenedor.appendChild(divBloque);

        var divAccionesBloque = document.createElement("div"); divAccionesBloque.style.padding = "10px 0 5px 0";
        var btnGuardarBloque = document.createElement("button"); btnGuardarBloque.type = "button"; btnGuardarBloque.className = "btn-opcion";
        btnGuardarBloque.style.backgroundColor = "#00875a"; btnGuardarBloque.style.color = "white"; btnGuardarBloque.style.width = "100%"; btnGuardarBloque.style.padding = "12px";
        btnGuardarBloque.innerHTML = "💾 Guardar Avance de este Bloque"; btnGuardarBloque.setAttribute("data-bloque-idx", i);
        btnGuardarBloque.onclick = function() { var idx = this.getAttribute("data-bloque-idx"); guardarAvanceParcialBloque(idx); };

        divAccionesBloque.appendChild(btnGuardarBloque); divContenido.appendChild(divAccionesBloque);
        divBloque.appendChild(divContenido); contenedor.appendChild(divBloque);

        cabecera.onclick = function() {
            var idx = this.getAttribute("data-bloque-idx");
            document.getElementById("bloque_container_" + idx).classList.toggle("abierto");
        };
        auditarProgresoBloque(i);
    }
}

// --- 2. VALIDACIÓN DE CAMPOS ---
function validarCamposIniciales() {
    var sitio = document.getElementById("txtNombreSitio").value.trim();
    if (!sitio) { alert("Atención:\nPrimero debes llenar el 'Nombre del sitio' arriba para poder generar las marcas de agua."); return false; }
    return true;
}

// --- 3. AUDITORÍA DE PROGRESO POR BLOQUE ---
function auditarProgresoBloque(bloqueIdx) {
    var contenedorBloque = document.getElementById("bloque_container_" + bloqueIdx);
    var badgeBloque = document.getElementById("badge_bloque_" + bloqueIdx);
    if (!contenedorBloque || !badgeBloque) return;

    var idsMapeados = JSON.parse(contenedorBloque.getAttribute("data-inputs-mapeados"));
    var totalItemsRequeridos = idsMapeados.length;
    var listosContador = 0;

    for (var m = 0; m < idsMapeados.length; m++) {
        var idInput = idsMapeados[m];
        var itemMemoria = almacenamientoReporte[idInput];
        if (itemMemoria && (itemMemoria.noAplica || itemMemoria.archivos.length > 0)) { listosContador++; }
    }

    if (listosContador === totalItemsRequeridos) {
        badgeBloque.className = "status-badge completo"; badgeBloque.textContent = "✓ COMPLETO";
    } else {
        badgeBloque.className = "status-badge"; badgeBloque.textContent = "FALTAN " + (totalItemsRequeridos - listosContador);
    }
}

// --- 4. CAPTURA DE GPS Y DISPARO DE INPUT ---
function capturarUbicacionYDisparar(id, prefijoInput) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            gpsActual.lat = pos.coords.latitude.toFixed(5);
            gpsActual.lon = pos.coords.longitude.toFixed(5);
            document.getElementById(prefijoInput + id).click();
        }, function(err) {
            gpsActual.lat = "SIN GPS";
            gpsActual.lon = "SIN GPS";
            document.getElementById(prefijoInput + id).click();
        }, { enableHighAccuracy: true, timeout: 5000 });
    } else {
        gpsActual.lat = "NO SOPORTADO";
        gpsActual.lon = "NO SOPORTADO";
        document.getElementById(prefijoInput + id).click();
    }
}

// --- 5. PROCESAMIENTO DE FOTO CON MARCA DE AGUA ---
function procesarFotoCanvasPro(id, archivoOriginal) {
    var estado = document.getElementById("estado");
    var sitioTexto = document.getElementById("txtNombreSitio").value.trim().toUpperCase();
    var fechaTexto = document.getElementById("txtDiaActividad").value;
    var horaTexto = new Date().toTimeString().split(' ')[0];

    var txtIzquierdo = "SITIO: " + sitioTexto + " | " + fechaTexto + " " + horaTexto;
    var txtDerecho = "LAT: " + gpsActual.lat + " | LON: " + gpsActual.lon + " | AZIMUT: " + azimutActual;

    estado.style.display = "block"; estado.className = "info"; estado.textContent = "Inyectando telemetría GPS, Brújula y Full HD...";

    var lector = new FileReader();
    lector.readAsDataURL(archivoOriginal);
    lector.onload = function(evento) {
        var img = new Image(); img.src = evento.target.result;
        img.onload = function() {
            var canvas = document.createElement("canvas"); var ctx = canvas.getContext("2d");
            var MAX_ANCHO = 1920; var MAX_ALTO = 1080;
            var anchoFinal = img.width; var altoFinal = img.height;

            if (anchoFinal > altoFinal) { if (anchoFinal > MAX_ANCHO) { altoFinal *= MAX_ANCHO / anchoFinal; anchoFinal = MAX_ANCHO; } }
            else { if (altoFinal > MAX_ALTO) { anchoFinal *= MAX_ALTO / altoFinal; altoFinal = MAX_ALTO; } }

            canvas.width = anchoFinal; canvas.height = altoFinal;
            ctx.drawImage(img, 0, 0, anchoFinal, altoFinal);

            var tamanoFuente = Math.round(canvas.width * 0.016); if (tamanoFuente < 14) tamanoFuente = 14;
            ctx.font = "bold " + tamanoFuente + "px 'Courier New', Courier, monospace";

            var altoLinea = tamanoFuente * 1.5; var altoCajaTotal = altoLinea * 2; var yPosCaja = canvas.height - altoCajaTotal;

            ctx.fillStyle = "rgba(0, 0, 0, 0.55)"; ctx.fillRect(0, yPosCaja, canvas.width, altoCajaTotal);
            ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";

            var yPosLinea1 = yPosCaja + (altoLinea / 2);
            ctx.strokeText(txtIzquierdo, canvas.width * 0.02, yPosLinea1); ctx.fillStyle = "#FFFFFF"; ctx.fillText(txtIzquierdo, canvas.width * 0.02, yPosLinea1);

            var yPosLinea2 = yPosCaja + altoLinea + (altoLinea / 2);
            ctx.strokeText(txtDerecho, canvas.width * 0.02, yPosLinea2); ctx.fillStyle = "#FFFFFF"; ctx.fillText(txtDerecho, canvas.width * 0.02, yPosLinea2);

            canvas.toBlob(function(blob) {
                var base64Optimizado = canvas.toDataURL("image/jpeg", 0.85);
                var fotoOptimizada = new File([blob], archivoOriginal.name, { type: "image/jpeg", lastModified: Date.now() });

                almacenamientoReporte[id].archivos.push({ file: fotoOptimizada, previewUrl: base64Optimizado, originalBackupUrl: base64Optimizado });
                document.getElementById("item_bloque_" + id).classList.remove("incompleto");
                actualizarListaVisual(id);
                estado.style.display = "none";
            }, "image/jpeg", 0.85);
        };
    };
}

// --- 6. ACTUALIZACIÓN VISUAL DE LA LISTA DE ARCHIVOS ---
function actualizarListaVisual(id) {
    var divLista = document.getElementById("lista_archivos_" + id); if (!divLista) return;
    divLista.innerHTML = "";
    var itemMemoria = almacenamientoReporte[id];

    if (itemMemoria.noAplica) {
        divLista.innerHTML = '<span class="sin-archivos" style="color:#bf2600;">Descartado por No Aplica</span>';
        if (almacenamientoReporte[id]) { auditarProgresoBloque(almacenamientoReporte[id].bloquePertenece); }
        return;
    }
    if (itemMemoria.archivos.length === 0) {
        divLista.innerHTML = '<span class="sin-archivos">Ninguna fotografía capturada</span>';
        if (almacenamientoReporte[id]) { auditarProgresoBloque(almacenamientoReporte[id].bloquePertenece); }
        return;
    }

    for (var idx = 0; idx < itemMemoria.archivos.length; idx++) {
        var dataFoto = itemMemoria.archivos[idx];
        var sufijo = itemMemoria.archivos.length > 1 ? "_" + (idx + 1) : "";
        var nombreFormateadoFinal = itemMemoria.nombreBase + sufijo + ".jpg";

        var badge = document.createElement("div"); badge.className = "archivo-badge";
        var divInfo = document.createElement("div"); divInfo.className = "preview-info";

        var imgThumb = document.createElement("img");
        imgThumb.className = "img-miniatura"; imgThumb.src = dataFoto.previewUrl;
        imgThumb.setAttribute("data-id", id); imgThumb.setAttribute("data-index", idx);

        imgThumb.onclick = function() { cargarVisorConEdicionDibujo(this.getAttribute("data-id"), this.getAttribute("data-index")); };

        var txtLabel = document.createElement("span");
        txtLabel.innerHTML = nombreFormateadoFinal + "<br><small style='color:#6b778c;'>🔍 Tap para Lupa / Dibujar</small>";
        divInfo.appendChild(imgThumb); divInfo.appendChild(txtLabel); badge.appendChild(divInfo);

        var btnDel = document.createElement("button"); btnDel.type = "button"; btnDel.className = "btn-eliminar"; btnDel.innerHTML = "&times;";
        btnDel.setAttribute("data-id", id); btnDel.setAttribute("data-index", idx);
        btnDel.onclick = function() {
            var itemId = this.getAttribute("data-id"); var fileIdx = parseInt(this.getAttribute("data-index"));
            almacenamientoReporte[itemId].archivos.splice(fileIdx, 1); actualizarListaVisual(itemId);
        };
        badge.appendChild(btnDel); divLista.appendChild(badge);
    }
    if (almacenamientoReporte[id]) { auditarProgresoBloque(almacenamientoReporte[id].bloquePertenece); }
}

// --- 7. VISOR / EDITOR DE IMÁGENES ---
var currentEditId = null;
var currentEditIdx = null;
var vCanvas = document.getElementById("canvasEdicion");
var vCtx = vCanvas.getContext("2d");
var modoOperativoVisor = "LUPA";
var dibujando = false;
var imagenRespaldoLimpia = new Image();

function cargarVisorConEdicionDibujo(id, index) {
    currentEditId = id; currentEditIdx = parseInt(index);
    var dataFoto = almacenamientoReporte[id].archivos[currentEditIdx];
    imagenRespaldoLimpia = new Image(); imagenRespaldoLimpia.src = dataFoto.previewUrl;
    imagenRespaldoLimpia.onload = function() {
        vCanvas.width = imagenRespaldoLimpia.width; vCanvas.height = imagenRespaldoLimpia.height;
        vCtx.drawImage(imagenRespaldoLimpia, 0, 0);
        cambiarModoVisor("LUPA");
        document.getElementById("visorFlotante").style.display = "flex";
    };
}

function cambiarModoVisor(nuevoModo) {
    modoOperativoVisor = nuevoModo;
    var btnM = document.getElementById("btnModoDibujo");
    var btnB = document.getElementById("btnBorrador");
    var btnG = document.getElementById("btnGuardarDibujo");
    btnM.style.backgroundColor = "#0052cc"; btnM.textContent = "✏️ Marcador";
    btnB.style.backgroundColor = "#42526e"; btnB.textContent = "🧽 Borrador";
    btnG.style.display = "inline-block";

    if (modoOperativoVisor === "LUPA") { btnG.style.display = "none"; }
    else if (modoOperativoVisor === "MARCADOR") { btnM.style.backgroundColor = "#bf2600"; btnM.textContent = "✏️ Marcando"; }
    else if (modoOperativoVisor === "BORRADOR") { btnB.style.backgroundColor = "#ff9900"; btnB.textContent = "🧽 Borrando"; }
}

function obtenerCoordenadasCanvas(e) {
    var rect = vCanvas.getBoundingClientRect();
    var clienteX = e.touches ? e.touches[0].clientX : e.clientX;
    var clienteY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clienteX - rect.left) * (vCanvas.width / rect.width), y: (clienteY - rect.top) * (vCanvas.height / rect.height) };
}

function iniciarTrazo(e) { if (modoOperativoVisor === "LUPA") return; dibujando = true; var coords = obtenerCoordenadasCanvas(e); vCtx.beginPath(); vCtx.moveTo(coords.x, coords.y); e.preventDefault(); }
function moverTrazo(e) {
    if (!dibujando || modoOperativoVisor === "LUPA") return;
    var coords = obtenerCoordenadasCanvas(e);
    if (modoOperativoVisor === "MARCADOR") {
        vCtx.lineTo(coords.x, coords.y); vCtx.strokeStyle = "#FF0000"; vCtx.lineWidth = Math.round(vCanvas.width * 0.006 || 5);
        vCtx.lineCap = "round"; vCtx.lineJoin = "round"; vCtx.stroke();
    } else if (modoOperativoVisor === "BORRADOR") {
        var radioBorrador = Math.round(vCanvas.width * 0.02 || 20);
        vCtx.save(); vCtx.beginPath(); vCtx.arc(coords.x, coords.y, radioBorrador, 0, Math.PI * 2); vCtx.clip();
        vCtx.drawImage(imagenRespaldoLimpia, 0, 0); vCtx.restore();
    }
    e.preventDefault();
}
function detenerTrazo() { dibujando = false; }

vCanvas.addEventListener("mousedown", iniciarTrazo);
vCanvas.addEventListener("mousemove", moverTrazo);
window.addEventListener("mouseup", detenerTrazo);
vCanvas.addEventListener("touchstart", iniciarTrazo, { passive: false });
vCanvas.addEventListener("touchmove", moverTrazo, { passive: false });
vCanvas.addEventListener("touchend", detenerTrazo);

function guardarTrazosDibujo() {
    vCanvas.toBlob(function(blob) {
        var base64Editado = vCanvas.toDataURL("image/jpeg", 0.85);
        var nombreOriginal = almacenamientoReporte[currentEditId].archivos[currentEditIdx].file.name;
        var archivoEditadoFile = new File([blob], nombreOriginal, { type: "image/jpeg", lastModified: Date.now() });
        almacenamientoReporte[currentEditId].archivos[currentEditIdx] = { file: archivoEditadoFile, previewUrl: base64Editado };
        actualizarListaVisual(currentEditId); cerrarVisor();
    }, "image/jpeg", 0.85);
}

function cerrarVisor() { document.getElementById("visorFlotante").style.display = "none"; }

// ==========================================
// PERSISTENCIA HÍBRIDA DE BASE DE DATOS
// ==========================================

// --- 8. GUARDAR AVANCE POR BLOQUE ---
function guardarAvanceParcialBloque(bloqueIdx) {
    var codigoPrjLimpio = document.getElementById("txtCodigoProyecto").value.trim();
    var nombreSitioLimpio = document.getElementById("txtNombreSitio").value.trim();
    if (!codigoPrjLimpio || !nombreSitioLimpio) {
        alert("Atención SITOC:\nAntes de guardar avance, debes diligenciar el 'Código del Proyecto' y 'Nombre del sitio'.");
        return;
    }

    var claveUnica = "Borrador_SITOC_" + codigoPrjLimpio.replace(/[^a-zA-Z0-9]/g, "_") + "_" + nombreSitioLimpio.replace(/[^a-zA-Z0-9]/g, "_");

    var paqueteProgreso = {
        idClaveCompuesta: claveUnica,
        codigoProyecto: codigoPrjLimpio,
        nombreSitio: nombreSitioLimpio,
        actividad: document.getElementById("selActividad").value,
        tecnico: document.getElementById("txtNombreTecnico").value.trim(),
        fechaPrimerRegistro: new Date().toLocaleDateString(),
        bloquesFotograficos: []
    };

    for (var bIdx = 0; bIdx < estructuraBloques.length; bIdx++) {
        var contenedorBloque = document.getElementById("bloque_container_" + bIdx);
        var idsMapeados = JSON.parse(contenedorBloque.getAttribute("data-inputs-mapeados"));
        var datosDeEsteBloque = {};

        for (var m = 0; m < idsMapeados.length; m++) {
            var idInput = idsMapeados[m];
            var item = almacenamientoReporte[idInput];
            if (item && (item.noAplica || item.archivos.length > 0)) {
                datosDeEsteBloque[idInput] = item;
            }
        }
        paqueteProgreso.bloquesFotograficos.push({
            bloqueIndex: bIdx,
            nombreBloque: estructuraBloques[bIdx].bloque,
            datos: datosDeEsteBloque
        });
    }

    if (!dbLocal) return;
    var transaccion = dbLocal.transaction(["borradores"], "readwrite");
    var almacen = transaccion.objectStore("borradores");
    var peticionGuardar = almacen.put(paqueteProgreso);

    peticionGuardar.onsuccess = function() {
        localStorage.setItem("SITOC_UltimaClaveActiva", claveUnica);
        actualizarContadorBorradoresOffline();

        var estadoTxt = document.getElementById("estado");
        if (estadoTxt) {
            estadoTxt.style.display = "block";
            estadoTxt.className = "success";
            estadoTxt.innerHTML = "💾 <b>¡Progreso Guardado con Éxito!</b><br>El avance de '" + nombreSitioLimpio + "' ha sido respaldado de forma unificada en la memoria.";
            setTimeout(function() { estadoTxt.style.display = "none"; }, 4000);
        }
    };
}

// --- Guardado masivo manual ---
function guardarBorradorLocalDB() {
    var prj = document.getElementById("txtCodigoProyecto").value.trim();
    var sitio = document.getElementById("txtNombreSitio").value.trim();
    if (!prj || !sitio) {
        alert("Error:\nDebes diligenciar como mínimo el Código del Proyecto y Sitio para archivar un borrador local.");
        return;
    }
    guardarAvanceParcialBloque(0);
}

// --- 9. AUTO-RECUPERACIÓN Y BANDEJA VISUAL ---
function actualizarBandejaHistorialVisual() {
    if (!dbLocal) return;
    var tx = dbLocal.transaction(["borradores"], "readonly");
    var store = tx.objectStore("borradores");
    var cursorReq = store.openCursor();
    var listaContenedor = document.getElementById("listaEstaciones");
    var panelHistorial = document.getElementById("panelHistorial");

    listaContenedor.innerHTML = "";
    var contadorRegistros = 0;

    cursorReq.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
            contadorRegistros++;
            var registro = cursor.value;

            var tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-estacion";
            tarjeta.setAttribute("data-clave", registro.idClaveCompuesta);

            var divInfo = document.createElement("div");
            divInfo.className = "info-estacion";
            divInfo.innerHTML = "📍 " + registro.nombreSitio + " <small>Código: " + registro.codigoProyecto + " | Registrado: " + registro.fechaPrimerRegistro + "</small>";

            var btnCargar = document.createElement("button");
            btnCargar.className = "btn-opcion";
            btnCargar.style.backgroundColor = "#0052cc";
            btnCargar.style.color = "white";
            btnCargar.style.fontSize = "11px";
            btnCargar.textContent = "⚡ Abrir";

            tarjeta.appendChild(divInfo);
            tarjeta.appendChild(btnCargar);

            tarjeta.onclick = function() {
                var clave = this.getAttribute("data-clave");
                dbLocal.transaction(["borradores"], "readonly").objectStore("borradores").get(clave).onsuccess = function(evt) {
                    if (evt.target.result) {
                        inyectarDatosEnFormulario(evt.target.result);
                        localStorage.setItem("SITOC_UltimaClaveActiva", clave);
                        window.scrollTo(0, document.querySelector(".bloque-datos").offsetTop - 60);
                    }
                };
            };

            listaContenedor.appendChild(tarjeta);
            cursor.continue();
        } else {
            panelHistorial.style.display = (contadorRegistros > 0) ? "block" : "none";
        }
    };
}

function verificarYAutocargarUltimaSesion() {
    actualizarBandejaHistorialVisual();
    var ultimaClave = localStorage.getItem("SITOC_UltimaClaveActiva");
    if (!ultimaClave || !dbLocal) { inicializarConstruccionFormulario(); return; }

    dbLocal.transaction(["borradores"], "readonly").objectStore("borradores").get(ultimaClave).onsuccess = function(e) {
        var borradorEncontrado = e.target.result;
        if (borradorEncontrado) { inyectarDatosEnFormulario(borradorEncontrado); } else { inicializarConstruccionFormulario(); }
    };
}

function inyectarDatosEnFormulario(borrador) {
    document.getElementById("txtCodigoProyecto").value = borrador.codigoProyecto || "";
    document.getElementById("txtNombreSitio").value = borrador.nombreSitio || "";
    document.getElementById("selActividad").value = borrador.actividad || "";
    document.getElementById("txtNombreTecnico").value = borrador.tecnico || "";

    almacenamientoReporte = {};

    for (var i = 0; i < borrador.bloquesFotograficos.length; i++) {
        var bBorrador = borrador.bloquesFotograficos[i];
        for (var idInput in bBorrador.datos) {
            if (bBorrador.datos.hasOwnProperty(idInput)) {
                almacenamientoReporte[idInput] = bBorrador.datos[idInput];
            }
        }
    }

    inicializarConstruccionFormulario();

    for (var idInput in almacenamientoReporte) {
        if (almacenamientoReporte.hasOwnProperty(idInput)) {
            actualizarListaVisual(idInput);
        }
    }

    for (var bIdx = 0; bIdx < estructuraBloques.length; bIdx++) {
        var badge = document.getElementById("badge_bloque_" + bIdx);
        if (badge && badge.textContent === "✓ COMPLETO") {
            // Bloque completo — sin acción adicional
        }
    }

    var estadoTxt = document.getElementById("estado");
    if (estadoTxt) {
        estadoTxt.style.display = "block";
        estadoTxt.className = "success";
        estadoTxt.innerHTML = "🔄 Avance restaurado: " + borrador.nombreSitio;
        setTimeout(function() { estadoTxt.style.display = "none"; }, 3000);
    }
}

// --- Limpiar base de datos ---
function limpiarBaseDatosTotal() {
    var request = indexedDB.open("SITOC_Offline_DB", 1);
    request.onsuccess = function(e) {
        var db = e.target.result;
        var tx = db.transaction(["borradores"], "readwrite");
        tx.objectStore("borradores").clear();
        tx.oncomplete = function() {
            alert("Base de datos limpiada. Ahora puedes guardar un sitio nuevo sin duplicados.");
            location.reload();
        };
    };
}

// --- 10. CONTROLADORES GENERALES DE BOTONES ---
document.getElementById("btnNuevoSitio").onclick = function() {
    if (confirm("¿Deseas pausar esta estación para registrar una nueva?\n\nLos datos actuales quedan resguardados localmente en el teléfono.")) {
        localStorage.removeItem("SITOC_UltimaClaveActiva");
        document.getElementById("txtCodigoProyecto").value = "";
        document.getElementById("txtNombreSitio").value = "";
        document.getElementById("selActividad").value = "";
        almacenamientoReporte = {};
        inicializarConstruccionFormulario();
        actualizarBandejaHistorialVisual();
        var estadoTxt = document.getElementById("estado");
        if (estadoTxt) {
            estadoTxt.style.display = "block";
            estadoTxt.className = "info";
            estadoTxt.innerHTML = "📝 Formulario limpio para una nueva estación.";
        }
        window.scrollTo(0, 0);
    }
};

function actualizarContadorBorradoresOffline() {
    if (!dbLocal) return;
    dbLocal.transaction(["borradores"], "readonly").objectStore("borradores").count().onsuccess = function(e) {
        var cantidad = e.target.result;
        var barra = document.getElementById("barraOffline");
        if (cantidad > 0) {
            document.getElementById("lblContadorBorradores").textContent = cantidad;
            barra.style.display = "block";
        } else {
            barra.style.display = "none";
        }
        actualizarBandejaHistorialVisual();
    };
}

function simularSincronizacionOffline() {
    var estado = document.getElementById("estado");
    estado.style.display = "block";
    estado.className = "success";
    estado.innerHTML = "<strong>⚡ ¡Sincronización Simulada Exitosa!</strong><br>Los paquetes de evidencias se estructuraron correctamente para SharePoint.<br><small>(La base de datos local se mantiene intacta para que sigas auditando los botones).</small>";
    window.scrollTo(0, estado.offsetTop - 60);
}

// --- Auditoría Final Completa ---
document.getElementById("btnEnviar").addEventListener("click", function() {
    var estado = document.getElementById("estado");
    estado.style.display = "block"; estado.className = "info"; estado.textContent = "Validando checklist obligatorio de interventoría...";
    try {
        var prj = document.getElementById("txtCodigoProyecto").value.trim();
        var act = document.getElementById("selActividad").value;
        var sitio = document.getElementById("txtNombreSitio").value.trim();
        var tec = document.getElementById("txtNombreTecnico").value.trim();
        if (!prj || !act || !sitio || !tec) { throw new Error("CAMPOS INCOMPLETOS:\nTodos los metadatos superiores son obligatorios."); }

        var totalFaltantes = 0;
        var todosLosItems = document.querySelectorAll(".foto-item");
        for (var x = 0; x < todosLosItems.length; x++) todosLosItems[x].classList.remove("incompleto");

        for (var id in almacenamientoReporte) {
            var item = almacenamientoReporte[id];
            if (!item || (!item.noAplica && item.archivos.length === 0)) {
                var contNode = document.getElementById("item_bloque_" + id);
                if (contNode) contNode.classList.add("incompleto");
                totalFaltantes++;
            }
        }
        if (totalFaltantes > 0) {
            document.querySelector(".foto-item.incompleto").scrollIntoView({ behavior: 'smooth', block: 'center' });
            throw new Error("REPORTE RECHAZADO:\nFaltan " + totalFaltantes + " evidencias fotográficas en el checklist.");
        }
        estado.className = "success"; estado.innerHTML = "<strong>¡Auditoría de Lote Aprobada!</strong> Reporte consolidado a calidad Full HD.";
    } catch (error) {
        estado.className = "error"; estado.textContent = error.message;
    }
});
