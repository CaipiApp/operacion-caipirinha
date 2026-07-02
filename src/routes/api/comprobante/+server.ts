import { type RequestHandler } from "@sveltejs/kit";
import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs';
import { PUBLIC_APP_URL } from "$env/static/public";

export const GET: RequestHandler = async () => {
  const body = {
    "fecha": "05/08/2024 22:19",
    "montoDestino": "10,00",
    "montoOrigen": "2.784,00",
    "nombre": "AGUIRRE MALAGUEÑO DIEGO ANDRES",
    "cuil": "20348257170",
    "empresaNombre": "Floripa Beach",
    "cuentaTipo": "pix",
    "cuentaClave": "01348725923",
    "pagoIntentoId": 42,
    "operationId": "1723164151567"
  }
  
	const comprobante = fs.readFileSync('./comprobante.html', 'utf8')
   
  const buffer: any = await nodeHtmlToImage({
    html: comprobante, 
    content: { baseUrl: PUBLIC_APP_URL, ...body },
    puppeteerArgs: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  const options: ResponseInit = {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length.toString(),
    }
  }

	return new Response(buffer, options);
};



