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
    <div class="changeLog">
      <div class="title">Change Log</div>
      <div class="description">Special thanks in alphabetical order</div>
      <div class="log">
        <ul>
          <li>
            [Aug 7, 2022] Image Editor feature go live.
          </li>
          <li>
            [July 24, 2022] Json Parser can parse unicode(\u) by switching checkbox.
            <span class="thanks">(thanks Alice, Carol, Helio)</span>
          </li>
          <li>
            [July 15, 2022] Json Parser can parse data that wrapping by
            quotation marks.
            <span class="thanks">(thanks Claire)</span>
          </li>
          <li>[Jun 23, 2022] Add burger for RWD.</li>
          <li>
            [Jun 21, 2022] Encode & Decode feature go live. Including base64 and
            url.
          </li>
          <li>
            [Jun 17, 2022] Dev Tools website can switch light/dark color theme.
          </li>
          <li>
            [Jun 10, 2022] Json Parser can drag between input and result block
            for changing width.
            <span class="thanks">(thanks Alice, Helio, Kris)</span>
          </li>
          <li>[Jun 6, 2022] Add home page.</li>
          <li>
            [Jun 4, 2022] Dev Tools website main layout design.
            <span class="thanks">(thanks Helio)</span>
          </li>
          <li>
            [Jun 2, 2022] Json prettify tree viewer fix item count badge bug
            when dynamic update. <span class="thanks">(thanks Tommy)</span>
          </li>
          <li>
            [Jun 1, 2022] Json Parser result can copy prettify tree to
            clipboard.
          </li>
          <li>
            [May 30, 2022] Json Parser can get json string input from user.
          </li>
          <li>
            [May 29, 2022] Json prettify tree viewer add item count badge.
          </li>
          <li>
            [May 29, 2022] Json prettify tree viewer can toggle by object key.
            <span class="thanks">(thanks Helio)</span>
          </li>
          <li>[May 27, 2022] Json Parser feature go live.</li>
        </ul>
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
  font-weight: bold;
  color: #42b883;
}

.introduce .content {
  margin-top: 10px;
}

.about {
  width: 50%;
  margin-top: 60px;
  padding-bottom: 30px;
}

.about .avatar {
  border-radius: 50%;
  width: 200px;
  height: 200px;
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

.changeLog {
  width: 50%;
  margin-top: 30px;
  padding: 10px 10px 30px 10px;
}

.changeLog .title {
  margin: 10px;
  font-size: 18px;
}

.changeLog .description {
  color: #7e7e7e;
  font-style: italic;
  font-size: 14px;
  margin-bottom: 25px;
}

.changeLog ul {
  list-style: none;
  padding: 0;
}

.changeLog .thanks {
  color: #7e7e7e;
  font-style: italic;
}

@media (max-width: 768px) {
  .about {
    width: 100%;
  }

  .changeLog {
    width: 100%;
  }
}
</style>
