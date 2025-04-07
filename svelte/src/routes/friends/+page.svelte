<script>
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount } from "svelte";

    export let data;

    let accountData;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
    });
</script>

<Navbar />

<div class="space-y-4 p-4 max-w-md m-auto">
    <p class="mt-10 text-center text-xl">Friend requests</p>

    <p class="mt-10 text-center text-xl">Pending</p>
    <p>{data.pending}</p>
    <p class="mt-10 text-center text-xl">Sent</p>
    <p>{data.sentPending}</p>
</div>

<Bottombar />
