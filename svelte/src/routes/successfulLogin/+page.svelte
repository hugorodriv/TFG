<script>
    import { onMount } from "svelte";

    export let data;
    onMount(() => {
        localStorage.clear();
        let accDataToStore = data.accData;
        let imageStorage;

        // if no img data, create blue bg and white letter (default pfp)
        localStorage.setItem("accData", JSON.stringify(accDataToStore));
        if (!accDataToStore.img_url) {
            const letter = accDataToStore.name.slice(0, 1).toUpperCase();
            const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

            imageStorage = localStorage.setItem(
                "pfp",
                `data:image/svg+xml;base64,${btoa(svg)}`,
            );
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        } else {
            (async () => {
                try {
                    // bit of a hack, yet industry standard. add unnecessary parameters to URL, so that the browser doesnt try
                    // to cache picture
                    const response = await fetch(
                        `${accDataToStore.img_url}?cacheInvalidation=${Date.now()}`,
                    );
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
            })().then(() => {
                // automatic redirect after populating. show link in case redirect doesnt work
                if (typeof window !== "undefined") {
                    window.location.href = "/";
                }
            });
        }

        if (typeof window !== "undefined") {
            setTimeout(() => {
                const link = document.getElementById("link");
                if (link) link.style.display = "block";
            }, 2000);
        }
    });
</script>

<a
    id="link"
    class="mt-10 text-center text-blue-600 underline"
    href="/"
    style="display:none;">If you have not been redirected, click here</a
>

<div class="mt-28 text-center">
    <svg
        class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
    >
        <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
        />
        <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
        />
    </svg>
</div>
