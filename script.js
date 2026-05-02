const imageInput = document.getElementById('imageInput');
const imageToCrop = document.getElementById('imageToCrop');
const cropButton = document.getElementById('cropButton');
const generateBtn = document.getElementById('generateBtn');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

let cropper;
let croppedImageDataURL = "";

// 1. Xử lý khi chọn ảnh
imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageToCrop.src = event.target.result;
            document.getElementById('cropArea').style.display = 'block';
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 1, // Cắt hình vuông cho dễ khớp
                viewMode: 1
            });
        };
        reader.readAsDataURL(file);
    }
};

// 2. Xác nhận cắt ảnh
cropButton.onclick = () => {
    croppedImageDataURL = cropper.getCroppedCanvas().toDataURL('image/png');
    document.getElementById('cropArea').style.display = 'none';
    alert("Đã nhận ảnh đại diện!");
};

// 3. Ghép ảnh và tên vào phôi
generateBtn.onclick = () => {
    const name = document.getElementById('userName').value;
    if (!name || !croppedImageDataURL) {
        alert("Vui lòng chọn ảnh và nhập tên!");
        return;
    }

    const template = new Image();
    template.crossOrigin = "anonymous"; // Tránh lỗi bảo mật khi tải ảnh về máy
    template.src = 'phoi-thiep.jpg'; // Tên file ảnh bạn đã upload lên GitHub

    template.onload = () => {
        mainCanvas.width = template.width;
        mainCanvas.height = template.height;

        // Vẽ phôi thiệp làm nền
        ctx.drawImage(template, 0, 0);

        // Vẽ ảnh cá nhân (Bạn cần chỉnh 4 số này để khớp vị trí trên thiệp của bạn)
        // Cấu trúc: drawImage(ảnh, x, y, rộng, cao)
        const userImg = new Image();
        userImg.src = croppedImageDataURL;
        userImg.onload = () => {
            // VÍ DỤ: Đặt ảnh tại tọa độ x=340, y=200, kích thước 400x400
            ctx.drawImage(userImg, 340, 200, 400, 400); 

            // Viết tên người dùng
            ctx.font = "bold 50px Arial"; // Bạn có thể đổi chữ Arial thành font khác
            ctx.fillStyle = "#000000"; // Màu chữ (đen), hãy đổi nếu cần
            ctx.textAlign = "center";
            // Đặt tên ở giữa chiều rộng (width/2) và chiều cao tùy ý (vd: 850)
            ctx.fillText(name.toUpperCase(), mainCanvas.width / 2, 850);

            document.getElementById('resultArea').style.display = 'block';
            window.scrollTo(0, document.body.scrollHeight); // Tự cuộn xuống dưới xem kết quả
        };
    };
    
    template.onerror = () => {
        alert("Lỗi: Không tìm thấy file phoi-thiep.jpg. Hãy kiểm tra lại tên file trên GitHub!");
    };
};

// 4. Tải thiệp về
document.getElementById('downloadBtn').onclick = () => {
    const link = document.createElement('a');
    link.download = 'thiep-moi-cua-toi.png';
    link.href = mainCanvas.toDataURL('image/png');
    link.click();
};
