<script setup>
</script>

<template>
  <div class="container">
    <div class="introduce">
      <div class="title">Introduce</div>
      <div class="content">
        The inspiration of Dev Tools comes from my usual and work coding
        experience. This website contains tools commonly used in development,
        and continually updating.
      </div>
    </div>
    <div class="about">
      <img src="@/assets/avatar.png" class="avatar" alt="My Avatar" />
      <div class="author">Chris Wang</div>
      <div class="experience">
        <div class="title">Backend Engineer</div>
        <div class="description">who wants to be a Full Stack Engineer :D</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  text-align: center;
  width: 80%;
  margin: auto;
  flex-wrap: wrap;
}

.introduce {
  padding: 20px;
  border: 2px #42b883 dashed;
}

.introduce .title {
  font-size: 20px;
  color: #42b883;
}

.introduce .content {
  margin-top: 10px;
}

.about {
  margin-top: 60px;
  padding-bottom: 30px;
}

.about .avatar {
  width: 50px;
  height: 50px;
}

.about .author {
  font-size: 20px;
  margin: 10px;
}

.about .experience {
  margin-top: 10px;
}

.experience .description {
  color: #7e7e7e;
  font-style: italic;
  font-size: 14px;
}
</style>
