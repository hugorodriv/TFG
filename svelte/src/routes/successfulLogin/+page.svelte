<script>
    import { accountStore } from "$lib/stores/accStore.js";
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";

    export let data;
    accountStore.set(data.accData);
    const redirectLink = data.referer;

    // automatic redirect after populating. show link in case redirect doesnt work
    if (typeof window !== "undefined") {
        goto(redirectLink);
        let redirected = false;

        setTimeout(() => {
            if (!redirected) {
                const link = document.getElementById("link");
                if (link) link.style.display = "block";
            }
        }, 500);
    }
</script>

<a
    id="link"
    class="mt-10 text-center text-blue-600 underline"
    href="/"
    style="display:none;">If you have not been redirected, click here</a
>
