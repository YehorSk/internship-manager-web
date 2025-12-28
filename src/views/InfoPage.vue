<template>
  <v-app>
    <AppHeader />

    <section id="hero" class="pt-16">
      <v-container class="page py-16">
        <v-row class="align-center" no-gutters>
          <v-col cols="12" md="6" class="pr-md-8">
            <div
              class="d-inline-flex px-4 py-2 rounded-lg"
              style="background: rgba(58, 128, 61, 0.1)"
            >
              <span class="text-primary">{{ $t('Hero.badge') }}</span>
            </div>
            <div class="text-h2 mt-4">{{ $t('common.title') }}</div>
            <div class="text-body-1 text-medium-emphasis mt-3">
              {{ $t('Hero.subtitle') }}
            </div>
            <div class="d-flex flex-column flex-sm-row ga-3 mt-6">
              <PrimaryButton
                icon="mdi-school"
                size="large"
                @click="scrollTo('student-registration')"
              >
                {{ $t('Hero.student_btn') }}
              </PrimaryButton>
            </div>
            <div class="mt-4">
              <v-btn variant="outlined" size="large" @click="scrollTo('company-registration')">
                <v-icon start>mdi-office-building</v-icon>
                {{ $t('Hero.company_btn') }}
              </v-btn>
            </div>
            <div class="mt-4">
              <v-btn variant="tonal" size="large" @click="scrollTo('login')">
                <v-icon start>mdi-login</v-icon>
                {{ $t('Hero.login_btn') }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="mt-8 mt-md-0">
            <v-sheet class="rounded-xl overflow-hidden elevation-8">
              <v-img
                height="500"
                src="https://images.unsplash.com/photo-1640163561346-7778a2edf353?q=80&w=1170&auto=format&fit=crop"
                cover
              />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="about-internship" class="py-16" style="background: rgba(0, 0, 0, 0.03)">
      <v-container class="page">
        <div class="text-center mb-10">
          <div
            class="d-inline-flex px-4 py-2 rounded-lg mb-3"
            style="background: rgba(58, 128, 61, 0.1)"
          >
            <span class="text-primary">{{ $t('About.badge') }}</span>
          </div>
          <div class="text-h4 mb-2">{{ $t('About.title') }}</div>
          <div class="text-subtitle-1 text-medium-emphasis">{{ $t('About.subtitle') }}</div>
        </div>

        <v-row class="mb-10" align="stretch">
          <v-col cols="12" lg="4" class="d-flex">
            <v-card class="pa-8 rounded-xl flex-grow-1">
              <div
                class="d-inline-flex align-center ga-3 px-4 py-2 rounded-xl mb-4"
                style="background: rgba(58, 128, 61, 0.1)"
              >
                <div
                  class="d-flex align-center justify-center rounded-lg"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="primary" size="22"> mdi-file-document-outline </v-icon>
                </div>

                <span class="text-caption font-weight-medium text-primary">
                  {{ $t('About.steps.1.title') }}
                </span>
              </div>
              <div class="text-h6 mb-3">{{ $t('About.steps.1.desc1') }}</div>
              <div class="d-flex align-start ga-3">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.1.desc2') }}</div>
              </div>
              <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                <v-icon size="16">mdi-clock-outline</v-icon>
                <span class="text-body-2">{{ $t('About.steps.1.time') }}</span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" class="d-flex">
            <v-card class="pa-8 rounded-xl flex-grow-1">
              <div
                class="d-inline-flex align-center ga-3 px-4 py-2 rounded-xl mb-4"
                style="background: rgba(58, 128, 61, 0.1)"
              >
                <div
                  class="d-flex align-center justify-center rounded-lg"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="primary" size="22"> mdi-account-group-outline </v-icon>
                </div>

                <span class="text-caption font-weight-medium text-primary">
                  {{ $t('About.steps.2.title') }}
                </span>
              </div>
              <div class="text-h6 mb-3">{{ $t('About.steps.2.desc') }}</div>
              <div class="d-flex align-start ga-3 mb-2">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.2.desc1') }}</div>
              </div>
              <div class="d-flex align-start ga-3 mb-2">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.2.desc2') }}</div>
              </div>
              <div class="d-flex align-start ga-3">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.2.desc3') }}</div>
              </div>
              <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                <v-icon size="16">mdi-clock-outline</v-icon>
                <span class="text-body-2">{{ $t('About.steps.2.time') }}</span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" class="d-flex">
            <v-card class="pa-8 rounded-xl flex-grow-1">
              <div
                class="d-inline-flex align-center ga-3 px-4 py-2 rounded-xl mb-4"
                style="background: rgba(58, 128, 61, 0.1)"
              >
                <div
                  class="d-flex align-center justify-center rounded-lg"
                  style="width: 32px; height: 32px"
                >
                  <v-icon color="primary" size="22"> mdi-presentation </v-icon>
                </div>

                <span class="text-caption font-weight-medium text-primary">
                  {{ $t('About.steps.3.title') }}
                </span>
              </div>
              <div class="text-h6 mb-3">{{ $t('About.steps.3.desc') }}</div>
              <div class="d-flex align-start ga-3 mb-2">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.3.desc1') }}</div>
              </div>
              <div class="d-flex align-start ga-3 mb-2">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.3.desc2') }}</div>
              </div>
              <div class="d-flex align-start ga-3">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <div class="text-body-2">{{ $t('About.steps.3.desc3') }}</div>
              </div>
              <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                <v-icon size="16">mdi-clock-outline</v-icon>
                <span class="text-body-2">{{ $t('About.steps.3.time') }}</span>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="pa-10 rounded-xl" color="#3A803D" theme="dark">
          <div class="text-center mx-auto" style="max-width: 900px">
            <div class="text-h5 mb-4">{{ $t('About.summary_title') }}</div>
            <div class="text-subtitle-1 mb-8" style="opacity: 0.9">
              {{ $t('About.summary_text') }}
            </div>
            <v-row>
              <v-col cols="12" md="4">
                <v-sheet
                  class="rounded-xl pa-6"
                  color="white"
                  theme="light"
                  style="background: rgba(255, 255, 255, 0.1)"
                >
                  <div class="text-h4">150+</div>
                  <div class="text-body-2" style="opacity: 0.9">
                    {{ $t('About.summary_data.hours') }}
                  </div>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="4">
                <v-sheet
                  class="rounded-xl pa-6"
                  color="white"
                  theme="light"
                  style="background: rgba(255, 255, 255, 0.1)"
                >
                  <div class="text-h4">3</div>
                  <div class="text-body-2" style="opacity: 0.9">
                    {{ $t('About.summary_data.steps') }}
                  </div>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="4">
                <v-sheet
                  class="rounded-xl pa-6"
                  color="white"
                  theme="light"
                  style="background: rgba(255, 255, 255, 0.1)"
                >
                  <div class="text-h4">1</div>
                  <div class="text-body-2" style="opacity: 0.9">
                    {{ $t('About.summary_data.poster') }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-container>
    </section>

    <section id="student-registration" class="py-16">
      <v-container class="page">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6" class="pr-md-8">
            <v-sheet class="d-inline-flex pa-3 rounded-lg mb-4" color="rgba(58,128,61,.1)">
              <v-icon color="primary">mdi-school</v-icon>
            </v-sheet>
            <h2 class="text-h4 mb-2 font-weight-bold">{{ $t('Student.title') }}</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">
              {{ $t('Student.desc') }}
            </p>

            <v-list lines="false" density="comfortable" class="mb-8">
              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Student.points.desc') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Student.points.desc1') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Student.points.desc2') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Student.points.desc3') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <PrimaryButton
              class="text-body-1"
              size="large"
              style="font-weight: 600; letter-spacing: 0.3px"
              :to="{ name: 'Register' }"
            >
              {{ $t('Student.btn') }}
            </PrimaryButton>
          </v-col>

          <v-col cols="12" md="6" class="mt-8 mt-md-0">
            <v-card class="pa-8 rounded-xl elevation-2">
              <h3 class="text-h6 mb-6 font-weight-medium">
                {{ $t('Student.requirements_title') }}
              </h3>
              <v-divider class="mb-4" />
              <div class="mb-4">
                <div class="text-subtitle-2 mb-1 font-weight-medium">
                  {{ $t('Student.basic_info') }}
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ $t('Student.basic_info_desc') }}
                </p>
              </div>
              <v-divider class="mb-4" />
              <div>
                <div class="text-subtitle-2 mb-1 font-weight-medium">
                  {{ $t('Student.education') }}
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ $t('Student.education_desc') }}
                </p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="company-registration" class="py-16">
      <v-container class="page">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6" order="2" order-md="1" class="mt-8 mt-md-0 pr-md-6">
            <v-card class="pa-8 rounded-xl elevation-2">
              <h3 class="text-h6 mb-6 font-weight-medium">
                {{ $t('Company.requirements_title') }}
              </h3>
              <v-divider class="mb-4" />
              <div class="mb-4">
                <div class="text-subtitle-2 mb-1 font-weight-medium">
                  {{ $t('Company.company_info') }}
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ $t('Company.company_info_desc') }}
                </p>
              </div>
              <v-divider class="mb-4" />
              <div>
                <div class="text-subtitle-2 mb-1 font-weight-medium">
                  {{ $t('Company.contact_person') }}
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ $t('Company.contact_person_desc') }}
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" order="1" order-md="2">
            <v-sheet class="d-inline-flex pa-3 rounded-lg mb-4" color="rgba(58,128,61,.1)">
              <v-icon color="primary">mdi-office-building</v-icon>
            </v-sheet>
            <h2 class="text-h4 mb-2 font-weight-bold">{{ $t('Company.title') }}</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">
              {{ $t('Company.desc') }}
            </p>

            <v-list lines="false" density="comfortable" class="mb-8">
              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Company.points.desc') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Company.points.desc1') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Company.points.desc2') }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item class="py-2 px-2 rounded-lg hover:bg-grey-lighten-4 transition-all">
                <template #prepend>
                  <v-icon color="primary" size="22" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium text-high-emphasis">
                  {{ $t('Company.points.desc3') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <PrimaryButton
              class="text-body-1"
              size="large"
              style="font-weight: 600; letter-spacing: 0.3px"
              :to="{ path: '/register', query: { role: 'company' } }"
            >
              {{ $t('Company.btn') }}
            </PrimaryButton>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="login" class="py-16">
      <v-container class="page">
        <v-row justify="center">
          <v-col cols="12" md="10">
            <v-img
              height="300"
              class="rounded-xl"
              cover
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop"
            />
            <v-card
              class="pa-10 mx-auto rounded-xl elevation-8"
              style="
                max-width: 760px;
                margin-top: -80px;
                position: relative;
                z-index: 1;
                background: white;
              "
            >
              <div
                class="d-inline-flex pa-3 rounded-lg mb-4"
                style="background: rgba(58, 128, 61, 0.1)"
              >
                <v-icon color="primary">mdi-login</v-icon>
              </div>
              <div class="text-h4 mb-2">{{ $t('Login.title') }}</div>
              <div class="text-body-1 text-medium-emphasis mb-6">
                {{ $t('Login.desc') }}
              </div>
              <div class="d-flex flex-column flex-sm-row justify-center ga-3">
                <v-btn variant="outlined" size="large" :to="{ name: 'Login' }">
                  {{ $t('Login.btn') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <AppFooter />
  </v-app>
</template>
<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import PrimaryButton from '@/components/common/PrimaryButton.vue'

export default {
  components: { AppHeader, AppFooter, PrimaryButton },
  mounted() {
    this.scrollToHash(this.$route.hash)
  },
  watch: {
    '$route.hash'(newHash) {
      this.scrollToHash(newHash)
    },
  },
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    scrollToHash(hash) {
      if (!hash) return
      const id = hash.replace('#', '')
      let tries = 0
      const tryFind = () => {
        tries++
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return
        }
        if (tries < 8) setTimeout(tryFind, 150)
      }
      this.$nextTick(tryFind)
    },
  },
}
</script>
