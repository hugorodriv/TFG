<script>
    let profilePic, fileinput;
    let cropActive = false;
    let cropPos = { x: 0, y: 0 };
    let imageSize = { width: 0, height: 0 };
    let dragging = false;
    let dragOffset = { x: 0, y: 0 };
    let cropSize = 0;

    let croppedImage = null;
    let finalImage = null;

    let uploaded = false;

    export let finalProfilePicture = null;

    // Handle selection of file
    const onFileSelected = (e) => {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            profilePic = e.target?.result;
            // Reset cropper when new image is loaded
            cropActive = false;
            croppedImage = null;
            finalImage = null;

            // Get image dimensions once loaded
            setTimeout(() => {
                const img = document.getElementById("original-image");
                if (img) {
                    imageSize = {
                        width: img.clientWidth,
                        height: img.clientHeight,
                    };

                    // Set initial cropper size to the smaller dimension (square)
                    cropSize = Math.min(imageSize.width, imageSize.height);

                    cropPos = { x: 0, y: 0 };
                    cropActive = true;
                }

                //delay necessary for the DOM to update
                cropFunction();
            }, 100);
        };
    };

    // Start dragging
    function startDrag(e) {
        if (!cropActive) return;

        dragging = true;
        const cropperRect = document
            .querySelector(".cropper-overlay")
            .getBoundingClientRect();

        // Calculate offset within the cropper
        dragOffset = {
            x: e.clientX - cropperRect.left,
            y: e.clientY - cropperRect.top,
        };

        // Prevent default behavior to avoid text selection
        e.preventDefault();
        cropFunction();
    }

    // Handle dragging
    function handleDrag(e) {
        if (!dragging) return;

        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate new position based on mouse and offset
        let newX = e.clientX - rect.left - dragOffset.x;
        let newY = e.clientY - rect.top - dragOffset.y;

        // Constrain to image boundaries
        newX = Math.max(0, Math.min(newX, imageSize.width - cropSize));
        newY = Math.max(0, Math.min(newY, imageSize.height - cropSize));

        cropPos = { x: newX, y: newY };
        cropFunction();
    }

    // End dragging
    function endDrag() {
        dragging = false;
    }

    // Crop function
    function cropFunction() {
        if (!profilePic || !cropActive) return;

        const canvas = document.createElement("canvas");
        const img = document.getElementById("original-image");

        // Set canvas size to cropper size
        canvas.width = cropSize;
        canvas.height = cropSize;

        // Calculate scale factor between displayed image and actual image
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            img,
            cropPos.x * scaleX,
            cropPos.y * scaleY,
            cropSize * scaleX,
            cropSize * scaleY,
            0,
            0,
            cropSize,
            cropSize,
        );

        // Get cropped image as data URL
        croppedImage = canvas.toDataURL();
    }

    function returnPictureToParent() {
        console.log("Uploading picture");
        finalProfilePicture = croppedImage;

        uploaded = true;
    }
</script>

<div class="bg-gray-200 max-w-[80%] m-auto rounded p-5 mt-5 text-center">
    <button
        class="bg-blue-600 text-white px-4 py-2 rounded"
        on:click={() => {
            fileinput.click();
        }}
    >
        {#if !profilePic}
            Choose Image
        {:else}
            Choose different Image
        {/if}
    </button>

    <input
        style="display:none"
        type="file"
        accept=".jpg, .jpeg, .png"
        on:change={(e) => onFileSelected(e)}
        bind:this={fileinput}
    />

    {#if profilePic}
        <!-- svelte-ignore a11y_no_static_element_interactions -->

        <div
            class="mt-6 mx-auto flex-col justify-center relative"
            on:mousemove={handleDrag}
            on:mouseup={endDrag}
            on:mouseleave={endDrag}
        >
            <div class="relative inline-block">
                <img
                    id="original-image"
                    src={profilePic}
                    alt="Provided by user"
                    class="w-full h-auto rounded shadow-md"
                />

                {#if cropActive}
                    <div class="absolute inset-0 bg-[rgba(0,0,0,0.4)]"></div>
                    <div
                        style="
                            width: {cropSize}px; 
                            height: {cropSize}px; 
                            left: {cropPos.x}px; 
                            top: {cropPos.y}px;
                        "
                        class="cropper-overlay absolute border-2 border-white cursor-move"
                        on:mousedown={startDrag}
                    >
                        <img
                            src={croppedImage}
                            alt="selected region"
                            class="w-full h-auto rounded shadow-md"
                        />
                    </div>
                {/if}
            </div>
        </div>

        <button
            class="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            on:click={() => returnPictureToParent()}
            disabled={!cropActive}
        >
            Crop
        </button>
    {/if}
</div>
