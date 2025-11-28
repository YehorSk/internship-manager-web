<template>
  <v-footer color="#3A803D" theme="dark" class="py-14">
    <v-container class="full">
      <v-row class="mb-12" align="start" justify="space-between" no-gutters>

        <v-col cols="12" md="4" class="pr-md-8 mb-8 mb-md-0">
          <div class="d-flex align-center ga-3 mb-4">
            <v-sheet class="pa-2 rounded-lg" style="background: rgba(255,255,255,.15)">
              <v-icon>mdi-school</v-icon>
            </v-sheet>
            <div class="text-h6 font-weight-bold" style="letter-spacing:0.4px;">{{ $t('common.title') }}</div>
          </div>
          <div class="text-body-2" style="opacity:.9; line-height:1.6;">
            {{ $t('Footer.desc') }}
          </div>
          <div class="mt-5 d-inline-flex align-center ga-2 px-4 py-2 rounded-pill" style="background: rgba(255,255,255,.1)">
            <v-sheet class="rounded-circle" width="8" height="8" color="green" />
            <span class="text-caption" style="opacity:.9;">{{ $t('Footer.status') }}</span>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="px-md-8 mb-8 mb-md-0">
          <div class="text-subtitle-1 font-weight-bold mb-4" style="letter-spacing:0.4px;">{{ $t('Footer.quick_links') }}</div>
          <div class="d-flex flex-column ga-2">
            <v-btn variant="text" class="justify-start text-body-2 font-weight-bold text-white" style="text-transform:none; opacity:.9;" @click="scrollTo('hero')">{{ $t('Footer.home') }}</v-btn>
            <v-btn variant="text" class="justify-start text-body-2 font-weight-bold text-white" style="text-transform:none; opacity:.9;" @click="scrollTo('about-internship')">{{ $t('Footer.about') }}</v-btn>
            <v-btn variant="text" class="justify-start text-body-2 font-weight-bold text-white" style="text-transform:none; opacity:.9;" @click="scrollTo('student-registration')">{{ $t('Footer.student_registration') }}</v-btn>
            <v-btn variant="text" class="justify-start text-body-2 font-weight-bold text-white" style="text-transform:none; opacity:.9;" @click="scrollTo('company-registration')">{{ $t('Footer.company_registration') }}</v-btn>
            <v-btn variant="text" class="justify-start text-body-2 font-weight-bold text-white" style="text-transform:none; opacity:.9;" @click="scrollTo('login')">{{ $t('Footer.login') }}</v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="pl-md-8">
          <div class="text-subtitle-1 font-weight-bold mb-4" style="letter-spacing:0.4px;">{{ $t('Footer.contact') }}</div>
          <div class="d-flex flex-column ga-3">
            <div class="d-flex align-start ga-3">
              <v-sheet class="pa-2 rounded-lg" style="background: rgba(255,255,255,.1)">
                <v-icon>mdi-email-outline</v-icon>
              </v-sheet>
              <a href="mailto:fakulta@univerzita.sk" class="text-body-2 text-white" style="opacity:.9; text-decoration:none;">{{ $t('Footer.email') }}</a>
            </div>
            <div class="d-flex align-start ga-3">
              <v-sheet class="pa-2 rounded-lg" style="background: rgba(255,255,255,.1)">
                <v-icon>mdi-phone</v-icon>
              </v-sheet>
              <a href="tel:+421123456789" class="text-body-2 text-white" style="opacity:.9; text-decoration:none;">{{ $t('Footer.phone') }}</a>
            </div>
            <div class="d-flex align-start ga-3">
              <v-sheet class="pa-2 rounded-lg" style="background: rgba(255,255,255,.1)">
                <v-icon>mdi-map-marker</v-icon>
              </v-sheet>
              <div class="text-body-2" style="opacity:.9; line-height:1.5;">
                {{ $t('Footer.address_line1') }}<br>{{ $t('Footer.address_line2') }}<br>{{ $t('Footer.address_line3') }}
              </div>
            </div>
          </div>
        </v-col>

      </v-row>

      <v-divider class="mb-6" style="opacity:.15" />

      <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4 text-body-2" style="opacity:.85;">
        <div>© {{ new Date().getFullYear() }} <strong>{{ $t('common.title') }}</strong>{{ $t('Footer.copyright2') }}</div>
        <div class="d-flex align-center ga-3 text-caption">
          <span>{{ $t('Footer.made_with') }}</span>
          <span class="d-none d-sm-inline">•</span>
          <span class="d-none d-sm-inline">{{ $t('Footer.version') }}</span>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  methods: {
    async scrollTo(id) {
      if (this.$route.name !== 'Info') {
        await this.$router.push({ name: 'Info'}).catch(() => {})
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
    }
  }

}
</script>

