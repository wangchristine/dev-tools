<script setup>
import { ref, onUnmounted } from "vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import RangeSlider from "@/components/RangeSlider.vue";
import imageTypes from "@/config/imageType.json";

let imageOrigin = ref(null);
let image = ref(null);
let needResize = ref(false);
let resizeType = ref("percent");
let resizeWidth = ref(100);
let resizeHeight = ref(100);
let needWatermark = ref(false);
let watermarkText = ref("@Chris Wang🌱");
let watermarkSize = ref(30);
let downloadImageType = ref("jpg");
let downloadImageQuantity = ref(90);
// dom
let canvas = ref(null);
let resize = ref(null);
let inputWidth = ref(null);
let inputHeight = ref(null);
let watermark = ref(null);
let inputWatermarkText = ref(null);
let download = ref(null);

const renderCanvas = ({ canvasWidth, canvasHeight, watermarkText }) => {
  let ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  if (canvasWidth !== undefined && canvasHeight !== undefined) {
    canvas.value.width = canvasWidth;
    canvas.value.height = canvasHeight;
  }
  ctx.drawImage(image.value, 0, 0, image.value.width, image.value.height, 0, 0, canvas.value.width, canvas.value.height);

  if (watermarkText !== undefined) {
    ctx.font = `${watermarkSize.value}px Comic Sans MS`;
    ctx.fillStyle = "#da94f1";
    ctx.textAlign = "center";
    ctx.fillText(watermarkText, canvas.value.width / 2, Math.floor(canvas.value.height * (2 / 3)));
  }
}

const uploadImage = (event) => {
  imageOrigin.value = event.target.files[0];

  let img = new Image();
  img.src = URL.createObjectURL(imageOrigin.value);
  img.onload = () => {
    let ctx = canvas.value.getContext("2d");
    image.value = img;

    canvas.value.width = img.width;
    canvas.value.height = img.height;

    if (img.width >= img.height) {
      canvas.value.style.maxWidth = "100%";
    } else {
      canvas.value.style.maxHeight = "500px";
    }

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.value.width, canvas.value.height);
  };
  resize.value.disabled = false;
  watermark.value.disabled = false;
  download.value.disabled = false;
};

