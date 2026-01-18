<script setup>
import FileSaver from "file-saver";
import JSZip from "jszip";
import { ref, onUnmounted } from "vue";
import RangeSlider from "@/components/RangeSlider.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import imageTypes from "@/config/imageType.json";

let imagesOrigin = ref(null);
let images = ref([]);
let imageSelected = ref(0);
let imageRotate = ref(0);
let imageInCanvasWidth = ref(0);
let imageInCanvasHeight = ref(0);
let needResize = ref(false);
let resizeType = ref("percent");
let resizeWidth = ref(100);
let resizeHeight = ref(100);
let needWatermark = ref(false);
let watermarkText = ref("@Chris Wang🌱");
let watermarkSize = ref(30);
let downloadImageType = ref("jpg");
let downloadImageQuality = ref(90);
let expectImageSize = ref(null);
let uploadError = ref(null);
// dom
let canvas = ref(null);
let resize = ref(null);
let inputWidth = ref(null);
let inputHeight = ref(null);
let watermark = ref(null);
let inputWatermarkText = ref(null);
let download = ref(null);

const renderCanvas = () => {
  let ctx = canvas.value.getContext("2d");
  let drawX = 0,
    drawY = 0;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  switch (imageRotate.value) {
    case 0:
      canvas.value.width = imageInCanvasWidth.value;
      canvas.value.height = imageInCanvasHeight.value;
      drawX = 0;
      drawY = 0;
      break;
    case 90:
    case -270:
      canvas.value.width = imageInCanvasHeight.value;
      canvas.value.height = imageInCanvasWidth.value;
      drawX = 0;
      drawY = -imageInCanvasHeight.value;
      break;
    case 180:
    case -180:
      canvas.value.width = imageInCanvasWidth.value;
      canvas.value.height = imageInCanvasHeight.value;
      drawX = -imageInCanvasWidth.value;
      drawY = -imageInCanvasHeight.value;
      break;
    case 270:
    case -90:
      canvas.value.width = imageInCanvasHeight.value;
      canvas.value.height = imageInCanvasWidth.value;
      drawX = -imageInCanvasWidth.value;
      drawY = 0;
      break;
  }
  ctx.save();
  ctx.rotate((imageRotate.value * Math.PI) / 180);
  if (canvas.value.height <= 500) {
    canvas.value.style.maxHeight = "";
  } else {
    canvas.value.style.maxHeight = "500px";
  }

  ctx.drawImage(
    images.value[imageSelected.value],
    0,
    0,
    images.value[imageSelected.value].width,
    images.value[imageSelected.value].height,
    drawX,
    drawY,
    imageInCanvasWidth.value,
    imageInCanvasHeight.value,
  );
  ctx.restore();

  if (needWatermark.value) {
    ctx.font = `${watermarkSize.value}px Comic Sans MS`;
    ctx.fillStyle = "#da94f1";
    ctx.textAlign = "center";
    ctx.fillText(watermarkText.value, canvas.value.width / 2, Math.floor(canvas.value.height * (2 / 3)));
  }

  setExpectImageSize();
};

const uploadImage = (event) => {
  const promises = [];
  imagesOrigin.value = event.target.files;

  // limit files count
  if (imagesOrigin.value.length > 20) {
    resetImage();
    uploadError.value = true;
    return;
  }

  for (let i = 0; i < imagesOrigin.value.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        if (!imagesOrigin.value.item(i).type.match(/^image\/[a-z]+/g)) {
          reject();
        }
        let img = new Image();
        img.src = URL.createObjectURL(imagesOrigin.value.item(i));

        img.onload = () => {
          images.value[i] = img;
          resolve();
        };
        img.onerror = () => {
          reject();
        };
      }),
    );
  }

  Promise.all(promises)
    .then(() => {
      if (images.value[0].height > 500) {
        canvas.value.style.maxHeight = "500px";
      }
      imageInCanvasWidth.value = images.value[0].width;
      imageInCanvasHeight.value = images.value[0].height;
      renderCanvas();

      uploadError.value = false;
      resize.value.disabled = false;
      watermark.value.disabled = false;
      download.value.disabled = false;
    })
    .catch(() => {
      resetImage();
      uploadError.value = true;
    });
};

