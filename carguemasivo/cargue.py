import os
import pandas as pd
import requests

ERROR_COLUMN = 'error_messages'

def get_products():
    # Simulación de obtención de productos
    return [
        {"product_id": 1, "name": "Producto A", "price": 10.50},
        {"product_id": 2, "name": "Producto B", "price": 20.00},
        {"product_id": 3, "name": "Producto C", "price": 5.75}
    ]

def register_customer(row):
    row['observation'] = row['observation'] if pd.notna(row['observation']) else ""
    row['address'] = row['address'] if pd.notna(row['address']) else ""
    cellphone = row.get('cellphone', None)
    if cellphone is None or str(cellphone).strip() == '':
        cellphone = '0'
    customer_data = {
        "company_id": int(row['company_id']),
        "name": row['name'],
        "last_name": row.get('last_name', None),
        "cellphone": cellphone,
        "email": row.get('email', None),
        "address": row.get('address', None),
        "identification_number": row.get('identification_number', None),
        "active": True,
        "gender": row.get('gender', None),
        "observation": row.get('observation', None),
        "wallet_id": int(row['wallet_id'])
    }
    url = f"{BASE_URL}/api/portfolio/customer/create"
    response = requests.post(url, headers=API_HEADERS, json=customer_data)
    if response.status_code in [200, 201]:
        return response.json().get('customer_id')
    else:
        raise Exception(f"Error registering customer: {response.status_code} - {response.text}")

def register_service(row, customer_id, products_info):
    product_data = []
    product_names = str(row['product_name']).split('|')
    product_quantities = str(row['product_quantity']).split('|')
    for i in range(len(product_names)):
        product_name = product_names[i].strip().lower()
        product_quantity = product_quantities[i].strip()
        # Ajuste: comparar quitando espacios en ambos lados
        matched_product = None
        for key, product in products_info.items():
            if product_name == key.strip().lower():
                matched_product = product
                break
        if not matched_product:
            raise Exception(f"Producto '{product_names[i]}' no encontrado en la lista de productos")
        product_errors = validate_product_row(product_name, product_quantity, products_info)
        if product_errors:
            raise Exception("; ".join(product_errors))
        product = matched_product
        product_data.append({
            "product_id": product['product_id'],
            "value": product['value'],
            "quantity": int(product_quantity),
            "name": product['name']
        })
    service_headers = {
        'Content-Type': 'application/json',
        'Authorization': f'{AUTH_TOKEN}'
    }
    date_str = row['next_payment_date']
    try:
        next_payment_date = pd.to_datetime(date_str, format='%m/%d/%Y')
        next_payment_date_str = next_payment_date.strftime('%Y-%m-%dT%H:%M:%S')
    except ValueError as e:
        raise Exception(f"Error en la conversión de la fecha: {str(e)}")
    service_data = {
        "application_user_id": int(row['application_user_id']) if 'application_user_id' in row and pd.notna(row['application_user_id']) else 48,
        "service_value": float(row['valor_servicio']),
        "down_payment": float(row['cuota_inicial']),
        "discount": float(row['descuento']),
        "total_value": float(row['valor_total']),
        "debt": float(row['deuda']),
        "days_per_fee": int(row['dias_cuota']),
        "quantity_of_fees": int(row['nro_cuotas']),
        "fee_value": float(row['valor_cuota']),
        "pending_fees": int(row['nro_cuotas']),
        "initial_payment": float(row['abono']) if 'abono' in row and pd.notna(row['abono']) else 0,
        "wallet_id": int(row['wallet_id']),
        "has_products": True,
        "customer_id": customer_id,
        "state": "created",
        "observations": "cargue_automatico",
        "next_payment_date": next_payment_date_str,
        "service_products": product_data
    }
    url = f"{BASE_URL}/api/portfolio/service/create"
    response = requests.post(url, headers=service_headers, json=service_data)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error registering service: {response.status_code} - {response.text}")

def validate_customer_row(row):
    errors = []
    if pd.isna(row['customer_id']):
        errors.append("El campo 'customer_id' es obligatorio.")
    if pd.isna(row['product_id']):
        errors.append("El campo 'product_id' es obligatorio.")
    if pd.isna(row['quantity']):
        errors.append("El campo 'quantity' es obligatorio.")
    if pd.isna(row['price']):
        errors.append("El campo 'price' es obligatorio.")
    return errors

def validate_service_row(row):
    errors = []
    if pd.isna(row['customer_id']):
        errors.append("El campo 'customer_id' es obligatorio en la fila de servicio.")
    if pd.isna(row['product_id']):
        errors.append("El campo 'product_id' es obligatorio en la fila de servicio.")
    if pd.isna(row['quantity']):
        errors.append("El campo 'quantity' es obligatorio en la fila de servicio.")
    if pd.isna(row['price']):
        errors.append("El campo 'price' es obligatorio en la fila de servicio.")
    return errors


def process_file(file_path):
    df = pd.read_excel(file_path) if file_path.endswith('.xlsx') else pd.read_csv(file_path, sep=';')
    if ERROR_COLUMN not in df.columns:
        df[ERROR_COLUMN] = None
    try:
        print(f"Consultando productos...")
        products_info = get_products()
        print(f"Consulta de productos exitosa")
        for idx, row in df.iterrows():
            error_messages = []
            # Validaciones de cliente
            customer_validation_errors = validate_customer_row(row)
            if customer_validation_errors:
                error_messages.extend(customer_validation_errors)
                df.at[idx, ERROR_COLUMN] = " | ".join(error_messages)
                print(f"Fila {idx}: Errores de validación de cliente: {error_messages}")
                continue
            try:
                print(f"Registrando cliente...")
                customer_id = register_customer(row)
                print(f"Registro exitoso ID: {customer_id}")
                row['customer_id'] = customer_id  # Para validación de servicio
                # Validaciones de servicio
                service_validation_errors = validate_service_row(row)
                if service_validation_errors:
                    error_messages.extend(service_validation_errors)
                    df.at[idx, ERROR_COLUMN] = " | ".join(error_messages)
                    print(f"Fila {idx}: Errores de validación de servicio: {service_validation_errors}")
                    continue
                try:
                    print(f"Registrando servicio...")
                    register_service(row, customer_id, products_info)
                    print(f"Servicio registrado para cliente {customer_id}")
                except Exception as service_error:
                    error_message = f"Error en 'register_service': {str(service_error)}"
                    error_messages.append(error_message)
                    df.at[idx, ERROR_COLUMN] = " | ".join(error_messages)
                    print(f"Fila {idx}: {error_message}")
            except Exception as customer_error:
                error_message = f"Error en 'register_customer': {str(customer_error)}"
                error_messages.append(error_message)
                df.at[idx, ERROR_COLUMN] = " | ".join(error_messages)
                print(f"Fila {idx}: {error_message}")
    except Exception as product_error:
        error_message = f"Error en 'get_products': {str(product_error)}"
        print(error_message)
        df[ERROR_COLUMN] = error_message
    output_file = os.path.join(os.path.dirname(file_path), 'corrected-' + os.path.basename(file_path))
    if output_file.endswith('.xlsx'):
        df.to_excel(output_file, index=False)
    else:
        df.to_csv(output_file, index=False, sep=';') 