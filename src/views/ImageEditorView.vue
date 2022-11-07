<script setup>
import { ref, onUnmounted } from "vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import RangeSlider from "@/components/RangeSlider.vue";
import imageTypes from "@/config/imageType.json";

let imageOrigin = ref(null);
let image = ref(null);
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
  let drawX = 0, drawY = 0;
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
  ctx.rotate(imageRotate.value * Math.PI / 180);

  if (canvas.value.width >= canvas.value.height) {
    canvas.value.style.maxHeight = "";
  } else {
    canvas.value.style.maxHeight = "500px";
  }

  ctx.drawImage(image.value, 0, 0, image.value.width, image.value.height, drawX, drawY, imageInCanvasWidth.value, imageInCanvasHeight.value);
  ctx.restore();

  if (needWatermark.value) {
    ctx.font = `${watermarkSize.value}px Comic Sans MS`;
    ctx.fillStyle = "#da94f1";
    ctx.textAlign = "center";
    ctx.fillText(watermarkText.value, canvas.value.width / 2, Math.floor(canvas.value.height * (2 / 3)));
  }

  setExpectImageSize();
}

const uploadImage = (event) => {
  imageOrigin.value = event.target.files[0];

  let img = new Image();
  img.src = URL.createObjectURL(imageOrigin.value);
  img.onload = () => {
    image.value = img;
    if (img.width < img.height) {
      canvas.value.style.maxHeight = "500px";
    }
    imageInCanvasWidth.value = img.width;
    imageInCanvasHeight.value = img.height;
    renderCanvas();
  };
  resize.value.disabled = false;
  watermark.value.disabled = false;
  download.value.disabled = false;
};

const rotateImage = (rotateDeg) => {
  imageRotate.value = (imageRotate.value + rotateDeg) % 360;
  renderCanvas();
};

