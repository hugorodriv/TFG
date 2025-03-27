<script>
    import { onMount } from "svelte";
    import { SignOut } from "@auth/sveltekit/components";
    import { browser } from "$app/environment";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";

    export let data;
    const session = data.session;

    let accountData;
    let pfp;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData")) || null;
        pfp = localStorage.getItem("pfp");
    });
</script>

<div>
    {#if !session}
        <Auth />
    {:else}
        <Navbar />
        <!-- <p> -->
        <!--     {accountData?.name} -->
        <!-- </p> -->
        <!-- <img alt="pfp" src={pfp} /> -->
        <!---->
        <!-- <div -->
        <!--     class="justify-center max-w-48 mt-24 p-5 bg-yellow-200 border-yellow-700 border text-3xl flex text-center m-auto" -->
        <!-- > -->
        <!--     <a href="./successfulLogin">Redirect </a> -->
        <!-- </div> -->
        <!-- <div> -->
        <!--     <SignOut -->
        <!--         class="justify-center max-w-96 mt-2 p-5 bg-red-200 border-red-700 border text-3xl flex text-center m-auto" -->
        <!--     /> -->
        <!-- </div> -->
    {/if}
</div>
