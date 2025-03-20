export function fileSelectedLogic(e) {
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
}
