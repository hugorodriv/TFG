<script>
    import { onMount } from "svelte";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";
    import Bottombar from "./Bottombar.svelte";

    export let data;
    const session = data.session;

    let accountData;
    let pfp;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp");
    });
</script>

<div>
    {#if !session}
        <Auth />
    {:else}
        <Navbar />
        <Bottombar homeActive={true} />
    {/if}
</div>

<!-- Icons -->
<!-- map: Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
<!-- rest: https://github.com/themesberg/flowbite-icons -->
