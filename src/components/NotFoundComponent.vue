<template>
  <div class="notfound-root" :class="{ 'guest-layout': isGuestLayout }">
    <div class="notfound-bg"></div>
    <div class="notfound-content">
      <h1 class="notfound-code">404</h1>
      <h2 class="notfound-title">{{ $t('NotFoundView.title') }}</h2>
      <p class="notfound-text">
        {{ $t('NotFoundView.description') }} <br />
        {{ $t('NotFoundView.description2') }}
      </p>
      <v-btn
        color="#3A803D"
        size="x-large"
        class="rounded-xl text-white px-10 py-4 notfound-btn mt-8"
        elevation="12"
        :to="'/'"
      >
        <v-icon start>mdi-home</v-icon>
        {{ $t('NotFoundView.button') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundComponent',
  props: {
    isGuestLayout: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.notfound-root {
  /* By default take the full size of the parent container */
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 30% 40%, #d8f3dc 0%, #b7e4c7 40%, #95d5b2 100%);
  text-align: center;
}

/* Guest layout: occupy full viewport and be fixed to body */
.notfound-root.guest-layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
}

.notfound-bg {
  position: absolute;
  width: 1200px;
  height: 1200px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.25), transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(180px);
  z-index: 1;
  /*animation: float 6s infinite ease-in-out;*/
}

.notfound-content {
  position: relative;
  z-index: 2;
  color: #1b4332;
  padding: 2rem;
  /* ensure the content does not stretch horizontally on small screens */
  max-width: 900px;
  width: 100%;
}

.notfound-code {
  font-size: clamp(120px, 20vw, 250px);
  font-weight: 900;
  color: #2d6a4f;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin: 0;
  /*animation: pulse 3s infinite ease-in-out;*/
}

.notfound-title {
  font-size: 32px;
  font-weight: 700;
  color: #1b4332;
  margin-top: 10px;
}

.notfound-text {
  color: #2d6a4f;
  font-size: 18px;
  max-width: 600px;
  margin: 1rem auto 0;
  line-height: 1.6;
}

.notfound-btn {
  font-weight: 700;
  transition: all 0.3s ease;
}

.notfound-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 25px rgba(58, 128, 61, 0.35);
}

/* Optional keyframes kept commented out in case they're desired later */
/*@keyframes pulse {
  0%, 100% {
    text-shadow: 0 0 25px rgba(46, 125, 50, 0.3);
  }
  50% {
    text-shadow: 0 0 45px rgba(46, 125, 50, 0.7);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -48%) scale(1.1);
  }
}*/
</style>
