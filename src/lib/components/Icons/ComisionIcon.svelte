<script lang="ts">
  export let width = "24px"; 
  export let height = "24px";
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  role="img" 
  aria-label="Cobro de comisiones"
  width={width} 
  height={height} 
>
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- % comisión -->
    <path d="M7 7l10 10"/>
    <circle cx="8" cy="8" r="1.5"/>
    <circle cx="16" cy="16" r="1.5"/>

    <!-- flecha de cobro (entrada) -->
    <path d="M20 12H11"/>
    <path d="M14 9l-3 3 3 3"/>
  </g>
</svg>