const downloadImage = () => {
  const getImageMimeType = downloadImageType.value === "base64" ?
    imageOrigin.value.type :
    imageTypes.find((imageType) => {
      return imageType.name === downloadImageType.value;
    }).mimeType;

  if (downloadImageType.value !== "base64") {
    canvas.value.toBlob((blob) => {
      const downloadLink = document.createElement("a");
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `Dev-Tools_${imageOrigin.value.name.slice(0, imageOrigin.value.name.lastIndexOf("."))}.${downloadImageType.value}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, getImageMimeType, downloadImageQuality.value / 100);
  } else {
    const downloadLink = document.createElement("a");
    downloadLink.href = 'data:text/plain;charset=UTF-8,' + '' + canvas.value.toDataURL(getImageMimeType, downloadImageQuality.value / 100);
    downloadLink.download = `Dev-Tools_${imageOrigin.value.name.slice(0, imageOrigin.value.name.lastIndexOf("."))}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};

const switchResize = () => {
  needResize.value = !needResize.value;
  if (image.value) {
    if (needResize.value) {
      inputWidth.value.disabled = false;
      inputHeight.value.disabled = false;

      if (resizeType.value === "percent") {
        const rate = resizeWidth.value / 100;
        imageInCanvasWidth.value = image.value.width * rate;
        imageInCanvasHeight.value = image.value.height * rate;
        renderCanvas();
      } else {
        const rate = resizeWidth.value / image.value.width;
        imageInCanvasWidth.value = resizeWidth.value;
        imageInCanvasHeight.value = image.value.height * rate;
        renderCanvas();
      }
    } else {
      inputWidth.value.disabled = true;
      inputHeight.value.disabled = true;
      imageInCanvasWidth.value = image.value.width;
      imageInCanvasHeight.value = image.value.height;
      renderCanvas();
    }
  }
};

const switchResizeType = (isChecked) => {
  resizeType.value = isChecked ? "pixel" : "percent";
  if (image.value) {
    if (resizeType.value === "percent") {
      resizeWidth.value = 100;
      resizeHeight.value = 100;
    } else {
      resizeWidth.value = image.value.width;
      resizeHeight.value = image.value.height;
    }
    imageInCanvasWidth.value = image.value.width;
    imageInCanvasHeight.value = image.value.height;
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
    imageInCanvasWidth.value = image.value.width * rate;
    imageInCanvasHeight.value = image.value.height * rate;
    renderCanvas();
  } else {
    if (image.value) {
      if (resizeWidth.value > image.value.width) {
        resizeWidth.value = image.value.width;
      }
      const rate = resizeWidth.value / image.value.width;
      resizeHeight.value = Math.floor(image.value.height * rate);
      imageInCanvasWidth.value = resizeWidth.value;
      imageInCanvasHeight.value = image.value.height * rate;
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
    const rate = (resizeHeight.value / 100);
    imageInCanvasWidth.value = image.value.width * rate;
    imageInCanvasHeight.value = image.value.height * rate;
    renderCanvas();
  } else {
    if (image.value) {
      if (resizeHeight.value > image.value.height) {
        resizeHeight.value = image.value.height;
      }
      const rate = resizeHeight.value / image.value.height;
      resizeWidth.value = Math.floor(image.value.width * rate);
      imageInCanvasWidth.value = image.value.width * rate;
      imageInCanvasHeight.value = resizeHeight.value;
      renderCanvas();
    }
  }
}

const limitInputNumber = (event) => {
  return event.charCode >= 48 && event.charCode <= 57;
};

const inputWatermarkTextInputEvent = () => {
  renderCanvas();
};

const switchWatermark = () => {
  needWatermark.value = !needWatermark.value;
  if (image.value) {
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
}

const slideImageQuality = (sliderValue) => {
  downloadImageQuality.value = sliderValue;
  setExpectImageSize();
};

const setExpectImageSize = () => {
  if (image.value) {
    const getImageMimeType = downloadImageType.value === "base64" ?
      imageOrigin.value.type : imageTypes.find((imageType) => {
        return imageType.name === downloadImageType.value;
      }).mimeType;
    canvas.value.toBlob((blob) => {
      expectImageSize.value = blob.size;
    }, getImageMimeType, downloadImageQuality.value / 100);
  }
};
const resetImage = () => {
  URL.revokeObjectURL(image.value.src);
  imageOrigin.value = null;
  image.value = null;
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

  let ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  canvas.value.width = "800";
  canvas.value.height = "500";
  canvas.value.style.maxHeight = "";
  resize.value.disabled = true;
  inputWidth.value.disabled = true;
  inputHeight.value.disabled = true;
  watermark.value.disabled = true;
  inputWatermarkText.value.disabled = true;
  download.value.disabled = true;
}

onUnmounted(() => {
  if (image.value) {
    URL.revokeObjectURL(image.value.src);
  }
});
</script>

<template>
  <div class="container">
    <div class="image-block">
      <p class="title">Upload Image</p>
      <label class="upload-file" v-if="imageOrigin === null">
        <div class="upload-block">
          <!-- 📂 -->
          <div class="icon">📁</div>
          <div class="text">Upload an image file or drag it here...</div>
        </div>
        <input type="file" name="userImage" id="userImage" accept="image/*" @change="uploadImage" />
      </label>
      <div class="preview-block" v-else>
        <canvas ref="canvas" id="canvas" class="preview-image" width="800" height="500"></canvas>
        <span class="reset-image" @click="resetImage">❌</span>
      </div>
      <div class="tools-block" v-if="imageOrigin !== null">
        <button @click="rotateImage(90)">↩ 順時針旋轉 90%</button>
        <button @click="rotateImage(-90)">↪ 逆時針旋轉 90%</button>
      </div>
    </div>
    <div class="information-block">
      <div class="origin">
        <p>
          Name: <span v-if="imageOrigin !== null">{{ imageOrigin.name }}</span>
        </p>
        <p>
          Image type:
          <span v-if="imageOrigin !== null">{{ imageOrigin.type }}</span>
        </p>
        <p>
          Origin size:
          <span v-if="imageOrigin !== null">{{
              Math.round((imageOrigin.size / 1024) * 100) / 100
            }} KB ({{ imageOrigin.size }} Bytes)</span>
        </p>
        <p>
          Origin resolution:
          <span v-if="image !== null">{{ image.width }} * {{ image.height }}</span>
        </p>
      </div>
      <div class="draw-tool">
        <div class="title">Tools</div>
        <div class="resize">
          <input type="checkbox" ref="resize" id="resize" :checked="needResize" @change="switchResize" disabled />
          <label for="resize"> Resize</label>
          <div class="tools">
            <div>
              Type:
              <SwitchCheckbox :isChecked="resizeType === 'percent'? false : true"
                              :disable="image === null || needResize === false" v-on:switchChecked="switchResizeType" />
              <span v-if="resizeType === 'percent'"> Percent(%)</span>
              <span v-if="resizeType === 'pixel'"> Pixel(px)</span>
            </div>
            <div>
              Width:
              <input type="number" v-model.number="resizeWidth" ref="inputWidth" min="1" step="1"
                     :onkeypress="limitInputNumber" @input="inputWidthInputEvent" disabled />
              Height:
              <input type="number" v-model.number="resizeHeight" ref="inputHeight" min="1" step="1"
                     :onkeypress="limitInputNumber" @input="inputHeightInputEvent" disabled />
            </div>
          </div>
        </div>
        <div class="watermark">
          <input type="checkbox" ref="watermark" id="watermark" :checked="needWatermark" @change="switchWatermark"
                 disabled />
          <label for="watermark"> Watermark</label>
          <div class="tools">
            <div>
              Text:
              <input type="text" v-model.trim="watermarkText" ref="inputWatermarkText"
                     @input="inputWatermarkTextInputEvent" disabled />
            </div>
            <div>
              Size:
              <RangeSlider :value="watermarkSize" :min="12" :max="72"
                           :disable="image === null || needWatermark === false" @slideRange="slideWatermarkSize" />
            </div>
          </div>
        </div>
        <div class="final-block">
          Download type:
          <p>(Possibly download .png file because of not supported by certain browsers.)</p>
          <div class="tools">
            <div class="image-type">
              <template v-for="(imageType, key) in imageTypes" :key="key">
                <input type="radio" name="imageType" :id="imageType.name" :value="imageType.name"
                       v-model="downloadImageType" :checked="key === 0" @change="imageTypeChangeEvent">
                <label class="text" :for="imageType.name">{{ imageType.name.toUpperCase() }}</label>
              </template>
              <span class="divider"></span>
              <input type="radio" name="imageType" id="base64" value="base64"
                     v-model="downloadImageType" @change="imageTypeChangeEvent">
              <label class="text" for="base64">BASE64 FILE</label>
            </div>
          </div>
          <template
            v-if="downloadImageType === 'jpg' || (imageOrigin !== null && downloadImageType === 'base64' && imageOrigin.type === 'image/jpeg')">
            Select image quality:
            <div class="tools">
              <RangeSlider :value="downloadImageQuality" :min="10" :max="100" :step="10"
                           @slideRange="slideImageQuality" />
            </div>
          </template>
          Expect size:
          <span v-if="expectImageSize !== null">{{
              Math.round((expectImageSize / 1024) * 100) / 100
            }} KB ({{ expectImageSize }} Bytes)</span>
        </div>
        <button ref="download" name="download" class="download" @click="downloadImage" disabled>
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}

.image-block {
  width: 65%;
}

.image-block .title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.upload-file {
  display: block;
  width: 100%;
  height: 500px;
  background-color: var(--color-block-background2);
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.upload-file .upload-block {
  border: dashed 2px;
  padding: 160px 40px;
  height: 100%;
}

.upload-block .icon {
  font-size: 48px;
}

.upload-block .text {
  padding: 10px 10px 30px 10px;
  font-size: 18px;
}

.upload-file input[type="file"] {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.preview-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--color-block-background2);
  margin-top: 10px;
  width: 100%;
  height: 500px;
}

.preview-block .preview-image {
  max-width: 100%;
}

.preview-block .reset-image {
  position: absolute;
  top: 0px;
  right: 5px;
  font-size: 28px;
  cursor: pointer;
}

.tools-block {
  text-align: center;
}

.tools-block button {
  background-color: #60b699;
  color: #fff;
  padding: 10px 20px;
  border: 0;
  margin: 0 5px;
  cursor: pointer;
}

.information-block {
  width: 35%;
  margin-left: 15px;
  font-size: 18px;
}

.information-block .origin {
  background-color: var(--color-block-background2);
  padding: 20px;
  margin-top: 60px;
}

.information-block .draw-tool {
  background-color: var(--color-block-background2);
  padding: 20px;
  margin-top: 20px;
}

.draw-tool .title {
  font-size: 20px;
  text-align: center;
  border-bottom: 1px solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.draw-tool .tools {
  padding-left: 20px;
}

.tools > div {
  margin-top: 5px;
}

.tools input[type="number"] {
  padding: 5px;
  font-size: 18px;
  max-width: 30%;
  letter-spacing: 2px;
}

.tools input[type="text"] {
  padding: 5px;
  font-size: 18px;
  max-width: 100%;
  letter-spacing: 2px;
}

.tools .slider {
  max-width: 90%;
}

.draw-tool .download {
  background-color: #a96868;
  border: 0;
  color: #e4e4e4;
  padding: 10px 20px;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
  cursor: pointer;
}

.draw-tool .download[disabled] {
  background-color: var(--color-background);
  color: #b1b0b0;
  cursor: not-allowed;
}

.final-block {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid;
}

.image-type input[type=radio] {
  display: none;
  opacity: 0;
  height: 0;
  width: 0;
}

.image-type .text {
  display: inline-block;
  cursor: pointer;
  background-color: #b5b5b5;
  margin: 0 5px 10px 5px;
  padding: 4px 12px;
}

.image-type input[type=radio]:checked + .text {
  background-color: #60b699;
  color: #fff;
}

.image-type .divider {
  border-left: 1px solid var(--color-text);
  margin: 0px 7px;
  padding: 4px 0;
}

.final-block .slider {
  max-width: 100%;
}

@media (max-width: 768px) {
  .container {
    flex-wrap: wrap;
  }

  .image-block {
    width: 100%;
  }

  .upload-file .upload-block {
    padding: 120px 40px;
  }

  .information-block {
    width: 100%;
    margin: 0;
    padding-bottom: 20px;
  }

  .draw-tool .tools {
    padding-left: 0;
  }
}
</style>
