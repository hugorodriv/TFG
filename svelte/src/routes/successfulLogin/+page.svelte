<script>
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";

    export let data;
    onMount(() => {
        localStorage.clear();
        let accDataToStore = data.accData;
        let imageStorage;

        // if no img data, create blue bg and white letter (default pfp)
        if (!accDataToStore.img_url) {
            const letter = accDataToStore.name.slice(0, 1).toUpperCase();
            const svg = `
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="#007BFF"/>
                <text x="25" y="25" font-size="25" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

            imageStorage = localStorage.setItem(
                "pfp",
                `data:image/svg+xml;base64,${btoa(svg)}` || null,
            );
        } else {
            (async () => {
                try {
                    const response = await fetch(accDataToStore.img_url);
                    if (!response.ok) throw new Error("Failed to fetch image");

                    const blob = await response.blob();

                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        const base64data = reader.result;

                        imageStorage = localStorage.setItem("pfp", base64data);
                    };
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            })();
        }
        console.log("refreshed cookies");
        localStorage.setItem("accData", JSON.stringify(accDataToStore));

        // automatic redirect after populating. show link in case redirect doesnt work
        if (typeof window !== "undefined") {
            goto("/");

            let redirected = false;

            setTimeout(() => {
                if (!redirected) {
                    const link = document.getElementById("link");
                    if (link) link.style.display = "block";
                }
            }, 500);
        }
    });
</script>

<a
    id="link"
    class="mt-10 text-center text-blue-600 underline"
    href="/"
    style="display:none;">If you have not been redirected, click here</a
>