const selectImage = (idx) => {
  imageSelected.value = idx;

  if (images.value.length !== 0) {
    if (needResize.value) {
      if (resizeType.value === "percent") {
        const rate = resizeWidth.value / 100;
        imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
        imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
        renderCanvas();
      }
    } else {
      imageInCanvasWidth.value = images.value[imageSelected.value].width;
      imageInCanvasHeight.value = images.value[imageSelected.value].height;
      renderCanvas();
    }
  }
};

const rotateImage = (rotateDeg) => {
  imageRotate.value = (imageRotate.value + rotateDeg) % 360;
  renderCanvas();
};

const downloadImage = () => {
  if (imagesOrigin.value.length > 1) {
    const zip = new JSZip();
    const promises = [];

    for (let i = 0; i < imagesOrigin.value.length; i++) {
      const getImageMimeType =
        downloadImageType.value === "base64"
          ? imagesOrigin.value.item(i).type
          : imageTypes.find((imageType) => {
              return imageType.name === downloadImageType.value;
            }).mimeType;

      promises.push(
        new Promise((resolve) => {
          imageSelected.value = i;
          if (needResize.value) {
            if (resizeType.value === "percent") {
              const rate = resizeWidth.value / 100;
              imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
              imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
              renderCanvas();
            }
          } else {
            imageInCanvasWidth.value = images.value[imageSelected.value].width;
            imageInCanvasHeight.value = images.value[imageSelected.value].height;
            renderCanvas();
          }

          if (downloadImageType.value !== "base64") {
            canvas.value.toBlob(
              (blob) => {
                const fileName = `Dev-Tools_${imagesOrigin.value.item(i).name.slice(0, imagesOrigin.value.item(i).name.lastIndexOf("."))}.${downloadImageType.value}`;
                zip.file(fileName, blob);
                resolve();
              },
              getImageMimeType,
              downloadImageQuality.value / 100,
            );
          } else {
            const url = canvas.value.toDataURL(getImageMimeType, downloadImageQuality.value / 100);
            const fileName = `Dev-Tools_${imagesOrigin.value.item(i).name.slice(0, imagesOrigin.value.item(i).name.lastIndexOf("."))}.txt`;

            zip.file(fileName, url);
            resolve();
          }
        }),
      );
    }

    Promise.all(promises)
      .then(() => {
        if (promises.length !== 0 && imagesOrigin.value.length > 1) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            FileSaver.saveAs(content, "Dev Tools Images.zip");
          });
        }
      })
      .catch(() => {
        console.log("zip error");
      });
  } else {
    const getImageMimeType =
      downloadImageType.value === "base64"
        ? imagesOrigin.value.item(0).type
        : imageTypes.find((imageType) => {
            return imageType.name === downloadImageType.value;
          }).mimeType;

    if (downloadImageType.value !== "base64") {
      canvas.value.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          const fileName = `Dev-Tools_${imagesOrigin.value.item(0).name.slice(0, imagesOrigin.value.item(0).name.lastIndexOf("."))}.${downloadImageType.value}`;

          const downloadLink = document.createElement("a");
          downloadLink.href = url;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        },
        getImageMimeType,
        downloadImageQuality.value / 100,
      );
    } else {
      const url =
        "data:text/plain;charset=UTF-8," +
        "" +
        canvas.value.toDataURL(getImageMimeType, downloadImageQuality.value / 100);
      const fileName = `Dev-Tools_${imagesOrigin.value.item(0).name.slice(0, imagesOrigin.value.item(0).name.lastIndexOf("."))}.txt`;

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
};

const switchResize = () => {
  needResize.value = !needResize.value;
  if (images.value.length !== 0) {
    if (needResize.value) {
      inputWidth.value.disabled = false;
      inputHeight.value.disabled = false;

      if (resizeType.value === "percent") {
        const rate = resizeWidth.value / 100;
        imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
        imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
        renderCanvas();
      } else {
        const rate = resizeWidth.value / images.value[imageSelected.value].width;
        imageInCanvasWidth.value = resizeWidth.value;
        imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
        renderCanvas();
      }
    } else {
      inputWidth.value.disabled = true;
      inputHeight.value.disabled = true;
      imageInCanvasWidth.value = images.value[imageSelected.value].width;
      imageInCanvasHeight.value = images.value[imageSelected.value].height;
      renderCanvas();
    }
  }
};

