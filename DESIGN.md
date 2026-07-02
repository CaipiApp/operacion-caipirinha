# Caipi — Design System Notes

Este documento registra el estado real del sistema de diseño detectado durante la
auditoría de julio 2026, y una propuesta de consolidación. Es solo documentación —
no implica ningún cambio de código todavía.

## Estado actual: 3 sistemas de color conviviendo

### 1. Marketing / landing (dark mode) — el más nuevo

Definido en `tailwind.config.js` bajo `theme.extend.colors.brand`:

```js
brand: {
  primary: '#C5E644',   // verde lima, acento principal
  secondary: '#689B0F',
  dark: '#070904',      // fondo base
  gray: '#151810',      // fondo secundario / cards
  muted: '#888888'      // texto secundario
}
```

**Dónde se usa:** toda la landing (`src/lib/components/landing/*`), el error/404
global (`src/routes/+error.svelte`), y ahora también el flujo de transferencia
bancaria de `/registro` (`CUILForm`, `PagadorForm`, `CBUForm`, `Verificando`).

### 2. Widget de pagos legacy (verde claro) — el más extendido

Definido en el mismo archivo, colores sueltos (no agrupados bajo un namespace):

```js
darkPrimary: '#C3C8B0',
secondary: '#a9d800',
```

Más otros tokens dispersos usados junto a estos: `primary` (Tailwind default,
distinto de `brand.primary`), `mediumGray`, `darkGray`.

**Dónde se usa:** `src/lib/components/widget/Wrapper.svelte` (compartido),
`src/routes/pagos/[uuid]/+page.svelte` (pantalla de confirmación de pago con
monto real y botón "PAGAR"), `src/routes/pagos/qr/[uuid]/+page.svelte`,
`src/routes/pagos/terminosYCondiciones/+page.svelte`, `Camera4.svelte` (captura
de DNI).

**Por qué no se tocó en esta sesión:** es el flujo de pago real, en producción,
con transacciones de dinero. Cualquier cambio ahí necesita su propia sesión con
tiempo para probar cada paso (CUIL → CBU → DNI → verificación → confirmación de
pago) antes de tocar nada.

### 3. MercadoPago (azul, tema claro) — probablemente intencional

Clases con sufijo `-mp` (`btn-mp`, `input-light-mp`, `label-light-mp`) definidas
en `src/app.css`, usadas por la variante MercadoPago de los mismos formularios
(`CUILFormMP`, `PagadorFormMP`, etc., vía `WrapperMP.svelte`).

**Por qué probablemente es intencional:** replicar la identidad visual de
MercadoPago dentro de un flujo de pago con MercadoPago es una práctica común
para generar confianza ("esto se ve como MercadoPago, es seguro"). No se tocó
por esta razón, a confirmar con el equipo de producto.

## Consecuencia práctica

No hay una sola fuente de verdad de diseño. Cada feature nueva que se construya
sin saber esto va a:
- Copiar el patrn "sistema 1" o "sistema 2" según qué archivo se copie como
  referencia, perpetuando la fragmentación.
- Generar inconsistencias visibles cuando un usuario navega entre marketing →
  registro → pago (que es exactamente el funnel de conversión completo).

## Propuesta de consolidación (para evaluar, no implementado)

1. **Definir una sola fuente de tokens** en `tailwind.config.js`, retirando
   `darkPrimary`/`secondary` sueltos y los colores default de Tailwind
   (`primary`, `mediumGray`, `darkGray`) reutilizados de forma ad-hoc.
2. **Decidir explícitamente** si el flujo de pago (`/pagos/*`, `/registro`)
   debe verse como la landing (dark mode, sistema 1) o mantener una identidad
   propia de "checkout" — pero que sea una decisión consciente, no un
   accidente histórico.
3. **Mantener el tema MercadoPago intencionalmente separado** (sistema 3),
   documentado como excepción justificada, no como inconsistencia.
4. Una vez decidido, migrar `Wrapper.svelte` y las pantallas de
   `/pagos/[uuid]` y `/pagos/qr/[uuid]` en una sesión dedicada, con pruebas
   paso a paso de cada pantalla del flujo de pago antes de mergear.

## Referencia rápida de archivos por sistema

| Sistema | Archivos clave |
|---|---|
| 1. Dark mode (marketing) | `tailwind.config.js` (`theme.colors.brand`), `src/lib/components/landing/*`, `src/routes/+error.svelte` |
| 2. Legacy widget (verde claro) | `tailwind.config.js` (`darkPrimary`, `secondary`), `src/lib/components/widget/Wrapper.svelte`, `src/routes/pagos/[uuid]/+page.svelte`, `src/routes/pagos/qr/[uuid]/+page.svelte`, `Camera4.svelte` |
| 3. MercadoPago (azul) | `src/app.css` (clases `*-mp`), `src/lib/components/widget/transferenciaMP/*` |
