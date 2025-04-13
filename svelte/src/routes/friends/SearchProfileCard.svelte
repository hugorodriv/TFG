<script>
    import { onMount } from "svelte";
    export let username;
    export let name;
    export let img_url;

    /**
     * @type {string}
     */
    let image_data;

    onMount(() => {
        // if no img data, create blue bg and white letter (default pfp)
        const letter = name.slice(0, 1).toUpperCase();
        const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

        image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
        if (img_url) {
            (async () => {
                try {
                    const response = await fetch(img_url);
                    if (!response.ok) throw new Error("Failed to fetch image");

                    const blob = await response.blob();

                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        const base64data = String(reader.result);

                        image_data = base64data;
                    };
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            })().then(() => {});
        }
    });
</script>

<li class="py-3">
    <a href="/p/{username}" class="flex items-center">
        <div class="shrink-0">
            <img
                class="w-8 h-8 rounded-full"
                alt="{username} profile"
                src={image_data}
            />
        </div>
        <div class="flex-1 min-w-0 ms-4">
            <p class="text-sm font-medium text-gray-900 truncate">
                @{username}
            </p>
            <p class="text-sm text-gray-500 truncate">
                {name}
            </p>
        </div>
    </a>
</li>
