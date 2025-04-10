<script>
    let profilePic, fileinput;
    let cropActive = false;
    let cropPos = { x: 0, y: 0 };
    let cropSize = 0;

    let imageSize = { width: 0, height: 0 };

    let dragging = false;
    let dragOffset = { x: 0, y: 0 };

    let resizing = false;
    let resizeData = {
        direction: { right: false, left: false, top: false, bottom: false },
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
    };

    /**
     * @type {string | null}
     */
    let croppedImage = null;
    let finalImage = null;

    export let finalProfilePicture = null;

    function getClientPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else {
            return { x: e.clientX, y: e.clientY };
        }
    }

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

                    cropSize = Math.min(imageSize.width, imageSize.height);

                    cropPos = { x: 0, y: 0 };
                    cropActive = true;
                }

                //delay necessary for the loading of the image
                cropFunction();
            }, 200);
        };
    };

    function startDrag(e) {
        if (!cropActive) return;

        const { x, y } = getClientPos(e);

        const cropperElement = document.querySelector(".cropper-overlay");
        const cropperRect = cropperElement.getBoundingClientRect();

        const borderSensitivity = 10;

        const isOnRightEdge =
            Math.abs(x - cropperRect.right) <= borderSensitivity;
        const isOnLeftEdge =
            Math.abs(x - cropperRect.left) <= borderSensitivity;
        const isOnTopEdge = Math.abs(y - cropperRect.top) <= borderSensitivity;
        const isOnBottomEdge =
            Math.abs(y - cropperRect.bottom) <= borderSensitivity;

        const resizeDirection = {
            right: isOnRightEdge,
            left: isOnLeftEdge,
            top: isOnTopEdge,
            bottom: isOnBottomEdge,
        };

        if (isOnRightEdge || isOnLeftEdge || isOnTopEdge || isOnBottomEdge) {
            dragging = false;
            resizing = true;
            resizeData = {
                direction: resizeDirection,
                startX: x,
                startY: y,
                startWidth: cropSize,
                startHeight: cropSize,
                startLeft: cropPos.x,
                startTop: cropPos.y,
            };
        } else {
            // not on the edge
            dragging = true;
            resizing = false;
            dragOffset = {
                x: x - cropperRect.left,
                y: y - cropperRect.top,
            };
        }

        e.preventDefault();
        cropFunction();
    }

    function handleDrag(e) {
        if (!dragging && !resizing) return;

        const { x, y } = getClientPos(e);

        const rect = e.currentTarget.getBoundingClientRect();

        if (resizing) {
            const deltaX = x - resizeData.startX;
            const deltaY = y - resizeData.startY;

            let newSize = resizeData.startWidth;
            let newX = resizeData.startLeft;
            let newY = resizeData.startTop;

            if (resizeData.direction.right) {
                newSize = Math.min(
                    resizeData.startWidth + deltaX,
                    imageSize.width - resizeData.startLeft,
                    imageSize.height - resizeData.startTop,
                );
            } else if (resizeData.direction.left) {
                const possibleSize = resizeData.startWidth - deltaX;
                if (possibleSize > 128) {
                    newSize = Math.min(
                        possibleSize,
                        resizeData.startLeft + resizeData.startWidth,
                        imageSize.height - resizeData.startTop,
                    );
                    newX =
                        resizeData.startLeft +
                        (resizeData.startWidth - newSize);
                }
            }

            if (resizeData.direction.bottom) {
                newSize = Math.min(
                    newSize,
                    resizeData.startHeight + deltaY,
                    imageSize.height - resizeData.startTop,
                );
            } else if (resizeData.direction.top) {
                const possibleSize = resizeData.startHeight - deltaY;
                if (possibleSize > 128) {
                    newSize = Math.min(
                        newSize,
                        possibleSize,
                        resizeData.startTop + resizeData.startHeight,
                    );
                    newY =
                        resizeData.startTop +
                        (resizeData.startHeight - newSize);
                }
            }

            const smallestSize = Math.max(128, newSize);

            cropSize = smallestSize;
            cropPos = { x: newX, y: newY };
        } else if (dragging) {
            let newX = x - rect.left - dragOffset.x;
            let newY = y - rect.top - dragOffset.y;

            newX = Math.max(0, Math.min(newX, imageSize.width - cropSize));
            newY = Math.max(0, Math.min(newY, imageSize.height - cropSize));

            cropPos = { x: newX, y: newY };
        }

        cropFunction();
    }

    function endDrag() {
        dragging = false;
        resizing = false;
    }

    function updateCropperCursor(e) {
        if (!cropActive) return;

        const cropperElement = document.querySelector(".cropper-overlay");
        if (!cropperElement) return;

        const cropperRect = cropperElement.getBoundingClientRect();
        const borderSensitivity = 10;

        const isOnRightEdge =
            Math.abs(e.clientX - cropperRect.right) <= borderSensitivity;
        const isOnLeftEdge =
            Math.abs(e.clientX - cropperRect.left) <= borderSensitivity;
        const isOnTopEdge =
            Math.abs(e.clientY - cropperRect.top) <= borderSensitivity;
        const isOnBottomEdge =
            Math.abs(e.clientY - cropperRect.bottom) <= borderSensitivity;

        if (
            (isOnTopEdge && isOnLeftEdge) ||
            (isOnBottomEdge && isOnRightEdge)
        ) {
            cropperElement.style.cursor = "nwse-resize";
        } else if (
            (isOnTopEdge && isOnRightEdge) ||
            (isOnBottomEdge && isOnLeftEdge)
        ) {
            cropperElement.style.cursor = "nesw-resize";
        } else if (isOnTopEdge || isOnBottomEdge) {
            cropperElement.style.cursor = "ns-resize";
        } else if (isOnLeftEdge || isOnRightEdge) {
            cropperElement.style.cursor = "ew-resize";
        } else {
            cropperElement.style.cursor = "move";
        }
    }

    function cropFunction() {
        if (!profilePic || !cropActive) return;

        const canvas = document.createElement("canvas");
        const img = document.getElementById("original-image");

        canvas.width = cropSize;
        canvas.height = cropSize;

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
        const MAX_SIZE = 128;
        const canvas = document.createElement("canvas");
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        let ctx = canvas.getContext("2d");

        var img = new Image();
        img.src = croppedImage;

        img.onload = function () {
            // Clip to circle
            ctx.beginPath();
            ctx.arc(MAX_SIZE / 2, MAX_SIZE / 2, MAX_SIZE / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw image
            ctx.drawImage(img, 0, 0, MAX_SIZE, MAX_SIZE);

            // Convert to Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    finalProfilePicture = new File([blob], "pfp.jpg", {
                        type: "image/jpg",
                    });
                }
            }, "image/png");
        };
    }
