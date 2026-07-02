export enum EstadoPago {
  pendiente = 'pendiente',
  proceso = 'proceso',
  finalizado = 'finalizado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
}

export enum EstadoPagoIntento {
  proceso = 'proceso',
  finalizado = 'finalizado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
}

export enum EstadoPagoLink {
  proceso = 'proceso',
  finalizado = 'finalizado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
}

export enum EstadoPagoQr {
  proceso = 'proceso',
  finalizado = 'finalizado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
  usdtReceived = 'usdtReceived',
  usdtReceivedFailed = 'usdtReceivedFailed',
  amountUsdtTransferred = 'amountUsdtTransferred',
  amountUsdtTransferredFailed = 'amountUsdtTransferredFailed',
  comisionUsdtTransferred = 'comisionUsdtTransferred',
  comisionUsdtTransferredFailed = 'comisionUsdtTransferredFailed',
  swapExecuted = 'swapExecuted',
  swapExecutedFailed = 'swapExecutedFailed',
  withdrawal = 'withdrawal',
  withdrawalFailed = 'withdrawalFailed',
  webhookRecivedFailed = 'webhookRecivedFailed',
}

export enum TipoPersona {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA'
}

export enum EstadoPagoTransferencia {
  proceso = 'proceso',
  fiatReceived = 'fiatReceived',
  swapExecuted = 'swapExecuted',
  withdrawRequested = 'withdrawRequested',
  withdrawExecuted = 'withdrawExecuted',
  transferExecuted = 'transferExecuted',
  alreadyExists = 'alreadyExists',
  finalizado = 'finalizado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
}

export enum EstadoLock {
  pendiente = 'pendiente',
  utilizado = 'utilizado',
}

export enum Moneda {
  ARS = 'ARS',
  BRL = 'BRL',
  PYG = 'PYG'
}

export enum PagadorMoneda {
  ARS = 'ARS',
  USD = 'USD'
}

export enum MedioPago {
  transferencia = 'transferencia',
  efectivo = 'efectivo',
  mercadopago = 'mercadopago',
  cripto = 'cripto',
}

export enum EstadoCivil {
  SOLTERO = "SOLTERO", 
  CASADO = "CASADO", 
  VIUDO = "VIUDO", 
  DIVORCIADO = "DIVORCIADO", 
  SEPARADO = "SEPARADO", 
  OTRO = "OTRO"
}

export enum DocType {
  DNI_FRONT = "DNI_FRONT", 
  DNI_BACK = "DNI_BACK", 
  FUNDS = "FUNDS" 
}

export enum Flujos {
  PESOS_A_PIX = "PESOS_A_PIX",
  PESOS_A_VRL = "PESOS_A_VRL",
  PIX_A_PESOS = "PIX_A_PESOS",
  VRL_A_PESOS = "VRL_A_PESOS",
  VRL_A_PIX = "VRL_A_PIX",
}

export enum EstadoPagoStaticQr {
  pendiente = "pendiente",
  proceso = "proceso",
  finalizado = "finalizado",
  cancelado = "cancelado",
  error = "error"
}