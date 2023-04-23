<script setup>
import { ref, onUnmounted } from "vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import RangeSlider from "@/components/RangeSlider.vue";
import imageTypes from "@/config/imageType.json";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

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
  ctx.rotate((imageRotate.value * Math.PI) / 180);
  if (canvas.value.height <= 500) {
    canvas.value.style.maxHeight = "";
  } else {
    canvas.value.style.maxHeight = "500px";
  }

  ctx.drawImage(images.value[imageSelected.value], 0, 0, images.value[imageSelected.value].width, images.value[imageSelected.value].height, drawX, drawY, imageInCanvasWidth.value, imageInCanvasHeight.value);
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
          images.value.push(img);
          resolve();
        };
        img.onerror = () => {
          reject();
        };
      })
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
  if(imagesOrigin.value.length > 1) {
    const zip = new JSZip();
    const promises = [];
      
    for(let i = 0; i < imagesOrigin.value.length; i++) {
      const getImageMimeType = downloadImageType.value === "base64" ?
        imagesOrigin.value.item(i).type :
        imageTypes.find((imageType) => {
          return imageType.name === downloadImageType.value;
        }).mimeType;
  
      promises.push(new Promise((resolve) => {
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

        if(downloadImageType.value !== "base64") {
          canvas.value.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const fileName = `Dev-Tools_${imagesOrigin.value.item(i).name.slice(0, imagesOrigin.value.item(i).name.lastIndexOf("."))}.${downloadImageType.value}`;
            zip.file(fileName, blob);
            resolve();

          }, getImageMimeType, downloadImageQuality.value / 100);
        } else {
          const url = canvas.value.toDataURL(getImageMimeType, downloadImageQuality.value / 100);
          const fileName = `Dev-Tools_${imagesOrigin.value.item(i).name.slice(0, imagesOrigin.value.item(i).name.lastIndexOf("."))}.txt`;
          
          zip.file(fileName, url);
          resolve();
        }
      }));
    }

    Promise.all(promises).then(() => {
      if(promises.length !== 0 && imagesOrigin.value.length > 1) {
        zip.generateAsync({type:"blob"}).then(function(content) {
          FileSaver.saveAs(content, "Dev Tools Images.zip");
        });    
      }
    }).catch(() => {
      console.log("zip error");
    });
  } else {
    const getImageMimeType = downloadImageType.value === "base64" ?
      imagesOrigin.value.item(0).type :
      imageTypes.find((imageType) => {
        return imageType.name === downloadImageType.value;
      }).mimeType;

    if(downloadImageType.value !== "base64") {
      canvas.value.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const fileName = `Dev-Tools_${imagesOrigin.value.item(0).name.slice(0, imagesOrigin.value.item(0).name.lastIndexOf("."))}.${downloadImageType.value}`;
        
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

      }, getImageMimeType, downloadImageQuality.value / 100);
    } else {
      const url = 'data:text/plain;charset=UTF-8,' + '' + canvas.value.toDataURL(getImageMimeType, downloadImageQuality.value / 100);
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
    const getImageMimeType = downloadImageType.value === "base64" ?
      imagesOrigin.value.item(imageSelected.value).type : imageTypes.find((imageType) => {
        return imageType.name === downloadImageType.value;
      }).mimeType;
    canvas.value.toBlob((blob) => {
      expectImageSize.value = blob.size;
    }, getImageMimeType, downloadImageQuality.value / 100);
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
  <div class="container">
    <div class="image-block">
      <p class="title">Upload Image</p>
      <label class="upload-file" v-if="imagesOrigin === null">
        <div class="upload-block">
          <!-- 📂 -->
          <div class="icon">📁</div>
          <div class="text">Upload an image file or drag it here...</div>
          <div class="error" v-if="uploadError">
            Upload Failed. Please upload the correct image files and maximum number of files is 20.
          </div>
        </div>
        <input type="file" name="userImage" id="userImage" accept="image/*" @change="uploadImage" multiple />
      </label>
      <div class="preview-block" v-else>
        <canvas ref="canvas" id="canvas" class="preview-image" width="800" height="500"></canvas>
        <span class="reset-image" @click="resetImage">❌</span>
      </div>
      <div class="multi-preview-block" v-if="images.length > 1">
        <p>Images {{ imageSelected + 1 }} of {{ images.length }}</p>
        <div class="images">
          <a v-for="(image, key) in images" :key="image.src" @click="selectImage(key)">
            <img :src="image.src" :class="{ selected: key === imageSelected }">
          </a>
        </div>
      </div>
      <div class="tools-block" v-if="imagesOrigin !== null && uploadError === false">
        <button @click="rotateImage(90)">↩ 順時針旋轉 90%</button>
        <button @click="rotateImage(-90)">↪ 逆時針旋轉 90%</button>
      </div>
    </div>
    <div class="information-block">
      <div class="origin">
        <p>
          Name: <span v-if="imagesOrigin !== null">{{ imagesOrigin.item(imageSelected).name }}</span>
        </p>
        <p>
          Image type:
          <span v-if="imagesOrigin !== null">{{ imagesOrigin.item(imageSelected).type }}</span>
        </p>
        <p>
          Origin size:
          <span v-if="imagesOrigin !== null">
            {{ Math.round((imagesOrigin.item(imageSelected).size / 1024) * 100) / 100 }} KB
            ({{ imagesOrigin.item(imageSelected).size }} Bytes)</span>
        </p>
        <p>
          Origin resolution:
          <span v-if="images.length !== 0">{{ images[imageSelected].width }} * {{ images[imageSelected].height }}</span>
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
              <SwitchCheckbox :isChecked="resizeType === 'percent' ? false : true"
                              :disable="images.length !== 1 || needResize === false" v-on:switchChecked="switchResizeType" />
              <span v-if="resizeType === 'percent'"> Percent(%)</span>
              <span v-if="resizeType === 'pixel'"> Pixel(px)</span>
              <p v-if="images.length > 1">💡 Multi images only allow percent.</p>
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
                           :disable="images.length === 0 || needWatermark === false" @slideRange="slideWatermarkSize" />
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
                       v-model="downloadImageType" :checked="key === 0" @change="imageTypeChangeEvent" />
                <label class="text" :for="imageType.name">{{ imageType.name.toUpperCase() }}</label>
              </template>
              <span class="divider"></span>
              <input type="radio" name="imageType" id="base64" value="base64"
                     v-model="downloadImageType" @change="imageTypeChangeEvent" />
              <label class="text" for="base64">BASE64 FILE</label>
            </div>
          </div>
          <template
            v-if="downloadImageType === 'jpg' || (imagesOrigin !== null && downloadImageType === 'base64' && imagesOrigin.item(imageSelected).type === 'image/jpeg')">
            Select image quality:
            <div class="tools">
              <RangeSlider :value="downloadImageQuality" :min="10" :max="100" :step="10"
                           @slideRange="slideImageQuality" />
            </div>
          </template>
          Expect size:
          <span v-if="expectImageSize !== null">
            {{ Math.round((expectImageSize / 1024) * 100) / 100 }} KB ({{ expectImageSize }} Bytes)
          </span>
        </div>
        <button ref="download" name="download" class="download" @click="downloadImage" disabled>
          Download <template v-if="images.length > 1">Zip</template>
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

.upload-block .error {
  font-size: 20px;
  color: #ff6868;
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

.multi-preview-block {
  display: block;
  width: 100%;
  height: 200px;
  background-color: var(--color-block-background2);
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
}

.multi-preview-block .images {
  height: calc(100% - 25px);
  overflow-x: scroll;
  overflow-y: hidden;
}

.multi-preview-block img {
  width: 250px;
  height: calc(100% - 10px);
  margin: auto 10px;
  object-fit: contain;
  border: 1px #b5b5b5 solid;
  cursor: pointer;
}

.multi-preview-block img.selected {
  border: 4px #a96868 solid;
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

.image-type input[type="radio"] {
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

.image-type input[type="radio"]:checked + .text {
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
