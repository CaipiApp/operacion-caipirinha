import { browser } from '$app/environment';
import { PUBLIC_WAPP } from '$env/static/public';
// import { PUBLIC_WAPP } from '$env/static/public';
import { type Document, DocType, type Lock, EstadoPago } from '$lib/models';
import currency from "currency.js";

export const currency6 = (value: number | string | currency, opts?: currency.Options) =>
  currency(value, {precision: 6, ...opts});


export const currency2 = (value: number | string | currency, opts?: currency.Options) =>
  currency(value, {symbol: "$", separator: ".", decimal: ",", precision: 2, ...opts });

export function delay(time: number): Promise<undefined> {
	return new Promise((resolve) => setTimeout(resolve, time));
}


export function getMontosPesosAPix(montoUsdt: number, feeIn: number, feeOut: number, comision: number, price: number){
  const totalSinComisionUsdt = currency6(montoUsdt).add(feeIn).add(feeOut).value;
  const comisionUsdt = currency6(totalSinComisionUsdt).multiply(comision).value;
  const totalUsdt = currency6(totalSinComisionUsdt).add(comisionUsdt).value;
  const totalPesos = currency2(currency6(totalUsdt).multiply(price)).value;

  return {totalSinComisionUsdt, comisionUsdt, totalUsdt, totalPesos}
}

export function getMontoOrigen(lock: Lock | undefined) {
	if (!lock) return 0;

	const { totalPesos } = getMontosPesosAPix(
		lock.montoUsdt,
		lock.blockFeeIn,
		lock.blockFeeOut,
		lock.comision,
		lock.priceLock
	);

	return totalPesos;
}

export function sortDocuments(a: Document, b: Document) {
	const d1 = new Date(a.date);
	const d2 = new Date(b.date);

	if (d1 > d2) {
		return -1;
	} else if (d1 === d2) {
		return 0;
	} else {
		return 1;
	}
}

export function getLastDocument(documents: Document[], type: DocType) {
	const filteredDocuments = documents?.filter((doc) => doc?.type === type);
	if (!filteredDocuments || filteredDocuments.length === 0) return null;

	const orderedDocuments = filteredDocuments.sort(sortDocuments);
	return orderedDocuments[0];
}

export function isMobileDevice() {
	return browser && /Mobi|Android/i.test(navigator.userAgent);
}

export function translatePaymentState(estado: EstadoPago) {
	if (estado === EstadoPago.pendiente) return 'paymentsTablePaymentStatesPending';
	if (estado === EstadoPago.proceso) return 'paymentsTablePaymentStatesProcessing';
	if (estado === EstadoPago.finalizado) return 'paymentsTablePaymentStatesFinished';
	if (estado === EstadoPago.cancelado) return 'paymentsTablePaymentStatesCanceled';
	if (estado === EstadoPago.rechazado) return 'paymentsTablePaymentStatesRejected';
	return estado;
}

export function redirectWhatsapp(message = 'Hola, quiero saber más sobre Caipi.') {
	if (isMobileDevice()) {
		window.location.href = `https://wa.me/${PUBLIC_WAPP}?text=${encodeURIComponent(message)}`;
	} else {
		window.location.href = `https://web.whatsapp.com/send?phone=${PUBLIC_WAPP}&text=${encodeURIComponent(message)}`;
	}
}

export function isDocumentRejected(documentos: Document[]) {
	const lastDniFront = getLastDocument(documentos, DocType.DNI_FRONT);
	const lastDniBack = getLastDocument(documentos, DocType.DNI_BACK);
	if (!lastDniFront || (lastDniFront?.status != 'VALIDATED' && lastDniFront?.status != 'PENDING')) {
		return true;
	}
	if (!lastDniBack || (lastDniBack?.status != 'VALIDATED' && lastDniBack?.status != 'PENDING')) {
		return true;
	}

	return false;
}

export const PAIRS: Record<string, any> = {
	"ARS_BRL": {
		monedaOrigen: 'ARS',
		monedaDestino: 'BRL' 
	},
	"BRL_ARS": {
		monedaOrigen: 'BRL',
		monedaDestino: 'ARS' 
	}
}

export const replaceStateWithQuery = (values: Record<string, string>) => {
	if(!window) return;
	
  const url = new URL(window?.location?.toString());
  for (let [k, v] of Object.entries(values)) {
    if (!!v) {
      url.searchParams.set(k, v);
    } else {
      url.searchParams.delete(k);
    }
  }
  history.replaceState(history.state, '', url);
};