</script>

<div class=" m-auto rounded p-5 mt-5 text-center">
    <div class="w-full inline-flex shadow-xs text-center justify-center">
        {#if !profilePic}
            <button
                on:click={() => {
                    fileinput.click();
                }}
                class="bg-white hover:bg-blue-100 hover:text-blue-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-lg"
            >
                Choose Image
            </button>
        {:else}
            <button
                on:click={() => {
                    fileinput.click();
                }}
                class="bg-red-50 hover:bg-red-100 hover:text-red-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-lg"
            >
                Choose different image
            </button>
        {/if}
    </div>

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
            on:touchstart|preventDefault={startDrag}
            on:touchmove={handleDrag}
            on:touchend={endDrag}
        >
            <div class="relative inline-block">
                <img
                    id="original-image"
                    src={profilePic}
                    alt="Provided by user"
                    class="w-full h-auto rounded shadow-md"
                />

                {#if cropActive}
                    <div class="absolute inset-0 bg-[rgba(0,0,0,0.6)]"></div>
                    <div
                        style="
                            width: {cropSize}px; 
                            height: {cropSize}px; 
                            left: {cropPos.x}px; 
                            top: {cropPos.y}px;
                        "
                        class="cropper-overlay absolute border-2 border-black border-dashed cursor-move"
                        on:mousedown={startDrag}
                        on:mousemove={updateCropperCursor}
                        on:touchstart={startDrag}
                        on:touchmove={handleDrag}
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
            on:click={() => returnPictureToParent()}
            disabled={!cropActive}
            class="hover:bg-blue-100 hover:text-blue-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-lg"
        >
            Crop
        </button>
    {/if}
</div>
