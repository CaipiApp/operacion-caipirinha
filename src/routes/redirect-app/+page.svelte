<script lang="ts">
    import { onMount } from "svelte";
    onMount(() => {
        const userAgent = window.navigator.userAgent
        const platform = window.navigator.platform

        //Declaramos los posibles sistemas operativos
        const macOsPlataforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
        const windowsPlataforms = ['Win32', 'Win64', 'Windows', 'WinCE']
        const iosPlataforms = ['iPhone', 'iPad', 'iPod']

        //Verificiamos el sistema operativo y rerigimos a la URL correspondiente
        if (iosPlataforms.includes(platform)){
            window.location.href = 'https://apps.apple.com/ar/app/caipi/id6755209840'
        }else if (/Android/.test(userAgent)){
            window.location.href = 'https://play.google.com/store/apps/details?id=caipi.app.com'
        }

    });

</script>