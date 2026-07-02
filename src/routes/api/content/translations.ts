// Translation data for landing page content
// Extracted from the landing Express server

export type ContentData = Record<string, any>;

export const translations: Record<string, any> = {
      ES: {
		hero: {
			tag: 'Argentina ↔ Brasil · Mercosur en expansión',
			title: {
				line1: "Tu puente",
				line2: "financiero",
				line3: 'Mercosur'
			},
			description:
				'Caipi conecta personas y empresas entre Argentina y Brasil, construyendo infraestructura de pagos para la integración financiera del Mercosur.',
			ctaMain: 'Crear Usuario',
			ctaSecondary: 'Conocer Caipi Empresas',
			stats: [
				{ value: "10K+", label: "Usuarios" },
				{ value: '$350M+', label: 'Procesados' },
				{ value: "4.5/5", label: "Rating" }
			],
          mockup: {
            balanceLabel: "Tu Balance",
            recentActivityLabel: "Actividad Reciente",
            saveLabel: "Ahorro estimado",
            saveDesc: "8.3% mejor cambio",
            viewAll: "Ver todo",
            today: "Hoy",
            yesterday: "Ayer",
            recharge: "Recarga Saldo"
          },
          activeUsersLabel: "USUARIOS ACTIVOS",
          activeUsers: "+10K"
        },
		navbar: {
          links: [
            { name: "Soluciones", href: "#soluciones" },
            { name: "Caipi Empresas", href: "#empresas" },
            { name: "Caipi App", href: "#personal" },
            { name: "FAQ", href: "#faq" }
          ],
			login: 'Iniciar Sesión',
			cta: 'Crear Usuario',
			languageLabel: "Idioma"
		},
		footer: {
			tagline: 'Mercosur sin fronteras.',
			fintechLabel: 'Cámara Argentina de Fintech',
			copyright: "|2026| ®Caipi. Todos los derechos reservados.",
			helpTitle: "¿Contacto comercial o soporte técnico?",
			chatLabel: "CHAT",
			productTitle: "Producto",
			legalTitle: 'LEGAL',
			termsLabel: "Términos y condiciones",
          apiLabel: "API para Empresas",
          costsLabel: "Costos y Tasas",
          countries: ["Argentina", "Brasil", "Global"],
          socials: [
            { name: "Instagram", url: "https://www.instagram.com/caipi.app/" },
            { name: "LinkedIn", url: "https://ar.linkedin.com/company/caipi-app" },
            { name: "Twitter", url: "https://x.com/caipi_app?s=11&t=czCzBagDrE4ub31Bd1KSCg" }
          ]
        },
		trust: {
			title: "Empresas que ya confían en nosotros",
			description:
				'Algunas de las más de 70 empresas de Argentina y Brasil que ya optimizan sus pagos y cobros con Caipi.',
          companies: [
            { name: "Shell 4 Bocas", industry: "Energía", logo: "input_file_0.png" },
            { name: "LA REGINA LODGE", industry: "Hospitalidad", logo: "input_file_4.png" },
            { name: "Ray Bus", industry: "Transporte", logo: "input_file_2.png" },
            { name: "Nordemaq", industry: "Agroindustrial", logo: "input_file_3.png" },
            { name: "Lion Global", industry: "Consultoría", logo: "input_file_1.png" },
            { name: "FLORIPABEACH", industry: "Turismo", logo: "input_file_5.png" }
          ]
        },
		converter: {
          title: "Transparencia total.",
          titleSpan: "Sin sorpresas.",
          titleEnd: "",
          description: "Calculá tus operaciones. Utilizamos el tipo de cambio real, actualizado al segundo.",
          sendLabel: "Envías",
          receiveLabel: "Recibís",
          netReceiptLabel: "Recepción neta",
			guaranteedRate:
				'Tipo de cambio congelado al iniciar la operación (Tasa de referencia: {rate} ARS).',
			rateDisclaimer:
				'La cotización puede estar sujeta a validación, disponibilidad operativa y confirmación del proveedor correspondiente.',
          features: [
            { title: "Intercambio Directo", desc: "Sin pasar por dólares. ARS ↔ BRL de forma directa." },
            { title: "Experiencia Mobile", desc: "Escaneá el código PIX y listo. Tan fácil como un pago local." }
          ],
          cta: "SIMULAR CONVERSIÓN",
          frozenRateBadge: "Cambio Congelado",
          calculatorTitle: "Calculadora Caipi",
          liveRateLabel: "Tasa Live",
			guaranteedRateTitle: 'Tipo de cambio congelado',
			appFunctionNote: "(Función convertir en APP)"
		},
        registration: {
          sidebarTitle: "Sumate a Caipi sin costos ni comisiones.",
          sidebarDesc: "Completá los pasos y empezá a operar sin fronteras en menos de 24hs.",
          stepLabel: "Paso",
          steps: ["Entidad", "Recursos", "Documentación"],
          supportLabel: "Soporte prioritario • caipi.app",
          step1Title: "Información del Negocio",
          step1Desc: "Comencemos con los datos básicos de tu empresa o actividad.",
          step1Btn: "Siguiente Paso",
          step2Title: "Recursos Descargables",
          step2Desc: "Descargá y completá estos 4 documentos para darte de alta. *No olvides firmarlos.",
          step2Btn: "Continuar a Subir Archivos",
          step3Title: "Documentación requerida",
          step3Desc: "Adjunta estos 9 archivos para que podamos validar tu cuenta.",
          step3Btn: "Finalizar Registro",
          backBtn: "Volver",
          successTitle: "¡Solicitud Enviada!",
          successDesc: "Hemos recibido tus datos. En breve recibirás un contacto de nuestro equipo comercial.",
          successBtn: "Entendido",
          digitalizing: "Digitalizando",
          digitalized: "Digitalizado",
          attach: "Adjuntar",
          uploading: "Subiendo",
          uploadSuccess: "Completado",
          uploadError: "Error al subir",
          closeLabel: "Cerrar",
          filesLabel: "archivos",
          publicLabel: "Público",
          moreThanLabel: "MÁS DE",
          termsTitle: "Términos",
          termsSpan: "Condiciones",
          legalsLabel: "LEGALES CAIPI",
          understandBtn: "ENTENDIDO",
          fields: {
            legalRepresentative: "Nombre de Representante Legal",
            businessName: "Nombre Comercial",
            businessType: "Tipo",
            email: "Email",
            phone: "Teléfono",
            taxId: "CUIT",
            businessTypeOptions: ["Empresa", "Monotributista", "Resp. Inscripto"]
          },
          step3Files: [
            { k: 'doc1', l: 'Identidad Apoderados', d: 'DNI o Pasaporte (Frente y Dorso en un PDF)' },
            { k: 'doc2', l: 'Contrato Social / Estatutos', d: 'Última versión inscrita y vigente' },
            { k: 'doc3', l: 'Constancia Fiscal', d: 'Descarga reciente de ARCA / CUIT' },
            { k: 'doc4', l: 'Estado Contable', d: 'Último balance firmado digitalmente' },
            { k: 'doc5', l: 'DDJJ de IVA', d: 'Últimas 3 declaraciones presentadas' },
            { k: 'f1', l: 'Formulario 01', d: '' },
            { k: 'f2', l: 'Formulario 02', d: '' },
            { k: 'f3', l: 'Formulario 03', d: '' },
            { k: 'f4', l: 'Formulario 04', d: '' }
          ]
        },
        ctaSection: {
          title: "¿Listo para expandir tu",
          titleSpan: "negocio con Brasil?",
          desc: "Sumate a las empresas que ya optimizan sus operaciones transfronterizas con Caipi. Cuenta comercial en 24hs a costo 0.",
          button: "Abrir Cuenta",
          moreThanLabel: "MÁS DE",
          countLabel: "70"
        },
		faq: {
			title: "Preguntas Frecuentes",
			tag: "FAQ",
			description: 'Todo lo que tu comercio necesita saber para cobrar y pagar con Pix desde Argentina.',
			ctaTitle: '¿Querés activar Caipi Empresas para tu comercio?',
			ctaSub:
				'Hablá con nuestro equipo y empezá a cobrar a clientes de Brasil o pagar a proveedores brasileños desde Argentina, con una experiencia simple, clara y pensada para empresas.',
			ctaBtn: 'Contactar por WhatsApp',
			items: [
				{
					q: '¿Cómo funciona Caipi Empresas?',
					a: 'Caipi Empresas permite que comercios y empresas argentinas puedan cobrar a clientes de Brasil mediante Pix, usando QR o link de cobro. El cliente paga desde su banco o billetera compatible con Pix y el comercio recibe la liquidación en pesos argentinos.\n\nTambién permite pagar a proveedores de Brasil desde pesos argentinos hacia Pix, de forma simple y trazable.'
				},
				{
					q: '¿Cómo puede pagarme un cliente de Brasil?',
					a: 'El cliente puede pagar escaneando un QR o abriendo un link de cobro. Luego completa la operación desde su app bancaria o billetera compatible con Pix, de una forma simple y familiar para usuarios de Brasil.'
				},
				{
					q: '¿En qué moneda cobra mi comercio?',
					a: 'Tu comercio cobra en pesos argentinos. El cliente de Brasil paga con Pix y Caipi Empresas permite que la liquidación se realice en Argentina en pesos argentinos.'
				},
				{
					q: '¿Cuánto tarda en liquidarse un cobro con Pix?',
					a: 'La liquidación del cobro es al instante. Una vez confirmado el pago con Pix, el comercio recibe la liquidación en pesos argentinos de forma inmediata.'
				},
				{
					q: '¿Cuánto cuesta usar Caipi Empresas para cobrar?',
					a: 'Para cobros a clientes de Brasil, Caipi Empresas no tiene costo de uso ni comisiones para el comercio o empresa.'
				},
				{
					q: '¿Necesito tener cuenta bancaria en Brasil?',
					a: 'No. El comercio o empresa argentina no necesita tener una cuenta bancaria en Brasil para cobrar a clientes brasileños mediante Caipi Empresas.'
				},
				{
					q: '¿También puedo pagar proveedores en Brasil?',
					a: 'Sí. Caipi Empresas también permite que comercios y empresas argentinas puedan pagar a proveedores de Brasil desde pesos argentinos hacia Pix.'
				},
				{
					q: '¿Qué documentación necesito para activar mi comercio o empresa?',
					a: 'Para activar Caipi Empresas podemos solicitar documentación básica del comercio o empresa, datos fiscales, información del representante legal y validaciones necesarias. Esto permite operar de forma segura.'
				},
				{
					q: '¿Puedo generar QR y links de cobro?',
					a: 'Sí. Caipi Empresas permite generar cobros mediante QR para operaciones presenciales y links de cobro para operaciones a distancia. Esto facilita cobrar a clientes de Brasil en distintos canales comerciales.'
				},
				{
					q: '¿Recibo comprobante de cada operación?',
					a: 'Sí. Cada operación genera un comprobante con la información relevante del cobro o pago, para que el comercio o empresa pueda identificar, conciliar y registrar sus operaciones con mayor claridad.'
				},
				{
					q: '¿En qué rubros puedo usar Caipi Empresas?',
					a: 'Caipi Empresas puede ser útil para turismo, hotelería, gastronomía, comercios de frontera, servicios profesionales, real estate, experiencias, agencias, operadores comerciales y otros negocios argentinos que cobran a clientes de Brasil o pagan a proveedores brasileños.'
				}
			]
		},
        features: {
          title: {
            line1: "Soluciones diseñadas para",
            line2: "tu agilidad financiera"
          },
          description: "Ya seas turista o una empresa que opere entre Argentina y Brasil, Caipi tiene la herramienta perfecta.",
          store: {
            appleLabel: "Descargar en",
            googleLabel: "DISPONIBLE EN",
            appleStore: "App Store",
            googleStore: "Google Play"
          },
			business: {
            tag: "Empresa",
            title: "Caipi Empresas",
            description: "La solución simple y definitiva de cobros y pagos comerciales entre Argentina y Brasil, sin demoras y sin costo de uso.",
            items: [
              {
                title: "Cobros vía PIX al Instante",
                description: "Tus clientes pagan con su app de banco habitual. Vos recibís el pago neto liquidado en el acto y en la cuenta que elijas.",
                icon: "Zap",
                color: "bg-brand-primary/10"
              },
              {
                title: "Gestión Centralizada",
                description: "Panel de control completo para trackear ventas, generar reportes y administrar sucursales.",
                icon: "TrendingUp",
                color: "bg-emerald-400/10"
              }
            ],
				cta: 'Crear Usuario'
			},
          personal: {
            tag: "Para vos",
            title: "Caipi App",
            description: "Tu compañera ideal para cruzar la frontera. Paga en cualquier comercio de Brasil como si fueras local.",
            items: [
              {
                title: "Pagos QR Universal",
                description: "Escanea cualquier QR de PIX o bancos brasileños y paga con tus pesos argentinos al instante.",
                icon: "Smartphone",
                color: "bg-blue-400/10"
              },
              {
                title: "Congela tu Cambio",
                description: "Usa la función convertir para congelar el tipo de cambio y adquirir BRL por anticipado.",
                icon: "Lock",
                color: "bg-purple-400/10"
              }
            ]
          },
			marketLabel: 'Mercado BR'
		},
		login: {
            backBtn: "VOLVER",
            badge: "Acceso Seguro",
            title: "Ingresá a",
            titleSpan: "tu cuenta",
            emailLabel: "TU EMAIL",
            passwordLabel: "CONTRASEÑA",
            forgotPassword: "¿OLVIDASTE?",
            submitBtn: "INGRESAR AHORA",
            loadingBtn: "AUTORIZANDO...",
            errorFields: "Por favor, completá todos los campos.",
			invalidCredentials: "Credenciales no válidas.",
            noAccount: "¿AÚN NO TENÉS CUENTA?",
            registerBtn: "REGISTRATE AQUÍ",
            termsLabel: "Términos y Condiciones",
            metadata: "GLOBAL • BORDERLESS • SECURE"
		}
	},
      PT: {
        hero: {
          tag: "Liderando pagamentos AR 🇦🇷 ↔ BR 🇧🇷",
          title: {
            line1: "Sua ponte",
            line2: "financeira",
            line3: "AR 🇦🇷 ↔ BR 🇧🇷"
          },
          description: "Soluções nativas para comércios e carteira digital para você. Pague e receba via PIX instantaneamente.",
          ctaMain: "Abrir Conta",
          ctaSecondary: "Como funciona",
          stats: [
            { value: "10K+", label: "Usuários" },
            { value: "$300M+", label: "Processados" },
            { value: "4.5/5", label: "Rating" }
          ],
          mockup: {
            balanceLabel: "Seu Saldo",
            recentActivityLabel: "Atividade Recente",
            saveLabel: "Economia estimada",
            saveDesc: "Câmbio 8.3% melhor",
            viewAll: "Ver tudo",
            today: "Hoje",
            yesterday: "Ontem",
            recharge: "Recarregar Saldo"
          },
          activeUsersLabel: "USUÁRIOS ATIVOS",
          activeUsers: "+10K"
        },
        navbar: {
          links: [
            { name: "Soluções", href: "#soluciones" },
            { name: "Caipi Empresas", href: "#empresas" },
            { name: "Caipi App", href: "#personal" },
            { name: "FAQ", href: "#faq" }
          ],
          login: "Entrar",
          cta: "Abrir Conta",
          languageLabel: "Idioma"
        },
        footer: {
          tagline: "A ponte financeira definitiva entre AR e BR.",
          copyright: "|2026| ®Caipi. Todos os direitos reservados.",
          helpTitle: "Contato comercial ou suporte técnico?",
          chatLabel: "CHAT",
          productTitle: "Produto",
          legalTitle: "LEGAIS CAIPI",
          termsLabel: "Termos e condições",
          apiLabel: "API para Empresas",
          costsLabel: "Custos e Taxas",
          countries: ["Argentina", "Brasil", "Global"],
          socials: [
            { name: "Instagram", url: "https://www.instagram.com/caipi.app/" },
            { name: "LinkedIn", url: "https://ar.linkedin.com/company/caipi-app" },
            { name: "Twitter", url: "https://x.com/caipi_app?s=11&t=czCzBagDrE4ub31Bd1KSCg" }
          ]
        },
        trust: {
          title: "Empresas que já confiam em nós",
          description: "Alguns dos comércios e empresas da Argentina e do Brasil que já otimizam seus pagamentos e recebimentos com a Caipi.",
          companies: [
            { name: "Shell 4 Bocas", industry: "Energia", logo: "input_file_0.png" },
            { name: "LA REGINA LODGE", industry: "Hospitalidade", logo: "input_file_4.png" },
            { name: "Ray Bus", industry: "Transporte", logo: "input_file_2.png" },
            { name: "Nordemaq", industry: "Agroindustrial", logo: "input_file_3.png" },
            { name: "Lion Global", industry: "Consultoria", logo: "input_file_1.png" },
            { name: "FLORIPABEACH", industry: "Turismo", logo: "input_file_5.png" }
          ]
        },
        converter: {
          title: "Transparência total.",
          titleSpan: "Sem surpresas.",
          titleEnd: "",
          description: "Calcule suas operações. Utilizamos a taxa de câmbio real, atualizada ao segundo.",
          sendLabel: "Você envia",
          receiveLabel: "Você recebe",
          netReceiptLabel: "Recebimento líquido",
          guaranteedRate: "Esta taxa de câmbio {rate} ARS fica congelada por 20 minutos ao iniciar a transação.",
          features: [
            { title: "Troca Direta", desc: "Sem passar pelo dólar. ARS ↔ BRL de forma direta." },
            { title: "Experiência Mobile", desc: "Escaneie o código PIX e pronto. Tão fácil quanto um pagamento local." }
          ],
          cta: "SIMULAR CONVERSÃO",
          frozenRateBadge: "Câmbio Congelado",
          calculatorTitle: "Calculadora Caipi",
          liveRateLabel: "Taxa Live",
          guaranteedRateTitle: "Taxa Garantida",
          appFunctionNote: "(Função converter no APP)"
        },
        registration: {
          sidebarTitle: "Junte-se à Caipi sem custos ou comissões.",
          sidebarDesc: "Complete as etapas e comece a operar sem fronteiras em menos de 24h.",
          stepLabel: "Passo",
          steps: ["Entidade", "Recursos", "Documentación"],
          supportLabel: "Suporte prioritário • caipi.app",
          step1Title: "Informação do Negócio",
          step1Desc: "Vamos começar com os dados básicos da sua empresa ou atividade.",
          step1Btn: "Próximo Passo",
          step2Title: "Recursos para Download",
          step2Desc: "Baixe e complete estes 4 documentos para se cadastrar. *Não esqueça de assiná-los.",
          step2Btn: "Continuar a Enviar Arquivos",
          step3Title: "Documentação requerida",
          step3Desc: "Anexe estes 9 arquivos para que possamos validar sua conta.",
          step3Btn: "Finalizar Registro",
          backBtn: "Voltar",
          successTitle: "Solicitação Enviada!",
          successDesc: "Recebemos seus dados. Em breve você receberá um contato de nossa equipe comercial.",
          successBtn: "Entendido",
          digitalizing: "Digitalizando",
          digitalized: "Digitalizado",
          attach: "Anexar",
          uploading: "Enviando",
          uploadSuccess: "Concluído",
          uploadError: "Erro ao enviar",
          closeLabel: "Fechar",
          filesLabel: "arquivos",
          publicLabel: "Público",
          moreThanLabel: "MAIS DE",
          termsTitle: "Termos",
          termsSpan: "Condições",
          legalsLabel: "LEGAL CAIPI",
          understandBtn: "ENTENDIDO",
          fields: {
            legalRepresentative: "Nome do Representante Legal",
            businessName: "Nome Comercial",
            businessType: "Tipo",
            email: "Email",
            phone: "Telefone",
            taxId: "CNPJ",
            businessTypeOptions: ["Empresa", "Autônomo"]
          },
          step3Files: [
            { k: 'doc1', l: 'Identidade dos Sócios', d: 'RG ou Passaporte (Frente e Verso em um PDF)' },
            { k: 'doc2', l: 'Contrato Social / Estatutos', d: 'Última versão registrada e vigente' },
            { k: 'doc3', l: 'Comprovante Fiscal', d: 'Download recente do CNPJ' },
            { k: 'doc4', l: 'Balanço Contábil', d: 'Último balanço assinado digitalmente' },
            { k: 'doc5', l: 'Extratos de Impostos', d: 'Últimas 3 declarações apresentadas' },
            { k: 'f1', l: 'Formulário 01', d: '' },
            { k: 'f2', l: 'Formulário 02', d: '' },
            { k: 'f3', l: 'Formulário 03', d: '' },
            { k: 'f4', l: 'Formulário 04', d: '' }
          ]
        },
        ctaSection: {
          title: "Pronto para expandir seu",
          titleSpan: "negócio com o Brasil?",
          desc: "Junte-se às empresas que já otimizam suas operações transfronteiriças com a Caipi. Conta comercial em 24h a custo zero.",
          button: "Abrir Conta",
          moreThanLabel: "MAIS DE",
          countLabel: "70"
        },
        faq: {
          title: "Perguntas Frequentes",
          tag: "FAQ",
          description: "Tudo o que você precisa saber sobre a ponte AR-BR.",
          items: [
            { q: "Caipi Empresas e Caipi App são a mesma coisa?", a: "Não. O Caipi Empresas é a solução para negócios e comércios que precisam cobrar ou pagar via PIX, seja por links de pagamento ou QRs. (Não precisam baixar nenhum aplicativo ou alterar seus sistemas de vendas ou faturamento). O Caipi App é a carteira digital para pessoas que viajam ou precisam enviar dinheiro para o Brasil." },
            { q: "Quanto tempo leva para liquidar um pagamento PIX?", a: "As transferências são em tempo real. Os comerciantes recebem o saldo em ARS em minutos." },
            { q: "Qual é o custo para empresas?", a: "A abertura de conta comercial é gratuita. Cobramos apenas uma taxa de processamento por transação do turista, nunca do lojista." },
            { q: "Preciso de uma conta bancária no Brasil?", a: "Não. A Caipi fornece a infraestrutura nativa para que você possa receber PIX sem estar sediado no Brasil." },
            { q: "Em quais setores posso usar o Caipi Empresa?", a: "Gastronomia, turismo, hotelaria, agências de viagens, exportação-importação, setor imobiliário, vendas em geral e todos os tipos de comércio, exceto apostas e jogos. Seja como pessoa física ou jurídica." }
          ]
        },
        features: {
          title: {
            line1: "Soluções projetadas para",
            line2: "sua agilidade financeira"
          },
          description: "Seja você turista ou uma empresa que opera entre a Argentina e o Brasil, a Caipi tem a ferramenta perfeita.",
          store: {
            appleLabel: "Baixar em",
            googleLabel: "DISPONÍVEL NO",
            appleStore: "App Store",
            googleStore: "Google Play"
          },
          business: {
            tag: "Empresa",
            title: "Caipi Empresas",
            description: "A solução simples e definitiva para cobrar clientes brasileiros e receber pesos na Argentina, sem demoras, sem custo e sem comissões.",
            items: [
              {
                title: "Recebimentos via PIX Instantâneo",
                description: "Seus clientes pagam com seu app de banco habitual. Você recebe o pagamento líquido liquidado na hora e na conta que escolher.",
                icon: "Zap",
                color: "bg-brand-primary/10"
              },
              {
                title: "Gestão Centralizada",
                description: "Painel de controle completo para rastrear vendas, gerar relatórios e administrar filiais.",
                icon: "TrendingUp",
                color: "bg-emerald-400/10"
              }
            ],
            cta: "Abrir Conta"
          },
          personal: {
            tag: "Para você",
            title: "Caipi App",
            description: "Sua companheira ideal para cruzar a fronteira. Pague em qualquer comércio do Brasil como se fosse local.",
            items: [
              {
                title: "Pagamentos QR Universal",
                description: "Escaneie qualquer QR de PIX ou bancos brasileiros e pague com seus pesos argentinos instantaneamente.",
                icon: "Smartphone",
                color: "bg-blue-400/10"
              },
              {
                title: "Congele seu Câmbio",
                description: "Use a função convertir para congelar a taxa de câmbio e adquirir BRL antecipadamente.",
                icon: "Lock",
                color: "bg-purple-400/10"
              }
            ]
          },
          marketLabel: "Mercado BR"
        },
        login: {
            backBtn: "VOLTAR",
            badge: "Acesso Seguro",
            title: "Entre na",
            titleSpan: "sua conta",
            emailLabel: "SEU EMAIL",
            passwordLabel: "SENHA",
            forgotPassword: "ESQUECEU?",
            submitBtn: "ENTRAR AGORA",
            loadingBtn: "AUTORIZANDO...",
            errorFields: "Por favor, preencha todos os campos.",
			invalidCredentials: "Credenciais inválidas.",
            noAccount: "AINDA NÃO TEM CONTA?",
            registerBtn: "REGISTRE-SE AQUI",
            termsLabel: "Termos e Condições",
            metadata: "GLOBAL • BORDERLESS • SECURE"
          }
        },
      EN: {
        hero: {
          tag: "Leading payments AR 🇦🇷 ↔ BR 🇧🇷",
          title: {
            line1: "Your financial",
            line2: "bridge",
            line3: "AR 🇦🇷 ↔ BR 🇧🇷"
          },
          description: "Native solutions for businesses and digital wallet for you. Pay and get paid via PIX instantly.",
          ctaMain: "Open Account",
          ctaSecondary: "How it works",
          stats: [
            { value: "10K+", label: "Users" },
            { value: "$300M+", label: "Processed" },
            { value: "4.5/5", label: "Rating" }
          ],
          mockup: {
            balanceLabel: "Your Balance",
            recentActivityLabel: "Recent Activity",
            saveLabel: "Estimated savings",
            saveDesc: "8.3% better rate",
            viewAll: "View all",
            today: "Today",
            yesterday: "Yesterday",
            recharge: "Recharge Balance"
          },
          activeUsersLabel: "ACTIVE USERS",
          activeUsers: "+10K"
        },
        navbar: {
          links: [
            { name: "Solutions", href: "#soluciones" },
            { name: "Caipi Business", href: "#empresas" },
            { name: "Caipi App", href: "#personal" },
            { name: "FAQ", href: "#faq" }
          ],
          login: "Login",
          cta: "Open Account",
          languageLabel: "Language"
        },
        footer: {
          tagline: "The ultimate financial bridge between AR and BR.",
          copyright: "|2026| ®Caipi. All rights reserved.",
          helpTitle: "Sales contact or technical support?",
          chatLabel: "CHAT",
          productTitle: "Product",
          legalTitle: "LEGAL CAIPI",
          termsLabel: "Terms and conditions",
          apiLabel: "Business API",
          costsLabel: "Costs and Rates",
          countries: ["Argentina", "Brazil", "Global"],
          socials: [
            { name: "Instagram", url: "https://www.instagram.com/caipi.app/" },
            { name: "LinkedIn", url: "https://ar.linkedin.com/company/caipi-app" },
            { name: "Twitter", url: "https://x.com/caipi_app?s=11&t=czCzBagDrE4ub31Bd1KSCg" }
          ]
        },
        trust: {
          title: "Companies that trust us",
          description: "Some of the businesses and companies in Argentina and Brazil that are already optimizing their payments and collections with Caipi.",
          companies: [
            { name: "Shell 4 Bocas", industry: "Energy", logo: "input_file_0.png" },
            { name: "LA REGINA LODGE", industry: "Hospitality", logo: "input_file_4.png" },
            { name: "Ray Bus", industry: "Transport", logo: "input_file_2.png" },
            { name: "Nordemaq", industry: "Agroindustrial", logo: "input_file_3.png" },
            { name: "Lion Global", industry: "Consulting", logo: "input_file_1.png" },
            { name: "FLORIPABEACH", industry: "Tourism", logo: "input_file_5.png" }
          ]
        },
        converter: {
          title: "Total transparency.",
          titleSpan: "No surprises.",
          titleEnd: "",
          description: "Calculate your operations. We use the real exchange rate, updated to the second.",
          sendLabel: "You send",
          receiveLabel: "You receive",
          netReceiptLabel: "Net reception",
          guaranteedRate: "This exchange rate {rate} ARS is frozen for 20 minutes when starting the transaction.",
          features: [
            { title: "Direct Exchange", desc: "Without passing through dollars. ARS ↔ BRL directly." },
            { title: "Mobile Experience", desc: "Scan the PIX code and you're done. As easy as a local payment." }
          ],
          cta: "SIMULATE CONVERSION",
          frozenRateBadge: "Frozen Rate",
          calculatorTitle: "Caipi Calculator",
          liveRateLabel: "Live Rate",
          guaranteedRateTitle: "Guaranteed Rate",
          appFunctionNote: "(Convert function in APP)"
        },
        registration: {
          sidebarTitle: "Join Caipi with no costs or commissions.",
          sidebarDesc: "Complete the steps and start operating borderless in less than 24h.",
          stepLabel: "Step",
          steps: ["Entity", "Resources", "Documentation"],
          supportLabel: "Priority support • caipi.app",
          step1Title: "Business Information",
          step1Desc: "Let's start with the basic data of your company or activity.",
          step1Btn: "Next Step",
          step2Title: "Downloadable Resources",
          step2Desc: "Download and complete these 4 documents to register. *Don't forget to sign them.",
          step2Btn: "Continue to Upload Files",
          step3Title: "Required Documentation",
          step3Desc: "Attach these 9 files so we can validate your account.",
          step3Btn: "Finish Registration",
          backBtn: "Back",
          successTitle: "Request Sent!",
          successDesc: "We have received your data. You will soon receive contact from our sales team.",
          successBtn: "Understood",
          digitalizing: "Digitalizing",
          digitalized: "Digitalized",
          attach: "Attach",
          uploading: "Uploading",
          uploadSuccess: "Completed",
          uploadError: "Upload failed",
          closeLabel: "Close",
          filesLabel: "files",
          publicLabel: "Public",
          moreThanLabel: "MORE THAN",
          termsTitle: "Terms",
          termsSpan: "Conditions",
          legalsLabel: "CAIPI LEGAL",
          understandBtn: "UNDERSTOOD",
          fields: {
            legalRepresentative: "Legal Representative Name",
            businessName: "Business Name",
            businessType: "Type",
            email: "Email",
            phone: "Phone",
            taxId: "Tax ID",
            businessTypeOptions: ["Company", "Freelancer"]
          },
          step3Files: [
            { k: 'doc1', l: 'Partner Identity', d: 'ID or Passport (Front and Back in one PDF)' },
            { k: 'doc2', l: 'Articles of Association', d: 'Latest registered and current version' },
            { k: 'doc3', l: 'Tax ID Certificate', d: 'Recent download from Tax Authority' },
            { k: 'doc4', l: 'Financial Statements', d: 'Latest balance sheet digitally signed' },
            { k: 'doc5', l: 'Tax Returns (Quarter)', d: 'Last 3 declarations submitted' },
            { k: 'f1', l: 'Form 01', d: '' },
            { k: 'f2', l: 'Form 02', d: '' },
            { k: 'f3', l: 'Form 03', d: '' },
            { k: 'f4', l: 'Form 04', d: '' }
          ]
        },
        ctaSection: {
          title: "Ready to expand your",
          titleSpan: "business with Brazil?",
          desc: "Join the companies already optimizing their cross-border operations with Caipi. Business account in 24h at zero cost.",
          button: "Open Account",
          moreThanLabel: "MORE THAN",
          countLabel: "70"
        },
        faq: {
          title: "Frequently Asked Questions",
          tag: "FAQ",
          description: "Everything you need to know about the AR-BR bridge.",
          items: [
            { q: "Are Caipi Business and Caipi App the same thing?", a: "No. Caipi Business is the solution for businesses and merchants who need to collect or pay via PIX, whether through payment links or QRs. (No need to download any App or change their sales or billing systems). Caipi App is the digital wallet for individuals traveling or needing to send money to Brazil." },
            { q: "How long does it take to settle PIX payments?", a: "Transfers are real-time. Merchants receive funds in ARS within minutes." },
            { q: "What is the cost for businesses?", a: "Opening a business account is free. We only charge a processing fee per transaction to the tourist, never to the merchant." },
            { q: "Do I need a Brazilian bank account?", a: "No. Caipi provides the native infrastructure so you can receive PIX without being in Brazil." },
            { q: "In which sectors can I use Caipi Business?", a: "Gastronomy, tourism, hospitality, travel agencies, export-import, real estate, general sales, and all types of commerce except for betting and gambling. Whether as an individual or a legal entity." }
          ]
        },
        features: {
          title: {
            line1: "Solutions designed for",
            line2: "your financial agility"
          },
          description: "Whether you're a tourist or a business operating between Argentina and Brazil, Caipi has the perfect tool.",
          store: {
            appleLabel: "Download on the",
            googleLabel: "GET IT ON",
            appleStore: "App Store",
            googleStore: "Google Play"
          },
          business: {
            tag: "Business",
            title: "Caipi Business",
            description: "The simple and definitive solution to charge Brazilian customers and receive pesos in Argentina, with no delays, no costs, and no commissions.",
            items: [
              {
                title: "Instant PIX Payments",
                description: "Your customers pay with their usual bank app. You receive the net payment settled instantly in the account of your choice.",
                icon: "Zap",
                color: "bg-brand-primary/10"
              },
              {
                title: "Centralized Management",
                description: "Full control panel to track sales, generate reports, and manage branches.",
                icon: "TrendingUp",
                color: "bg-emerald-400/10"
              }
            ],
            cta: "Open Account"
          },
          personal: {
            tag: "For you",
            title: "Caipi App",
            description: "Your ideal companion to cross the border. Pay at any business in Brazil like a local.",
            items: [
              {
                title: "Universal QR Payments",
                description: "Scan any PIX or Brazilian bank QR and pay with your Argentine pesos instantly.",
                icon: "Smartphone",
                color: "bg-blue-400/10"
              },
              {
                title: "Freeze your Exchange Rate",
                description: "Use the convert function to freeze the exchange rate and acquire BRL in advance.",
                icon: "Lock",
                color: "bg-purple-400/10"
              }
            ]
          },
          marketLabel: "Market BR"
        },
        login: {
            backBtn: "BACK",
            badge: "Secure Access",
            title: "Sign in to",
            titleSpan: "your account",
            emailLabel: "YOUR EMAIL",
            passwordLabel: "PASSWORD",
            forgotPassword: "FORGOT?",
            submitBtn: "ENTER NOW",
            loadingBtn: "AUTHORIZING...",
            errorFields: "Please, fill all fields.",
			invalidCredentials: "Invalid credentials.",
            noAccount: "DON'T HAVE AN ACCOUNT?",
            registerBtn: "REGISTER HERE",
            termsLabel: "Terms and Conditions",
            metadata: "GLOBAL • BORDERLESS • SECURE"
          }
		}
};
