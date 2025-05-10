const cloudName = 'drweim9cu';
const uploadPreset = 'unsigned_preset'; 
const folder = 'dashboard';

function uploadImage() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert('✅ تم رفع الصورة');
      loadImages();
    })
    .catch(err => alert('❌ فشل في الرفع'));
}

function loadImages() {
  fetch('/api/list-images')
    .then(res => res.json())
    .then(images => {
      const container = document.getElementById('images');
      container.innerHTML = '';
      images.forEach(img => {
        const url = img.secure_url;
        container.innerHTML += `
          <div class="col-md-3 mb-4 text-center">
            <img src="${url}" class="img-fluid rounded" />
            <button class="btn btn-sm btn-danger mt-2" onclick="deleteImage('${img.public_id}')">🗑️ حذف</button>
          </div>`;
      });
    })
    .catch(() => alert('❌ فشل في تحميل الصور'));
}

function deleteImage(publicId) {
  fetch('/api/delete-image', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ publicId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ تم حذف الصورة');
        loadImages();
      } else {
        alert('❌ فشل الحذف');
      }
    });
}

loadImages();