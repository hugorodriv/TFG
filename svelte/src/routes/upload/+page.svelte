<script>
    import { locationStore } from "$lib/stores/location";
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    let uploading = false;
    let successfulUpload = false;

    let compressedFile;
    let imgCompressed = false;

    $: isLocationExpired = locationStore.isExpired();
    /**
     * @type {string}
     */
    let camError;

    /**
     * @type {{ uuid: String; }}
     */
    let accountData;
    /**
     * @type {{ resolved: String; }}
     */
    let location;

    /**
     * @type {String}
     */
    let postText;

    /**
     * @type {String}
     */
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        updateLocation().then(() => {
            location = locationStore.getData();
        });
        checkCameraAvailability().then(() => {});
    });
    onDestroy(() => {
        if (compressedFile) {
            const displayUrl = URL.createObjectURL(compressedFile);
            if (displayUrl && displayUrl.startsWith("blob:")) {
                URL.revokeObjectURL(displayUrl);
            }
        }
    });
    async function updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("error getting location");
        }
    }

    async function success(loc) {
        // Store basic location data first
        locationStore.update(loc.coords.latitude, loc.coords.longitude);
    }

    function error(e) {
        console.error(e);
    }

    async function checkCameraAvailability() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(
                (device) => device.kind === "videoinput",
            );

            if (cameras.length === 0) {
                camError = "Your device doesnt have a compatible camera";
            }
        } catch (err) {
            console.error("Error checking camera:", err);
            camError = "Error checking for cameras";
        }
    }
    /**
     * @param {{ target: { files: any[]; }; }} event
     */
    function handleCameraInput(event) {
        event.preventDefault();
        const target_file = event.target.files[0];
        if (!target_file) {
            console.log("No file provided");
            alert("No file selected");
            return;
        }
        compressImage(target_file);
    }

    function compressImage(img) {
        const MAX_DIMENSION = 1080;
        const JPEG_QUALITY = 0.7;

        imgCompressed = false;

        try {
            const reader = new FileReader();

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                alert("Failed to process image");
            };

            reader.onload = (e) => {
                try {
                    const image = new Image();

                    image.onerror = (error) => {
                        console.error("Image loading error:", error);
                        alert("Failed to load image");
                    };

                    image.onload = () => {
                        try {
                            let width = image.naturalWidth;
                            let height = image.naturalHeight;

                            if (width > height && width > MAX_DIMENSION) {
                                height = Math.round(
                                    (height * MAX_DIMENSION) / width,
                                );
                                width = MAX_DIMENSION;
                            } else if (height > MAX_DIMENSION) {
                                width = Math.round(
                                    (width * MAX_DIMENSION) / height,
                                );
                                height = MAX_DIMENSION;
                            }

                            const canvas = document.createElement("canvas");
                            canvas.width = width;
                            canvas.height = height;

                            const ctx = canvas.getContext("2d");
                            if (!ctx) {
                                throw new Error("Failed to get canvas context");
                            }

                            ctx.drawImage(image, 0, 0, width, height);

                            canvas.toBlob(
                                (blob) => {
                                    compressedFile = new File(
                                        [blob],
                                        img.name,
                                        {
                                            type: "image/jpeg",
                                            lastModified: Date.now(),
                                        },
                                    );

                                    imgCompressed = true;
                                    URL.revokeObjectURL(image.src);
                                },
                                "image/jpeg",
                                JPEG_QUALITY,
                            );
                        } catch (canvasError) {
                            console.error(
                                "Canvas operation error:",
                                canvasError,
                            );
                            alert("Failed to process image");
                        }
                    };
                    image.src = e.target.result;
                } catch (imageError) {
                    console.error("Image creation error:", imageError);
                    alert("Failed to process image");
                }
            };

            reader.readAsDataURL(img);
        } catch (readerError) {
            console.error("FileReader setup error:", readerError);
            alert("Failed to read image file");
        }
    }
    async function uploadPicture() {
        uploading = true;
        //

        if (!location.lat) {
            return;
        }
        const locationInfo = { lat: location.lat, long: location.lon };

        const response = await fetch("./api/upload-post", {
            method: "POST",
            body: JSON.stringify({
                location: locationInfo,
                resolved_location: location.resolved,
                postText: postText,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();

        if (body.uploadLink) {
            const myHeaders = new Headers({ "Content-Type": "image/*" });

            const response_put = await fetch(body.uploadLink, {
                method: "PUT",
                headers: myHeaders,
                body: compressedFile,
            });

            if (!response_put.ok) {
                alert("Error uploading post ");
            } else {
                successfulUpload = true;
            }
        }

        uploading = false;
    }
</script>

<Navbar />
<div class="space-y-4 p-4 max-w-md m-auto">
    {#if !location?.lat || isLocationExpired}
        <a
            href="/"
            class="block mt-10 text-center w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-md"
        >
            Failed to get location
        </a>
    {/if}
    {#if camError}
        <div
            class="mt-10 text-center w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-md"
        >
            {camError}
        </div>
    {:else if imgCompressed}
        <!-- Display picture -->
        <div
            class="mt-10 text-center w-full p-3 bg-blue-100 border border-blue-300 rounded-md"
        >
            {location?.resolved}
        </div>
        <div
            class="relative w-full bg-gray-100 rounded-lg shadow-md overflow-hidden"
        >
            <img
                src={URL.createObjectURL(compressedFile)}
                loading="lazy"
                alt="Camera preview"
                class="w-full h-full object-cover"
            />
            <button
                on:click={() => {
                    if (!successfulUpload) {
                        compressedFile = null;
                        imgCompressed = false;
                    }
                }}
                class="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                aria-label="Reset"
            >
                <svg
                    class="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>

        <textarea
            bind:value={postText}
            id="postText"
            class="min-h-48 my-2 block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write something about your picture :)"
            maxlength="2048"
        ></textarea>
        {#if !uploading && !successfulUpload}
            <button
                on:click={uploadPicture}
                disabled={!location?.lat}
                type="button"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >Upload</button
            >
        {:else if !successfulUpload}
            <div class="text-center">
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
        {:else if successfulUpload}
            <button
                disabled
                type="button"
                class="w-full text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >Uploaded</button
            >
        {/if}
    {:else}
        <!-- Display upload button -->

        {#if !location?.lat || isLocationExpired}{:else}
            <div
                class="mt-10 text-center w-full p-3 bg-blue-100 border border-blue-300 rounded-md"
            >
                {location?.resolved}
            </div>
        {/if}
        <button
            on:click={() => {
                document.getElementById("inputElement").click();
            }}
            class="flex items-center justify-center w-full"
        >
            <label
                for="upload"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
                <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                    <svg
                        class="mb-1 w-8 h-8 text-gray-500"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                        />
                        <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">Take picture</span>
                    </p>
                </div>
            </label>
        </button>

        <form>
            <input
                id="inputElement"
                type="file"
                accept="image/*"
                capture="environment"
                on:change|preventDefault={handleCameraInput}
                class="hidden"
            />
        </form>
    {/if}
</div>
<Bottombar />
