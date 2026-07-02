import type { Empresa } from "./empresa.model";
import type { EstadoPagoStaticQr } from "./enums";

export interface PagoStaticQr {
  id: number;
  estado: EstadoPagoStaticQr;
  empresaId: number;
  montoPesos: number;
  montoReales: number;
  blockchainFeeOutMonto: number;
  blockchainFeeOutComision: number;
  comisionUsdt: number;
  montoUsdt: number;
  txHashMontoUsdt?: string | null;
  txHashComisionUsdt?: string | null;
  mantecaCodeLock: string;
  mantecaPrice: number;
  mantecaExpires: number;
  smpAmountBrl: number;
  smpPriceUsd: number;
  smpTotalBrl: number;
  smpFeeBrl: number;
  smpSendUsd: number;
  smpTimeout: number;
  smpAmountUsd: number;
  smpPricePxusdt: number;
  smpValuePxusdt: number;
  smpSendPxusdt: number;
  empresa: Empresa;
  PagoStaticQrSteps: PagoStaticQrStep[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface PagoStaticQrStep {
  id: number;
  pagoStaticQrId: number;
  data?: any | null;
  error?: any | null;
  pagoStaticQr: PagoStaticQr;
  createdAt: Date;
  updatedAt?: Date | null;
}