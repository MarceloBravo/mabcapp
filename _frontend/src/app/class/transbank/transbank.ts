export class Transbank {
  id: number | null = null
  venta_id: number = 0
  vci?: string
  ammount: number = 0
  buy_order?: string
  status?: string
  session_id?: string
  card_number?: string
  card_detail?: string
  account_date?: string
  transaccion_date?: string
  authorization_code?: string
  payment_type_code?: string
  response_code?: number
  installments_numbers?: number
  created_at: string = ''
  updated_at: string = ''
  deleted_at?: string
}
