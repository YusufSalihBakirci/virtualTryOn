
(function() {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    .virtual-tryon-modal {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(30,32,36,0.85); z-index: 10000; display: none;
      justify-content: center; align-items: center; font-family: 'Inter', Arial, sans-serif;
    }
    .virtual-tryon-content {
      background: #fff; border-radius: 24px; padding: 32px 28px; max-width: 480px; width: 96vw;
      max-height: 96vh; overflow-y: auto; box-shadow: 0 8px 40px rgba(0,0,0,0.18); position: relative;
      margin: 0 12px;
      animation: modalIn 0.3s cubic-bezier(.4,2,.6,1) 1;
    }
    @keyframes modalIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .close-btn {
      position: absolute; top: 18px; right: 18px; background: none; border: none; font-size: 2rem; cursor: pointer; color: #bbb; transition: color 0.2s;
    }
    .close-btn:hover { color: #222; }
    .virtual-tryon-title {
      font-size: 2.1rem; font-weight: 700; color: #222; margin: 0 0 8px 0; letter-spacing: -1px;
    }
    .virtual-tryon-subtitle {
      font-size: 1.08rem; color: #666; margin-bottom: 18px;
    }
    .upload-section { margin-bottom: 22px; }
    .upload-label { font-size: 1.08rem; font-weight: 600; color: #333; margin-bottom: 8px; display: block; }
    .upload-area {
      border: 2.5px dashed #d0d5dd; border-radius: 14px; padding: 28px 12px; text-align: center;
      cursor: pointer; background: #f8fafc; transition: border-color 0.2s, background 0.2s;
    }
    .upload-area:hover { border-color: #007bff; background: #f1f6ff; }
    .upload-text { font-size: 1.05rem; color: #555; margin-bottom: 6px; }
    .upload-hint { font-size: 0.93rem; color: #aaa; }
    .file-input { display: none; }
    .preview-section { margin-bottom: 22px; display: none; }
    .preview-image {
      max-width: 100%; max-height: 180px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      margin-top: 8px;
    }
    .products-section { margin-bottom: 22px; }
    .products-title { font-size: 1.13rem; font-weight: 600; color: #333; margin-bottom: 12px; }
    .products-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    }
    @media (max-width: 600px) {
      .virtual-tryon-content { padding: 16px 4px; }
      .products-grid { grid-template-columns: 1fr 1fr; }
    }
    .product-item {
      border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px 4px 8px 4px; text-align: center;
      cursor: pointer; background: #f9fafb; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      display: flex; flex-direction: column; align-items: center;
    }
    .product-item.selected {
      border-color: #007bff; background: #eaf2ff; box-shadow: 0 2px 10px rgba(0,123,255,0.08);
    }
    .product-item:hover { border-color: #007bff; }
    .product-image {
      width: 64px; height: 64px; object-fit: contain; border-radius: 7px; margin-bottom: 7px; background: #f3f4f6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .product-name {
      font-size: 0.98rem; font-weight: 500; color: #222; margin-bottom: 2px;
    }
    .try-button {
      width: 100%; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none;
      border-radius: 10px; padding: 15px; font-size: 1.13rem; font-weight: 700; cursor: pointer;
      transition: all 0.2s; margin-bottom: 10px; margin-top: 8px; letter-spacing: 0.5px;
      box-shadow: 0 2px 10px rgba(0,123,255,0.08);
    }
    .try-button:disabled {
      background: #e5e7eb; color: #aaa; cursor: not-allowed; font-weight: 600;
      box-shadow: none;
    }
    .result-section { display: none; text-align: center; }
    .result-image {
      max-width: 100%; max-height: 260px; border-radius: 14px; box-shadow: 0 4px 18px rgba(0,0,0,0.13);
      margin-bottom: 16px; margin-top: 8px;
    }
    .result-text { font-size: 1.08rem; color: #333; margin-bottom: 10px; }
    .loading { display: none; text-align: center; padding: 40px; }
    .spinner {
      border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%;
      width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;
    }
    .loading-text { font-size: 1.08rem; color: #666; }
    .error-message {
      background: #ffe6e6; color: #d32f2f; padding: 15px; border-radius: 10px; margin-bottom: 20px;
      display: none; font-size: 1.05rem; font-weight: 500; text-align: center;
    }
    .success-message {
      background: #e8f5e8; color: #2e7d32; padding: 15px; border-radius: 10px; margin-bottom: 20px;
      display: none; font-size: 1.05rem; font-weight: 500; text-align: center;
    }
  `;
  if (!document.getElementById('virtual-tryon-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'virtual-tryon-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }


  const products = [
    { id: 1, name: 'Glasses 1', image: 'https://static.ticimax.cloud/cdn-cgi/image/width=1101,quality=85,format=webp/37382/uploads/urunresimleri/buyuk/gucci-1604s-002-53-22-unisex-gunes-goz-eb9572.jpg' },
    { id: 2, name: 'Glasses 2', image: 'https://static.ticimax.cloud/cdn-cgi/image/width=1101,quality=85,format=webp/37382/uploads/urunresimleri/buyuk/gucci-1922s-001-62-17-unisex-gunes-goz-0-a013.jpg' },
    { id: 3, name: 'Glasses 3', image: 'https://static.ticimax.cloud/cdn-cgi/image/width=1101,quality=85,format=webp/37382/uploads/urunresimleri/buyuk/tom-ford-tf1026-01b-61-12-unisexerkek--99d-a9.jpg' }
  ];

  const state = {
    modal: null,
    selectedFile: null,
    selectedProduct: null
  };

  function createModal() {
    if (state.modal) state.modal.remove();
    const modal = document.createElement('div');
    modal.className = 'virtual-tryon-modal';
    modal.innerHTML = `
      <div class="virtual-tryon-content">
        <button class="close-btn" id="close-btn">&times;</button>
        <div class="virtual-tryon-header">
          <h2 class="virtual-tryon-title">Canlı Dene</h2>
          <p class="virtual-tryon-subtitle">Fotoğrafınızı yükleyin ve ürünleri üzerinizde deneyin</p>
        </div>
        <div class="error-message" id="error-message"></div>
        <div class="upload-section" id="upload-section">
          <label class="upload-label">Fotoğrafınızı Yükleyin</label>
          <div class="upload-area" id="upload-area">
            <div class="upload-text">Fotoğrafınızı buraya sürükleyin veya tıklayın</div>
            <div class="upload-hint">JPG, PNG, GIF (Max: 5MB)</div>
            <input type="file" class="file-input" id="file-input" accept="image/*">
          </div>
        </div>
        <div class="preview-section" id="preview-section" style="display:none">
          <label class="upload-label">Önizleme</label>
          <img class="preview-image" id="preview-image" alt="Yüklenen fotoğraf">
        </div>
        <div class="products-section" id="products-section">
          <h3 class="products-title">Bir gözlük seçin</h3>
          <div class="products-grid" id="products-grid">
            ${products.map(product => `
              <div class="product-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-name">${product.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <button class="try-button" id="try-button" disabled>Dene</button>
        <div class="loading" id="loading">
          <div class="spinner"></div>
          <div class="loading-text">Fotoğrafınız işleniyor...</div>
        </div>
        <div class="result-section" id="result-section">
          <img class="result-image" id="result-image" alt="Sonuç">
          <div class="result-text">İşte sonucunuz! Nasıl görünüyor?</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    state.modal = modal;

    document.getElementById('close-btn').onclick = closeModal;
    document.getElementById('upload-area').onclick = function(e) {
      if (e.target.id === 'file-input') return;
      document.getElementById('file-input').click();
    };
    document.getElementById('upload-area').addEventListener('dragover', e => { e.preventDefault(); });
    document.getElementById('upload-area').addEventListener('drop', e => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
    });
    document.getElementById('file-input').addEventListener('change', e => {
      if (e.target.files[0]) processFile(e.target.files[0]);
    });
    document.getElementById('try-button').onclick = processImage;
    document.getElementById('products-grid').onclick = handleProductSelect;
    resetUI();
    openModal();
  }

  function openModal() {
    if (state.modal) state.modal.style.display = 'flex';
  }
  function closeModal() {
    if (state.modal) state.modal.style.display = 'none';
  }
  function resetUI() {
    state.selectedFile = null;
    state.selectedProduct = null;
    ['preview-section','result-section','loading','error-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    ['try-button','upload-section','products-section'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'block';
    });
    document.querySelectorAll('.product-item').forEach(item => item.classList.remove('selected'));
    updateTryButton();
    const againBtn = document.getElementById('try-again-btn');
    if (againBtn) againBtn.style.display = 'none';
  }
  function updateTryButton() {
    const tryButton = document.getElementById('try-button');
    if (!tryButton) return;
    const enabled = state.selectedFile && state.selectedProduct;
    tryButton.disabled = !enabled;
    tryButton.textContent = enabled ? `${state.selectedProduct.name} Dene` : 'Dene';
  }
  function showError(msg) {
    const el = document.getElementById('error-message');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }
  function hideError() {
    const el = document.getElementById('error-message');
    if (el) el.style.display = 'none';
  }
  function showLoading() {
    const el = document.getElementById('loading');
    const btn = document.getElementById('try-button');
    if (el) el.style.display = 'block';
    if (btn) btn.style.display = 'none';
  }
  function hideLoading() {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'none';
  }

  function guessImageMime(base64) { //Buna gerek yok Ama ilerde lazım olabilir
    // PNG: iVBORw0KGgo
    if (base64.startsWith('iVBOR')) return 'image/png';
    // JPEG: /9j/
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    // GIF: R0lGOD
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    // Default: png
    return 'image/png';
  }

  function showResult(resultImageBase64) {
    const resultImage = document.getElementById('result-image');
    if (resultImageBase64) {
      if (!resultImageBase64.startsWith('data:image')) {
        resultImage.src = 'data:image/png;base64,' + resultImageBase64;
      } else {
        resultImage.src = resultImageBase64;
      }
    } else {
      resultImage.src = '';
    }
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('try-button').style.display = 'none';

    let againBtn = document.getElementById('try-again-btn');
    if (!againBtn) {
      againBtn = document.createElement('button');
      againBtn.id = 'try-again-btn';
      againBtn.textContent = 'Tekrar Dene';
      againBtn.style.cssText = 'margin-top: 10px; padding: 10px 22px; background: #f3f4f6; color: #007bff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;';
      againBtn.onclick = function() {
        resetUI();
      };
      document.getElementById('result-section').appendChild(againBtn);
    } else {
      againBtn.style.display = 'inline-block';
    }
  }
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function imageUrlToBase64(url) {
    return fetch(url)
      .then(response => {
        const contentType = response.headers.get('Content-Type') || '';
        if (!contentType.startsWith('image/')) {
          throw new Error('Görsel dosyasına erişilemiyor veya CORS hatası!');
        }
        return response.blob();
      })
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
  function stripBase64Prefix(dataUrl) {
    return dataUrl.replace(/^data:.*;base64,/, '');
  }
  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      showError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }
    state.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('preview-image').src = e.target.result;
      document.getElementById('preview-section').style.display = 'block';
      updateTryButton();
    };
    reader.readAsDataURL(file);
    hideError();
  }
  function handleProductSelect(e) {
    const productItem = e.target.closest('.product-item');
    if (!productItem) return;
    document.querySelectorAll('.product-item').forEach(item => item.classList.remove('selected'));
    productItem.classList.add('selected');
    state.selectedProduct = products.find(p => p.id == productItem.dataset.productId);
    updateTryButton();
  }
  async function processImage() {
    if (!state.selectedFile || !state.selectedProduct) {
      showError('Lütfen bir fotoğraf ve ürün seçin.');
      return;
    }
    showLoading();
    hideError();
    try {
      const fileBase64 = stripBase64Prefix(await fileToBase64(state.selectedFile));
      const glassesBase64 = stripBase64Prefix(await imageUrlToBase64(state.selectedProduct.image));
      const prompt = 'Overlay the glasses from Image 2 onto the face in Image 1. **Maintain the exact color and texture of the glasses from Image 2.** The person\'s face, skin tone, hair, and background in Image 1 must remain **completely unchanged** from the original. Position the glasses naturally and seamlessly on the person\'s face, ensuring a realistic and well-fitted appearance. Return the modified image';
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = 'http://localhost:5056/api/ImageProcessing/overlay-glasses-with-gemini-ai';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryImageBase64: fileBase64,
          glassesImageBase64: glassesBase64,
          imageProcessingPrompt: prompt
        })
      });
      if (!response.ok) throw new Error('Sunucu hatası: ' + response.status);
      const data = await response.json();
      console.log(data);
      showResult(data.modifiedImageBase64);
    } catch (error) {
      showError('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.\n' + error.message);
    } finally {
      hideLoading();
    }
  }

  window.openVirtualTryOn = function() {
    createModal();
  };
  window.closeVirtualTryOn = function() {
    closeModal();
  };

  function createVirtualTryOnButton() {
    if (document.getElementById('virtual-tryon-btn')) return;
    const button = document.createElement('button');
    button.id = 'virtual-tryon-btn';
    button.textContent = ' Canlı Dene';
    button.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white; border: none; border-radius: 50px;
      padding: 15px 25px; font-size: 1rem; font-weight: bold;
      cursor: pointer; box-shadow: 0 5px 20px rgba(0,123,255,0.3);
      transition: all 0.3s; z-index: 9999;
    `;
    button.onmouseenter = () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(0,123,255,0.4)';
    };
    button.onmouseleave = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 5px 20px rgba(0,123,255,0.3)';
    };
    button.onclick = window.openVirtualTryOn;
    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createVirtualTryOnButton);
  } else {
    createVirtualTryOnButton();
  }
})(); 