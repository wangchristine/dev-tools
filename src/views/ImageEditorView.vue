<script setup>
import { ref } from "vue";

let imageOrigin = ref(null);
let image = ref(null);
// dom
let canvas = ref(null);

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
      canvas.value.style.width = "100%";
    } else {
      canvas.value.style.height = "30vw";
    }

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.value.width, canvas.value.height);
  };
};

const downloadImage = () => {
  canvas.value.toBlob((blob) => {
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "circle.jpg"; // 修改
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, "image/jpeg"); // 修改
};
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
        <input
          type="file"
          name="userImage"
          id="userImage"
          accept="image/*"
          @change="uploadImage"
        />
      </label>
      <div class="preview-block" v-else>
        <canvas
          ref="canvas"
          id="canvas"
          class="preview-image"
          width="800"
          height="450"
        ></canvas>
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
          <span v-if="imageOrigin !== null"
            >{{ Math.round((imageOrigin.size / 1024) * 100) / 100 }} MB ({{
              imageOrigin.size
            }}
            Bytes)</span
          >
        </p>
        <p>
          Origin resolution:
          <span v-if="image !== null"
            >{{ image.width }} * {{ image.height }}</span
          >
        </p>
      </div>
      <div class="draw-tool">
        <button class="download" @click="downloadImage">Download</button>
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
  width: 60%;
}

.image-block .title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.upload-file {
  display: block;
  width: 100%;
  height: 450px;
  background-color: var(--color-block-background2);
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.upload-file .upload-block {
  border: dashed 2px;
  padding: 140px 40px;
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
}

.information-block {
  width: 40%;
  margin-left: 10px;
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

.draw-tool .download {
  background-color: #a96868;
  border: 0;
  color: #e4e4e4;
  padding: 10px 20px;
  width: 100%;
  font-size: 20px;
}
</style>
