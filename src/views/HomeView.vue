<script setup></script>

<template>
  <div class="home-wrapper">
    <header class="hero-card">
      <div class="hero-content">
        <h1 class="welcome-text">Dev Tools</h1>
        <p class="hero-description">
          The inspiration of Dev Tools comes from my usual and work coding experience. This website contains tools
          commonly used in development, and is continually updating.
        </p>
        <div class="copyright">Copyright © 2022-{{ new Date().getFullYear() }} Chris Wang</div>
      </div>
      <div class="hero-stats">
        <div class="badge">Pure Frontend</div>
      </div>
    </header>

    <div class="grid-layout">
      <section class="profile-card">
        <div class="avatar-wrapper">
          <img src="@/assets/avatar.png" class="avatar" alt="My Avatar" />
        </div>
        <h2 class="author-name">Chris Wang</h2>
        <div class="experience-tag">Full Stack Engineer</div>
        <p class="bio">"who owns a warm indoor garden :D"</p>
      </section>

      <section class="changelog-container">
        <div class="changelog-header">
          <h3 class="section-title">
            <font-awesome-icon :icon="['fas', 'clock-rotate-left']" />
            Change Log
          </h3>
          <p class="subtitle">Special thanks in alphabetical order</p>
        </div>

        <div class="timeline">
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jan 18, 2026</div>
            <div class="event">Dev Tools website has a new theme now!</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Oct 1, 2025</div>
            <div class="event">Change Json Parser and Encode & Decode style.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Dec 6, 2024</div>
            <div class="event">Change all icons style.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Sep 29, 2024</div>
            <div class="event">Change GitHub link style.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Apr 23, 2023</div>
            <div class="event">Image Editor can handle multiple images and download by zip.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Nov 1, 2022</div>
            <div class="event">
              Switch light/dark color theme button changing icon because of UIUX.
              <span class="thanks-tag">thanks Tim</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Sep 13, 2022</div>
            <div class="event">
              Json Parser can collapse/expand all folders at once.
              <span class="thanks-tag">thanks Tommy</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Sep 6, 2022</div>
            <div class="event">Dev Tools website add RWD.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Aug 9, 2022</div>
            <div class="event">Image Editor can add watermark.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Aug 7, 2022</div>
            <div class="event">Image Editor feature go live.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">July 24, 2022</div>
            <div class="event">
              Json Parser can parse unicode(\u) by switching checkbox.
              <span class="thanks-tag">thanks Alice, Carol, Helio</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">July 15, 2022</div>
            <div class="event">
              Json Parser can parse data that wrapping by quotation marks.
              <span class="thanks-tag">thanks Claire</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 23, 2022</div>
            <div class="event">Add burger for RWD.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 21, 2022</div>
            <div class="event">Encode & Decode feature go live. Including base64 and url.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 17, 2022</div>
            <div class="event">Dev Tools website can switch light/dark color theme.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 10, 2022</div>
            <div class="event">
              Json Parser can drag between input and result block for changing width.
              <span class="thanks-tag">thanks Alice, Helio, Kris</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 6, 2022</div>
            <div class="event">Add home page.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 4, 2022</div>
            <div class="event">
              Dev Tools website main layout design.
              <span class="thanks-tag">thanks Helio</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 2, 2022</div>
            <div class="event">
              Json prettify tree viewer fix item count badge bug when dynamic update.
              <span class="thanks-tag">thanks Tommy</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">Jun 1, 2022</div>
            <div class="event">Json Parser result can copy prettify tree to clipboard.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">May 30, 2022</div>
            <div class="event">Json Parser can get json string input from user.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">May 29, 2022</div>
            <div class="event">Json prettify tree viewer add item count badge.</div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">May 29, 2022</div>
            <div class="event">
              Json prettify tree viewer can toggle by object key.
              <span class="thanks-tag">thanks Helio</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="time">May 27, 2022</div>
            <div class="event">Json Parser feature go live.</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero */
.hero-card {
  background-color: var(--surface-1);
  padding: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--brand-color);
  margin-bottom: 12px;
}

.hero-description {
  color: var(--text-secondary);
  max-width: 500px;
  line-height: 1.7;
}

.copyright {
  margin-top: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.badge {
  background: var(--brand-color-soft);
  color: var(--brand-color);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-block;
  margin-left: 8px;
}

.grid-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.profile-card {
  background-color: var(--surface-1);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  text-align: center;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  padding: 5px;
  border: 2px dashed var(--brand-color);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.experience-tag {
  color: var(--brand-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.bio {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.85rem;
}

/* change log */
.changelog-container {
  background-color: var(--surface-1);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.timeline-item {
  position: relative;
  padding-left: 24px;
  padding-bottom: 24px;
  border-left: 1px solid var(--border-subtle);
}

.timeline-item:last-child {
  border-left-color: transparent;
}

.dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 9px;
  height: 9px;
  background-color: var(--brand-color);
  border-radius: 50%;
}

.time {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--brand-color);
  margin-bottom: 4px;
}

.event {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.thanks-tag {
  font-size: 0.75rem;
  color: var(--brand-color);
  background: var(--brand-color-soft);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 6px;
}

@media (max-width: 850px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
  .hero-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }
  .hero-stats {
    margin-top: 20px;
  }
}
</style>
