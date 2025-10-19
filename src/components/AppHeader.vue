<template>
  <div>
    <v-app-bar flat density="comfortable" class="bg-white bleed">
      <v-container class="full px-4 pr-6">
        <div class="d-flex align-center justify-space-between w-100">
          <div
            class="text-h6 pl-6"
            style="cursor:pointer; color:#3A803D; font-weight:700; letter-spacing:0.3px"
            @click="scrollTo('hero')"
          >
            Practice CRM
          </div>
          <div class="d-none d-md-flex align-center ga-6">
            <v-btn variant="text" class="font-weight-semibold text-body-1" @click="scrollTo('hero')">Domov</v-btn>
            <v-btn variant="text" class="font-weight-semibold text-body-1" @click="scrollTo('about-internship')">O odbornej praxi</v-btn>
            <v-btn variant="text" class="font-weight-semibold text-body-1" @click="scrollTo('student-registration')">Registrácia študenta</v-btn>
            <v-btn variant="text" class="font-weight-semibold text-body-1" @click="scrollTo('company-registration')">Registrácia firmy</v-btn>
            <v-btn
              variant="outlined"
              color="#3A803D"
              class="mr-6 text-body-1 font-weight-semibold"
              style="font-weight:600;"
              :to="{ name: 'Login' }"
            >
              Prihlásenie
            </v-btn>
          </div>
          <v-btn class="d-md-none" icon @click="isMobileMenuOpen = !isMobileMenuOpen">
            <v-icon>{{ isMobileMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-expand-transition>
      <div v-if="isMobileMenuOpen" class="d-md-none">
        <v-divider />
        <v-container class="py-4">
          <v-btn block variant="text" class="mb-2 text-body-1" @click="scrollTo('hero')">Domov</v-btn>
          <v-btn block variant="text" class="mb-2 text-body-1" @click="scrollTo('about-internship')">O odbornej praxi</v-btn>
          <v-btn block variant="text" class="mb-2 text-body-1" @click="scrollTo('student-registration')">Registrácia študenta</v-btn>
          <v-btn block variant="text" class="mb-2 text-body-1" @click="scrollTo('company-registration')">Registrácia firmy</v-btn>
          <v-btn
            block
            variant="outlined"
            color="#3A803D"
            class="text-body-1"
            style="font-weight:600;"
            @click="scrollTo('login')"
          >
            Prihlásenie
          </v-btn>
        </v-container>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        this.isMobileMenuOpen = false
      }
    }
  }
}
</script>
