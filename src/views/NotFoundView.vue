<template>
  <div class="notfound-root">
    <div class="notfound-bg"></div>
    <div class="notfound-content">
      <h1 class="notfound-code">404</h1>
      <h2 class="notfound-title">Stránka sa nenašla</h2>
      <p class="notfound-text">
        Vyzerá to, že ste sa stratili. <br />
        Skontrolujte adresu alebo sa vráťte na domovskú stránku.
      </p>
      <v-btn
        color="#3A803D"
        size="x-large"
        class="rounded-xl text-white px-10 py-4 notfound-btn mt-8"
        elevation="12"
        @click="$router.push('/')"
      >
        <v-icon start>mdi-home</v-icon>
        NÁVRAT DOMOV
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.notfound-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 30% 40%, #d8f3dc 0%, #b7e4c7 40%, #95d5b2 100%);
  text-align: center;
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
  animation: float 6s infinite ease-in-out;
}

.notfound-content {
  position: relative;
  z-index: 2;
  color: #1b4332;
  padding: 2rem;
}

.notfound-code {
  font-size: clamp(120px, 20vw, 250px);
  font-weight: 900;
  color: #2d6a4f;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin: 0;
  animation: pulse 3s infinite ease-in-out;
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

@keyframes pulse {
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
}

::v-deep(body),
::v-deep(html),
::v-deep(#app),
::v-deep(.v-application) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow: hidden !important;
  background: transparent !important;
}
</style>
