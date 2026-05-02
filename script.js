const imageInput = document.getElementById('imageInput');
const imageToCrop = document.getElementById('imageToCrop');
const cropButton = document.getElementById('cropButton');
const generateBtn = document.getElementById('generateBtn');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

let cropper;
let croppedImageDataURL = "";

// 1. Khi chọn ảnh -> Hiển thị khung cắt (Cropper)
imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageToCrop.src = event.target.result;
            document.querySelector('.cropper-container').style.display = 'block';
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 1, // Cắt hình vuông
                viewMode: 1
            });
        };
        reader.readAsDataURL(file);
    }
};

// 2. Xác nhận cắt ảnh
cropButton.onclick = () => {
    croppedImageDataURL = cropper.getCroppedCanvas().toDataURL();
    alert("Đã cắt ảnh thành công!");
    document.querySelector('.cropper-container').style.display = 'none';
};

// 3. Tiến hành vẽ thiệp
generateBtn.onclick = () => {
    const name = document.getElementById('userName').value.toUpperCase();
    if (!name || !croppedImageDataURL) {
        alert("Vui lòng nhập tên và chọn/cắt ảnh!");
        return;
    }

    const template = new Image();
    template.src = 'https://your-link-to-template.jpg'; // THAY ĐƯỜNG DẪN ẢNH PHÔI CỦA BẠN VÀO ĐÂY
    template.crossOrigin = "Anonymous"; // Tránh lỗi bảo mật ảnh

    template.onload = () => {
        mainCanvas.width = template.width;
        mainCanvas.height = template.height;

        // Vẽ phôi thiệp
        ctx.drawImage(template, 0, 0);

        // Vẽ ảnh cá nhân đã cắt (Giả sử vị trí x=300, y=200, rộng=400, cao=400)
        const userImg = new Image();
        userImg.src = croppedImageDataURL;
        userImg.onload = () => {
            // Tùy chỉnh tọa độ x, y theo phôi của bạn
            ctx.drawImage(userImg, 340, 250, 400, 400); 

            // Viết tên
            ctx.font = "bold 50px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText(name, mainCanvas.width / 2, 850); // x ở giữa, y ở dưới

            document.getElementById('resultArea').style.display = 'block';
        };
    };
};

// 4. Nút tải về
document.getElementById('downloadBtn').onclick = () => {
    const link = document.createElement('a');
    link.download = 'thiep-moi.png';
    link.href = mainCanvas.toDataURL();
    link.click();
};