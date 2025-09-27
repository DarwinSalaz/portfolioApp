# Cargue Masivo de Ventas

Esta funcionalidad permite cargar múltiples ventas de forma masiva mediante un archivo Excel, replicando la funcionalidad del script Python `cargue.py`.

## Características

### ✅ Validaciones Implementadas
- **Límite de registros**: Máximo 1000 registros por archivo
- **Campos obligatorios del cliente**: `name`
- **Campos obligatorios del servicio**: Todos los campos numéricos y de fecha
- **Validación de productos**: Verificación de existencia en el catálogo
- **Validación de cantidades**: Deben ser enteros positivos
- **Validación de fechas**: Formato MM/dd/yyyy
- **Valor por defecto**: `cellphone` se asigna '0' si está vacío

### 📋 Formato del Archivo Excel

El archivo Excel debe tener las siguientes columnas en orden:

| Columna | Campo | Tipo | Obligatorio | Descripción |
|---------|-------|------|-------------|-------------|
| A | name | String | ✅ | Nombre del cliente |
| B | last_name | String | ❌ | Apellido del cliente |
| C | cellphone | String | ❌ | Teléfono (se asigna '0' si está vacío) |
| D | email | String | ❌ | Email del cliente |
| E | address | String | ❌ | Dirección del cliente |
| F | identification_number | String | ❌ | Número de identificación |
| G | gender | String | ❌ | Género del cliente |
| H | observation | String | ❌ | Observaciones del cliente |
| I | valor_servicio | Number | ✅ | Valor del servicio |
| J | cuota_inicial | Number | ✅ | Cuota inicial |
| K | descuento | Number | ✅ | Descuento aplicado |
| L | deuda | Number | ✅ | Deuda pendiente |
| M | valor_total | Number | ✅ | Valor total |
| N | dias_cuota | Number | ✅ | Días entre cuotas |
| O | nro_cuotas | Number | ✅ | Número de cuotas |
| P | valor_cuota | Number | ✅ | Valor de cada cuota |
| Q | abono | Number | ❌ | Abono inicial (default: 0) |
| R | next_payment_date | String | ✅ | Fecha próximo pago (MM/dd/yyyy) |
| S | application_user_id | Number | ❌ | ID del usuario (default: 48) |
| T | product_name | String | ✅ | Nombres de productos separados por \| |
| U | product_quantity | String | ✅ | Cantidades separadas por \| |

### 🔄 Flujo de Trabajo

1. **Selección de Archivo**: El usuario selecciona un archivo Excel y un wallet
2. **Validación**: El sistema valida todos los registros y muestra un resumen
3. **Confirmación**: El usuario revisa el resumen y confirma el cargue
4. **Procesamiento**: El sistema crea todos los registros en el backend
5. **Resultado**: Se muestra el resultado del procesamiento

### 🚨 Manejo de Errores

- **Errores de validación**: Se muestran en el resumen antes del procesamiento
- **Errores de procesamiento**: Se muestran en el resultado final
- **Límites**: Máximo 1000 registros por archivo
- **Validación de productos**: Verificación contra el catálogo del wallet seleccionado

### 🛠️ Endpoints del Backend

- `POST /api/portfolio/bulk-upload/validate` - Validar archivo
- `POST /api/portfolio/bulk-upload/process` - Procesar cargue masivo

### 📊 Resumen de Validación

El sistema muestra:
- Total de registros
- Registros válidos vs con errores
- Número de clientes, servicios y productos a crear
- Valor total estimado
- Lista detallada de errores (máximo 10 mostrados)

### 🔧 Configuración

- **Límite de registros**: Configurado en `BulkUploadValidationService.MAX_RECORDS`
- **Formato de fecha**: MM/dd/yyyy
- **Wallet por defecto**: Se selecciona en el frontend
- **Usuario por defecto**: ID 48 (configurable en el backend)

## Uso

1. Navegar a **Ventas Y Abonos > Cargue Masivo**
2. Seleccionar archivo Excel y wallet
3. Hacer clic en "Validar Archivo"
4. Revisar el resumen de validación
5. Hacer clic en "Procesar Cargue" si todo está correcto
6. Revisar el resultado del procesamiento