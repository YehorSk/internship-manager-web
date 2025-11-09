<template>
  <div>
    <v-app-bar flat density="comfortable" class="bg-white bleed">
      <v-container class="full px-4 pr-6">
        <div class="d-flex align-center justify-space-between w-100">
          <div
            class="text-h6 pl-6"
            style="cursor: pointer; color: #3a803d; font-weight: 700; letter-spacing: 0.3px"
            @click="scrollTo('hero')"
          >
            {{ $t('Header.title') }}
          </div>
          <div class="d-none d-md-flex align-center ga-6">
            <v-btn
              variant="text"
              class="font-weight-semibold text-body-1"
              @click="scrollTo('hero')"
              >{{ $t('Header.home') }}</v-btn
            >
            <v-btn
              variant="text"
              class="font-weight-semibold text-body-1"
              @click="scrollTo('about-internship')"
              >{{ $t('Header.about') }}</v-btn
            >
            <v-btn
              variant="text"
              class="font-weight-semibold text-body-1"
              @click="scrollTo('student-registration')"
              >{{ $t('Header.student_registration') }}</v-btn
            >
            <v-btn
              variant="text"
              class="font-weight-semibold text-body-1"
              @click="scrollTo('company-registration')"
              >{{ $t('Header.company_registration') }}</v-btn
            >
            <v-btn
              variant="outlined"
              color="#3A803D"
              class="mr-6 text-body-1 font-weight-semibold"
              style="font-weight: 600"
              :to="{ name: 'Login' }"
            >
              {{ $t('Header.login') }}
            </v-btn>
            <LanguageSwitcher />
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
          <v-btn block variant="text" class="mb-2 text-body-1" @click="scrollTo('hero')">{{
            $t('Header.home')
          }}</v-btn>
          <v-btn
            block
            variant="text"
            class="mb-2 text-body-1"
            @click="scrollTo('about-internship')"
            >{{ $t('Header.about') }}</v-btn
          >
          <v-btn
            block
            variant="text"
            class="mb-2 text-body-1"
            @click="scrollTo('student-registration')"
            >{{ $t('Header.student_registration') }}</v-btn
          >
          <v-btn
            block
            variant="text"
            class="mb-2 text-body-1"
            @click="scrollTo('company-registration')"
            >{{ $t('Header.company_registration') }}</v-btn
          >
          <v-btn
            block
            variant="outlined"
            color="#3A803D"
            class="text-body-1"
            style="font-weight: 600"
            @click="scrollTo('login')"
          >
            {{ $t('Header.login') }}
          </v-btn>
          <LanguageSwitcher />
        </v-container>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

export default {
  name: 'AppHeader',
  components: { LanguageSwitcher },
  data() {
    return {
      isMobileMenuOpen: false,
    }
  },
  methods: {
    async scrollTo(id) {
      if (this.$route.name !== 'Info') {
        await this.$router.push({ name: 'Info' }).catch(() => {})
        this.tryScroll(id)
        return
      }

      this.tryScroll(id)
    },
    tryScroll(id, attempts = 6, delay = 150) {
      let tries = 0
      const attempt = () => {
        tries++
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          this.isMobileMenuOpen = false
          return
        }
        if (tries < attempts) {
          setTimeout(attempt, delay)
        }
      }
      this.$nextTick(attempt)
    },
  },
}
</script>