const downloadImage = () => {
  const getImageMimeType = imageTypes.find((imageType) => {
    return imageType.name === downloadImageType.value;
  }).mimeType;

  canvas.value.toBlob((blob) => {
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `circle.${downloadImageType.value}`; // 修改
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, getImageMimeType, downloadImageQuantity.value / 100); // 修改
};

const switchResize = () => {
  needResize.value = !needResize.value;
  if (image.value) {
    if (needResize.value) {
      inputWidth.value.disabled = false;
      inputHeight.value.disabled = false;

      if (resizeType.value === "percent") {
        const rate = resizeWidth.value / 100;
        renderCanvas({
          canvasWidth: image.value.width * rate,
          canvasHeight: image.value.height * rate, ...(needWatermark.value && { watermarkText: watermarkText.value })
        });
      } else {
        const rate = resizeWidth.value / image.value.width;
        renderCanvas({
          canvasWidth: resizeWidth.value,
          canvasHeight: image.value.height * rate, ...(needWatermark.value && { watermarkText: watermarkText.value })
        });
      }
    } else {
      inputWidth.value.disabled = true;
      inputHeight.value.disabled = true;
      renderCanvas({
        canvasWidth: image.value.width,
        canvasHeight: image.value.height, ...(needWatermark.value && { watermarkText: watermarkText.value })
      });
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
    renderCanvas({
      canvasWidth: image.value.width,
      canvasHeight: image.value.height, ...(needWatermark.value && { watermarkText: watermarkText.value })
    });
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
    renderCanvas({
      canvasWidth: image.value.width * rate,
      canvasHeight: image.value.height * rate, ...(needWatermark.value && { watermarkText: watermarkText.value })
    });
  } else {
    if (image.value) {
      if (resizeWidth.value > image.value.width) {
        resizeWidth.value = image.value.width;
      }
      const rate = resizeWidth.value / image.value.width;
      resizeHeight.value = Math.floor(image.value.height * rate);
      renderCanvas({
        canvasWidth: resizeWidth.value,
        canvasHeight: image.value.height * rate, ...(needWatermark.value && { watermarkText: watermarkText.value })
      });
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
    renderCanvas({
      canvasWidth: image.value.width * rate,
      canvasHeight: image.value.height * rate, ...(needWatermark.value && { watermarkText: watermarkText.value })
    });
  } else {
    if (image.value) {
      if (resizeHeight.value > image.value.height) {
        resizeHeight.value = image.value.height;
      }
      const rate = resizeHeight.value / image.value.height;
      resizeWidth.value = Math.floor(image.value.width * rate);
      renderCanvas({
        canvasWidth: image.value.width * rate,
        canvasHeight: resizeHeight.value, ...(needWatermark.value && { watermarkText: watermarkText.value })
      });
    }
  }
}

const limitInputNumber = (event) => {
  return event.charCode >= 48 && event.charCode <= 57;
};

const inputWatermarkTextInputEvent = () => {
  renderCanvas({ watermarkText: watermarkText.value });
};

const switchWatermark = () => {
  needWatermark.value = !needWatermark.value;
  if (image.value) {
    if (needWatermark.value) {
      inputWatermarkText.value.disabled = false;
      renderCanvas({ watermarkText: watermarkText.value });
    } else {
      inputWatermarkText.value.disabled = true;
      renderCanvas({});
    }
  }
};
const slideWatermarkSize = (sliderValue) => {
  watermarkSize.value = sliderValue;
  renderCanvas({ watermarkText: watermarkText.value });
};
const slideImageQuantity = (sliderValue) => {
  downloadImageQuantity.value = sliderValue;
};

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
          <div class="text">Upload an image file...</div>
        </div>

        <!-- accept="image/png, image/jpeg" -->
        <input type="file" name="userImage" id="userImage" accept="image/*" @change="uploadImage"/>
      </label>
      <div class="preview-block" v-else>
        <canvas ref="canvas" id="canvas" class="preview-image" width="800" height="500"></canvas>
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
            }} MB ({{ imageOrigin.size }} Bytes)</span>
        </p>
        <p>
          Origin resolution:
          <span v-if="image !== null">{{ image.width }} * {{ image.height }}</span>
        </p>
      </div>
      <div class="draw-tool">
        <div class="title">Tools</div>
        <div class="resize">
          <input type="checkbox" ref="resize" id="resize" @change="switchResize" disabled/>
          <label for="resize"> Resize</label>
          <div class="tools">
            <div>
              Type:
              <SwitchCheckbox :disable="image === null || needResize === false" v-on:switchChecked="switchResizeType"/>
              <span v-if="resizeType === 'percent'"> Percent(%)</span>
              <span v-if="resizeType === 'pixel'"> Pixel(px)</span>
            </div>
            <div>
              Width:
              <input type="number" v-model.number="resizeWidth" ref="inputWidth" min="1" step="1"
                     :onkeypress="limitInputNumber" @input="inputWidthInputEvent" disabled/>
              Height:
              <input type="number" v-model.number="resizeHeight" ref="inputHeight" min="1" step="1"
                     :onkeypress="limitInputNumber" @input="inputHeightInputEvent" disabled/>
            </div>
          </div>
        </div>
        <div class="watermark">
          <input type="checkbox" ref="watermark" id="watermark" @change="switchWatermark" disabled/>
          <label for="watermark"> Watermark</label>
          <div class="tools">
            <div>
              Text:
              <input type="text" v-model.trim="watermarkText" ref="inputWatermarkText"
                     @input="inputWatermarkTextInputEvent" disabled/>
            </div>
            <div>
              Size:
              <RangeSlider :value="watermarkSize" :min="12" :max="72"
                           :disable="image === null || needWatermark === false" @slideRange="slideWatermarkSize"/>
            </div>
          </div>
        </div>
        <div class="final-block">
          Download image type:
          <div class="tools">
            <div class="image-type">
              <template v-for="(imageType, key) in imageTypes" :key="key">
                <input type="radio" name="imageType" :id="imageType.name" :value="imageType.name"
                       v-model="downloadImageType" :checked="key === 0">
                <label class="text" :for="imageType.name">{{ imageType.name.toUpperCase() }}</label>
              </template>
            </div>
          </div>
          <template v-if="downloadImageType === 'jpg'">
            select image quantity:
            <div class="tools">
              <RangeSlider :value="downloadImageQuantity" :min="10" :max="100" :step="10"
                           @slideRange="slideImageQuantity"/>
            </div>
          </template>
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
  height: 100%;
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

.image-type {
  margin: 10px 0;
}

.image-type input[type=radio] {
  display: none;
  opacity: 0;
  height: 0;
  width: 0;
}

.image-type .text {
  cursor: pointer;
  background-color: #b5b5b5;
  margin: 0 5px;
  padding: 4px 12px;
}

.image-type input[type=radio]:checked + .text {
  background-color: #60b699;
  color: #fff;
}

.final-block .slider {
  max-width: 100%;
}
</style>