const switchResizeType = (isChecked) => {
  resizeType.value = isChecked ? "pixel" : "percent";
  if (images.value.length !== 0) {
    if (resizeType.value === "percent") {
      resizeWidth.value = 100;
      resizeHeight.value = 100;
    } else {
      resizeWidth.value = images.value[imageSelected.value].width;
      resizeHeight.value = images.value[imageSelected.value].height;
    }
    imageInCanvasWidth.value = images.value[imageSelected.value].width;
    imageInCanvasHeight.value = images.value[imageSelected.value].height;
    renderCanvas();
  }
};

const inputWidthInputEvent = () => {
  resizeWidth.value = resizeWidth.value === 0 ? 1 : resizeWidth.value;

  if (resizeType.value === "percent") {
    if (resizeWidth.value > 100) {
      resizeWidth.value = 100;
    }
    resizeHeight.value = resizeWidth.value;
    const rate = resizeWidth.value / 100;
    imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
    imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
    renderCanvas();
  } else {
    if (images.value.length !== 0) {
      if (resizeWidth.value > images.value[imageSelected.value].width) {
        resizeWidth.value = images.value[imageSelected.value].width;
      }
      const rate = resizeWidth.value / images.value[imageSelected.value].width;
      resizeHeight.value = Math.floor(images.value[imageSelected.value].height * rate);
      imageInCanvasWidth.value = resizeWidth.value;
      imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
      renderCanvas();
    }
  }
};

const inputHeightInputEvent = () => {
  resizeHeight.value = resizeHeight.value === 0 ? 1 : resizeHeight.value;

  if (resizeType.value === "percent") {
    if (resizeHeight.value > 100) {
      resizeHeight.value = 100;
    }
    resizeWidth.value = resizeHeight.value;
    const rate = resizeHeight.value / 100;
    imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
    imageInCanvasHeight.value = images.value[imageSelected.value].height * rate;
    renderCanvas();
  } else {
    if (images.value.length !== 0) {
      if (resizeHeight.value > images.value[imageSelected.value].height) {
        resizeHeight.value = images.value[imageSelected.value].height;
      }
      const rate = resizeHeight.value / images.value[imageSelected.value].height;
      resizeWidth.value = Math.floor(images.value[imageSelected.value].width * rate);
      imageInCanvasWidth.value = images.value[imageSelected.value].width * rate;
      imageInCanvasHeight.value = resizeHeight.value;
      renderCanvas();
    }
  }
};

const limitInputNumber = (event) => {
  return event.charCode >= 48 && event.charCode <= 57;
};

const inputWatermarkTextInputEvent = () => {
  renderCanvas();
};

const switchWatermark = () => {
  needWatermark.value = !needWatermark.value;
  if (images.value.length !== 0) {
    if (needWatermark.value) {
      inputWatermarkText.value.disabled = false;
      renderCanvas();
    } else {
      inputWatermarkText.value.disabled = true;
      renderCanvas();
    }
  }
};

const slideWatermarkSize = (sliderValue) => {
  watermarkSize.value = sliderValue;
  renderCanvas();
};

const imageTypeChangeEvent = () => {
  setExpectImageSize();
};

const slideImageQuality = (sliderValue) => {
  downloadImageQuality.value = sliderValue;
  setExpectImageSize();
};

const setExpectImageSize = () => {
  if (images.value.length !== 0) {
    const getImageMimeType =
      downloadImageType.value === "base64"
        ? imagesOrigin.value.item(imageSelected.value).type
        : imageTypes.find((imageType) => {
            return imageType.name === downloadImageType.value;
          }).mimeType;
    canvas.value.toBlob(
      (blob) => {
        expectImageSize.value = blob.size;
      },
      getImageMimeType,
      downloadImageQuality.value / 100,
    );
  }
};

const resetImage = () => {
  if (images.value.length !== 0) {
    images.value.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }
  imagesOrigin.value = null;
  images.value = [];
  imageSelected.value = 0;
  imageRotate.value = 0;
  imageInCanvasWidth.value = 0;
  imageInCanvasHeight.value = 0;
  needResize.value = false;
  resizeType.value = "percent";
  resizeWidth.value = 100;
  resizeHeight.value = 100;
  needWatermark.value = false;
  watermarkText.value = "@Chris Wang🌱";
  watermarkSize.value = 30;
  expectImageSize.value = null;
  uploadError.value = null;
  if (canvas.value) {
    let ctx = canvas.value.getContext("2d");
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    canvas.value.width = "800";
    canvas.value.height = "500";
    canvas.value.style.maxHeight = "";
  }
  resize.value.disabled = true;
  inputWidth.value.disabled = true;
  inputHeight.value.disabled = true;
  watermark.value.disabled = true;
  inputWatermarkText.value.disabled = true;
  download.value.disabled = true;
};

onUnmounted(() => {
  if (images.value.length !== 0) {
    images.value.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }
});
</script>

<template>
  <div class="tool-container image-editor">
    <div class="main-layout">
      <div class="canvas-section">
        <label class="upload-area" v-if="imagesOrigin === null">
          <div class="upload-content">
            <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" class="upload-icon" />
            <h3>Upload Image</h3>
            <p>Try drag images here. Upload up to 20 images.</p>
            <div class="error-hint" v-if="uploadError">Upload Failed. Max 20 files.</div>
          </div>
          <input type="file" accept="image/*" @change="uploadImage" multiple class="hidden-input" />
        </label>
        <div class="preview-viewport" v-else>
          <div class="canvas-container">
            <canvas ref="canvas" width="800" height="500"></canvas>
            <button class="reset-fab" @click="resetImage" title="Clear images">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="thumbnail-strip" v-if="images.length > 1">
            <div class="strip-header">Images {{ imageSelected + 1 }} of {{ images.length }}</div>
            <div class="thumb-list">
              <div
                v-for="(img, key) in images"
                :key="img?.src"
                @click="selectImage(key)"
                :class="['thumb-box', { active: key === imageSelected }]"
              >
                <img :src="img?.src" />
              </div>
            </div>
          </div>
        </div>
        <div class="quick-tools" v-if="imagesOrigin !== null && uploadError === false">
          <button class="tool-btn" @click="rotateImage(90)">
            <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" flip="vertical" /> 順時針 90°
          </button>
          <button class="tool-btn" @click="rotateImage(-90)">
            <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" flip="vertical" /> 逆時針 90°
          </button>
        </div>
      </div>

      <aside class="sidebar-panel">
        <div class="card info-card">
          <div class="card-title">Image Info</div>
          <div class="info-row">
            <span>Name:</span>
            <strong v-if="imagesOrigin !== null">
              {{ imagesOrigin.item(imageSelected).name }}
            </strong>
          </div>
          <div class="info-row">
            <span>Image Type:</span>
            <strong v-if="imagesOrigin !== null">
              {{ imagesOrigin.item(imageSelected).type }}
            </strong>
          </div>
          <div class="info-row">
            <span>Origin Size:</span>
            <strong v-if="imagesOrigin !== null">
              {{ Math.round((imagesOrigin.item(imageSelected).size / 1024) * 100) / 100 }}
              KB ({{ imagesOrigin.item(imageSelected).size }}
              Bytes)
            </strong>
          </div>
          <div class="info-row">
            <span>Origin Resolution:</span>
            <strong v-if="images.length !== 0">
              {{ images[imageSelected]?.width }} * {{ images[imageSelected]?.height }}
            </strong>
          </div>
        </div>
        <div class="card settings-card">
          <div class="card-title">Editor Tools</div>
          <div class="setting-group">
            <div class="group-header">
              <input type="checkbox" ref="resize" id="resize" :checked="needResize" @change="switchResize" disabled />
              <label for="resize">Resize</label>
            </div>
            <div class="group-content">
              <div class="flex-between">
                <span>Type:</span>
                <SwitchCheckbox
                  :is-checked="resizeType === 'percent' ? false : true"
                  :disable="images.length !== 1 || needResize === false"
                  @switch-checked="switchResizeType"
                />
                <span class="small-text">
                  {{ resizeType === "percent" ? "Percent(%)" : "Pixel(px)" }}
                </span>
                <p v-if="images.length > 1" class="hint-text">
                  <FontAwesomeIcon :icon="['fas', 'lightbulb']" /> Multi images only allow percent.
                </p>
              </div>
              <div class="input-pair">
                <div class="field">
                  Width:
                  <input
                    type="number"
                    v-model.number="resizeWidth"
                    ref="inputWidth"
                    min="1"
                    step="1"
                    :onkeypress="limitInputNumber"
                    @input="inputWidthInputEvent"
                    disabled
                  />
                </div>
                <div class="field">
                  Height:
                  <input
                    type="number"
                    v-model.number="resizeHeight"
                    ref="inputHeight"
                    min="1"
                    step="1"
                    :onkeypress="limitInputNumber"
                    @input="inputHeightInputEvent"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="setting-group">
            <div class="group-header">
              <input
                type="checkbox"
                ref="watermark"
                id="watermark"
                :checked="needWatermark"
                @change="switchWatermark"
                disabled
              />
              <label for="watermark">Watermark</label>
            </div>
            <div class="group-content">
              <label for="watermark-text">Text:</label>
              <input
                type="text"
                id="watermark-text"
                v-model.trim="watermarkText"
                ref="inputWatermarkText"
                @input="inputWatermarkTextInputEvent"
                placeholder="Type..."
                class="full-input"
                disabled
              />
              <div class="slider-row">
                <label>Size: {{ watermarkSize }}</label>
                <RangeSlider
                  :value="watermarkSize"
                  :min="12"
                  :max="72"
                  :disable="images.length === 0 || needWatermark === false"
                  @slide-range="slideWatermarkSize"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="card download-card">
          <div class="card-title">Export Files</div>
          <p>Possibly download .png file because of not supported by certain browsers.</p>
          <div class="type-selector">
            <template v-for="(imageType, key) in imageTypes" :key="key">
              <label class="radio-label" :class="{ active: downloadImageType === imageType.name }">
                <input
                  type="radio"
                  name="imageType"
                  :value="imageType.name"
                  v-model="downloadImageType"
                  @change="imageTypeChangeEvent"
                />
                {{ imageType.name.toUpperCase() }}
              </label>
            </template>
            <label class="radio-label" :class="{ active: downloadImageType === 'base64' }">
              <input
                type="radio"
                name="imageType"
                value="base64"
                v-model="downloadImageType"
                @change="imageTypeChangeEvent"
              />
              BASE64 FILE
            </label>
          </div>
          <div
            class="quality-row"
            v-if="
              downloadImageType === 'jpg' ||
              (imagesOrigin && downloadImageType === 'base64' && imagesOrigin.item(imageSelected).type === 'image/jpeg')
            "
          >
            <label>Select image quality: {{ downloadImageQuality }}</label>
            <RangeSlider
              :value="downloadImageQuality"
              :min="10"
              :max="100"
              :step="10"
              @slide-range="slideImageQuality"
            />
          </div>
          <div class="expect-info" v-if="expectImageSize">
            Expect Size:
            <strong>{{ Math.round((expectImageSize / 1024) * 100) / 100 }} KB</strong> ({{ expectImageSize }}
            Bytes)
          </div>
          <button ref="download" class="download-btn" @click="downloadImage" disabled>
            <font-awesome-icon :icon="['fas', 'download']" /> Download {{ images.length > 1 ? "Zip" : "" }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tool-container.image-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

/* --- 左側區 --- */
.canvas-section {
  background: var(--surface-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.upload-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.upload-area:hover {
  background: var(--surface-1);
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 4rem;
  color: var(--brand-color);
  margin-bottom: 1rem;
}

.hidden-input {
  display: none;
}

.error-hint {
  color: #ff6868;
  font-weight: bold;
  margin-top: 10px;
}

.preview-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  position: relative;
  background-image: radial-gradient(var(--border-subtle) 1px, transparent 1px);
  background-size: 20px 20px;
}

canvas {
  max-width: 100%;
  box-shadow: var(--shadow-lg);
  background: white;
}

.reset-fab {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fb7a99;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-md);
}

.thumbnail-strip {
  height: 140px;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: 10px;
}

.strip-header {
  font-size: 0.8rem;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--text-secondary);
}

.thumb-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.thumb-box {
  height: 80px;
  border-radius: 6px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.thumb-box.active {
  border-color: var(--brand-color);
}

.thumb-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-tools {
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
}

.tool-btn {
  padding: 8px 16px;
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
}

/* --- 右側區 --- */
.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  background: var(--surface-1);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.card-title {
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.setting-group {
  margin-bottom: 15px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 10px;
}

.group-content {
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.field input {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
}

.full-input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.radio-label {
  flex: 1;
  min-width: 60px;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: var(--surface-2);
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  font-size: 0.75rem;
  cursor: pointer;
}

.radio-label.active {
  background: var(--brand-color);
  color: white;
  border-color: var(--brand-color);
}

.radio-label input {
  display: none;
}

.download-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--brand-color);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.download-btn:disabled {
  background: var(--border-subtle);
  cursor: not-allowed;
}

input[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .canvas-section {
    height: 500px;
  }
}
</style>
