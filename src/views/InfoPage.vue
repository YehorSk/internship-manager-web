<script>
export default {
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

<template>
  <v-app>
      <v-app-bar flat density="comfortable" class="bg-white bleed">
        <v-container class="full px-4 pr-6">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="text-h6 text-primary pl-6" style="cursor:pointer" @click="scrollTo('hero')">Practice CRM</div>
            <div class="d-none d-md-flex align-center ga-6">
              <v-btn variant="text" @click="scrollTo('hero')">Domov</v-btn>
              <v-btn variant="text" @click="scrollTo('about-internship')">O odbornej praxi</v-btn>
              <v-btn variant="text" @click="scrollTo('student-registration')">Registrácia študenta</v-btn>
              <v-btn variant="text" @click="scrollTo('company-registration')">Registrácia firmy</v-btn>
              <v-btn variant="outlined" color="#3A803D" class="mr-6" @click="scrollTo('login')">Prihlásenie</v-btn>
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
            <v-btn block variant="text" class="mb-2" @click="scrollTo('hero')">Domov</v-btn>
            <v-btn block variant="text" class="mb-2" @click="scrollTo('about-internship')">O odbornej praxi</v-btn>
            <v-btn block variant="text" class="mb-2" @click="scrollTo('student-registration')">Registrácia študenta</v-btn>
            <v-btn block variant="text" class="mb-2" @click="scrollTo('company-registration')">Registrácia firmy</v-btn>
            <v-btn block variant="outlined" color="#3A803D" @click="scrollTo('login')">Prihlásenie</v-btn>
          </v-container>
        </div>
      </v-expand-transition>

    <section id="hero" class="pt-16">
      <v-container class="page py-16">
        <v-row class="align-center" no-gutters>
          <v-col cols="12" md="6" class="pr-md-8">
            <div class="d-inline-flex px-4 py-2 rounded-lg" style="background: rgba(58,128,61,.1)">
              <span class="text-primary">Spojte študentov s firmami</span>
            </div>
            <div class="text-h2 mt-4">Practice CRM</div>
            <div class="text-body-1 text-medium-emphasis mt-3">
              Váš komplexný portál pre vyhľadávanie a správu stáží. Prepojujeme študentov s firmami pre vzájomnú spoluprácu a rast.
            </div>
            <div class="d-flex flex-column flex-sm-row ga-3 mt-6">
              <v-btn color="#3A803D" class="text-white" size="large" @click="scrollTo('student-registration')">
                <v-icon start>mdi-school</v-icon>
                Registrácia študenta
              </v-btn>
              <v-btn variant="outlined" size="large" @click="scrollTo('company-registration')">
                <v-icon start>mdi-office-building</v-icon>
                Registrácia firmy
              </v-btn>
            </div>
            <div class="mt-4">
              <v-btn variant="tonal" size="large" @click="scrollTo('login')">
                <v-icon start>mdi-login</v-icon>
                Prihlásenie
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="mt-8 mt-md-0">
            <v-sheet class="rounded-xl overflow-hidden elevation-8">
              <v-img
                height="500"
                src="https://images.unsplash.com/photo-1701967341617-14499d8bf8c3?q=80&w=1400&auto=format&fit=crop"
                cover
              />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="about-internship" class="py-16" style="background: rgba(0,0,0,.03)">
        <v-container class="page">
          <div class="text-center mb-10">
            <div class="d-inline-flex px-4 py-2 rounded-lg mb-3" style="background: rgba(58,128,61,.1)">
              <span class="text-primary">Informácie o predmete</span>
            </div>
            <div class="text-h4 mb-2">O odbornej praxi</div>
            <div class="text-subtitle-1 text-medium-emphasis">KI/OP/22 – Odborná prax</div>
          </div>

          <v-row class="mb-10" align="stretch">
            <v-col cols="12" lg="4">
              <v-card class="pa-8 rounded-xl">
                <div class="d-inline-flex align-center justify-center rounded-xl mb-4" style="width:56px; height:56px; background: rgba(58,128,61,.1)">
                  <v-icon color="primary">mdi-file-document-outline</v-icon>
                </div>
                <div class="d-inline-flex px-3 py-1 rounded-pill mb-3" style="background: rgba(58,128,61,.1)">
                  <span class="text-caption text-primary">Krok 1</span>
                </div>
                <div class="text-h6 mb-3">Príprava podkladov k realizácii odbornej praxe</div>
                <div class="d-flex align-start ga-3">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Príprava podkladov pre absolvovanie praxe v súlade so smernicami fakulty</div>
                </div>
                <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                  <v-icon size="16">mdi-clock-outline</v-icon>
                  <span class="text-body-2">Domáca príprava: 1 hodina</span>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" lg="4">
              <v-card class="pa-8 rounded-xl">
                <div class="d-inline-flex align-center justify-center rounded-xl mb-4" style="width:56px; height:56px; background: rgba(58,128,61,.1)">
                  <v-icon color="primary">mdi-account-group-outline</v-icon>
                </div>
                <div class="d-inline-flex px-3 py-1 rounded-pill mb-3" style="background: rgba(58,128,61,.1)">
                  <span class="text-caption text-primary">Krok 2</span>
                </div>
                <div class="text-h6 mb-3">Aktívna účasť na odbornej praxi</div>
                <div class="d-flex align-start ga-3 mb-2">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Účasť v rozsahu najmenej 150 hodín</div>
                </div>
                <div class="d-flex align-start ga-3 mb-2">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Rozvoj praktických skúseností a mäkkých zručností</div>
                </div>
                <div class="d-flex align-start ga-3">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Plnenie pracovných úloh podľa inštrukcií tutora</div>
                </div>
                <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                  <v-icon size="16">mdi-clock-outline</v-icon>
                  <span class="text-body-2">Minimálne 150 hodín praxe</span>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" lg="4">
              <v-card class="pa-8 rounded-xl">
                <div class="d-inline-flex align-center justify-center rounded-xl mb-4" style="width:56px; height:56px; background: rgba(58,128,61,.1)">
                  <v-icon color="primary">mdi-presentation</v-icon>
                </div>
                <div class="d-inline-flex px-3 py-1 rounded-pill mb-3" style="background: rgba(58,128,61,.1)">
                  <span class="text-caption text-primary">Krok 3</span>
                </div>
                <div class="text-h6 mb-3">Prezentácia výsledkov odbornej praxe</div>
                <div class="d-flex align-start ga-3 mb-2">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Finalizácia dokumentov o priebehu praxe</div>
                </div>
                <div class="d-flex align-start ga-3 mb-2">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Príprava posteru v definovanej štruktúre</div>
                </div>
                <div class="d-flex align-start ga-3">
                  <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                  <div class="text-body-2">Prezentácia výsledkov a získaných zručností</div>
                </div>
                <div class="d-flex align-center ga-2 mt-4 text-medium-emphasis">
                  <v-icon size="16">mdi-clock-outline</v-icon>
                  <span class="text-body-2">Domáca príprava: 1 hodina</span>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="pa-10 rounded-xl" color="#3A803D" theme="dark">
            <div class="text-center mx-auto" style="max-width: 900px">
              <div class="text-h5 mb-4">Stručná osnova predmetu</div>
              <div class="text-subtitle-1 mb-8" style="opacity:.9">
                Predmet Odborná prax poskytuje študentom príležitosť získať praktické skúsenosti vo firmách alebo organizáciách. Študenti absolvujú minimálne 150 hodín praxe zameranej na rozvoj praktických skúseností a mäkkých zručností.
              </div>
              <v-row>
                <v-col cols="12" md="4">
                  <v-sheet class="rounded-lg pa-6" color="white" theme="light" style="background: rgba(255,255,255,.1)">
                    <div class="text-h4">150+</div>
                    <div class="text-body-2" style="opacity:.9">Hodín praxe</div>
                  </v-sheet>
                </v-col>
                <v-col cols="12" md="4">
                  <v-sheet class="rounded-lg pa-6" color="white" theme="light" style="background: rgba(255,255,255,.1)">
                    <div class="text-h4">3</div>
                    <div class="text-body-2" style="opacity:.9">Hlavné kroky</div>
                  </v-sheet>
                </v-col>
                <v-col cols="12" md="4">
                  <v-sheet class="rounded-lg pa-6" color="white" theme="light" style="background: rgba(255,255,255,.1)">
                    <div class="text-h4">1</div>
                    <div class="text-body-2" style="opacity:.9">Posterová prezentácia</div>
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
            <h2 class="text-h4 mb-2 font-weight-bold">Registrácia pre študentov</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Vytvorte si profil a objavte stáže, ktoré zodpovedajú vašim zručnostiam a kariérnym cieľom.
            </p>

            <v-list lines="one" density="compact" class="mb-6">
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Prístup k stážovým pozíciám v rôznych odboroch</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Nové ponuky stáží každý deň priamo podľa vašich preferencií</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Možnosť získať certifikáty a referencie</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Jednoduchá správa žiadostí a komunikácia</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-btn
              color="#3A803D"
              class="text-white"
              size="large"
              rounded="xl"
              to="/register"
            >
              Zaregistrovať sa ako študent
            </v-btn>

          </v-col>

          <v-col cols="12" md="6" class="mt-8 mt-md-0">
            <v-card class="pa-8 rounded-xl elevation-2">
              <h3 class="text-h6 mb-6 font-weight-medium">Požiadavky na registráciu</h3>
              <v-divider class="mb-4" />
              <div class="mb-4">
                <div class="text-subtitle-2 mb-1 font-weight-medium">Základné informácie</div>
                <p class="text-body-2 text-medium-emphasis">
                  Meno, priezvisko, adresa, email, telefónne číslo
                </p>
              </div>
              <v-divider class="mb-4" />
              <div>
                <div class="text-subtitle-2 mb-1 font-weight-medium">Vzdelanie</div>
                <p class="text-body-2 text-medium-emphasis">
                  Študijný odbor, študentský e-mail
                </p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="company-registration" class="py-16" style="background: rgba(0,0,0,.03)">
      <v-container class="page">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6" order="2" order-md="1" class="mt-8 mt-md-0 pr-md-6"> <!-- додано pr-md-6 -->
            <v-card class="pa-8 rounded-xl elevation-2">
              <h3 class="text-h6 mb-6 font-weight-medium">Požiadavky na registráciu</h3>
              <v-divider class="mb-4" />
              <div class="mb-4">
                <div class="text-subtitle-2 mb-1 font-weight-medium">Firemné údaje</div>
                <p class="text-body-2 text-medium-emphasis">Názov firmy, adresa sídla</p>
              </div>
              <v-divider class="mb-4" />
              <div>
                <div class="text-subtitle-2 mb-1 font-weight-medium">Kontaktná osoba</div>
                <p class="text-body-2 text-medium-emphasis">Meno, pozícia, email, telefón</p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" order="1" order-md="2">
            <v-sheet class="d-inline-flex pa-3 rounded-lg mb-4" color="rgba(58,128,61,.1)">
              <v-icon color="primary">mdi-office-building</v-icon>
            </v-sheet>
            <h2 class="text-h4 mb-2 font-weight-bold">Registrácia pre firmy</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Zaregistrujte svoju firmu, vytvárajte stážové pozície a nájdite talentovaných študentov pre vaše projekty.
            </p>

            <v-list lines="one" density="compact" class="mb-6">
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Neobmedzený počet stážových ponúk</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Priamy prístup ku kvalifikovaným a motivovaným študentom</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Nástroje na správu žiadostí a komunikáciu</v-list-item-title>
              </v-list-item>
              <v-list-item class="pa-0">
                <template #prepend><v-icon color="primary" size="20">mdi-check-circle</v-icon></template>
                <v-list-item-title>Možnosť budovať dlhodobé partnerstvá</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-btn
              color="#3A803D"
              class="text-white"
              size="large"
              rounded="xl"
              :to="{ path: '/register', query: { role: 'company' } }"
            >
              Zaregistrovať sa ako firma
            </v-btn>

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
              <v-card class="pa-10 mx-auto rounded-xl elevation-8" style="max-width: 760px; margin-top: -80px; position: relative; z-index: 1; background: white">
                <div class="d-inline-flex pa-3 rounded-lg mb-4" style="background: rgba(58,128,61,.1)">
                  <v-icon color="primary">mdi-login</v-icon>
                </div>
                <div class="text-h4 mb-2">Už máte účet?</div>
                <div class="text-body-1 text-medium-emphasis mb-6">
                  Prihláste sa do svojho účtu a pokračujte v hľadaní stáží alebo správe ponúk.
                </div>
                <div class="d-flex flex-column flex-sm-row justify-center ga-3">
                  <v-btn variant="outlined" size="large">Prihlásenie</v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <v-footer class="py-12 bleed" color="#3A803D" theme="dark">
        <v-container class="full">
          <v-row class="mb-8">
            <v-col cols="12" md="4" class="mb-6 mb-md-0">
              <div class="d-flex align-center ga-2 mb-3">
                <v-sheet class="pa-2 rounded" style="background: rgba(255,255,255,.1)">
                  <v-icon>mdi-school</v-icon>
                </v-sheet>
                <div class="text-subtitle-1">Practice CRM</div>
              </div>
              <div class="text-body-2" style="opacity:.9">
                Váš portál pre vyhľadávanie a správu stáží. Prepojujeme študentov s firmami a vytvárame príležitosti.
              </div>
            </v-col>

            <v-col cols="12" md="4" class="mb-6 mb-md-0">
              <div class="d-flex align-center ga-2 mb-4">
                <v-sheet width="32" height="2" color="white" style="opacity:.4" />
                <div>Rýchle odkazy</div>
              </div>
              <div class="d-flex flex-column ga-2">
                <v-btn variant="text" class="justify-start" @click="scrollTo('hero')">Domov</v-btn>
                <v-btn variant="text" class="justify-start" @click="scrollTo('about-internship')">O odbornej praxi</v-btn>
                <v-btn variant="text" class="justify-start" @click="scrollTo('student-registration')">Registrácia študenta</v-btn>
                <v-btn variant="text" class="justify-start" @click="scrollTo('company-registration')">Registrácia firmy</v-btn>
                <v-btn variant="text" class="justify-start" @click="scrollTo('login')">Prihlásenie</v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="d-flex align-center ga-2 mb-4">
                <v-sheet width="32" height="2" color="white" style="opacity:.4" />
                <div>Kontakt vedúceho fakulty</div>
              </div>
              <div class="d-flex align-start ga-3 mb-3">
                <v-sheet class="pa-2 rounded" style="background: rgba(255,255,255,.1)">
                  <v-icon>mdi-email-outline</v-icon>
                </v-sheet>
                <a href="mailto:fakulta@univerzita.sk" class="text-body-2" style="opacity:.9">fakulta@univerzita.sk</a>
              </div>
              <div class="d-flex align-start ga-3 mb-3">
                <v-sheet class="pa-2 rounded" style="background: rgba(255,255,255,.1)">
                  <v-icon>mdi-phone</v-icon>
                </v-sheet>
                <a href="tel:+421123456789" class="text-body-2" style="opacity:.9">+421 123 456 789</a>
              </div>
              <div class="d-flex align-start ga-3">
                <v-sheet class="pa-2 rounded" style="background: rgba(255,255,255,.1)">
                  <v-icon>mdi-map-marker</v-icon>
                </v-sheet>
                <div class="text-body-2" style="opacity:.9">
                  Fakulta informatiky<br>Univerzitná 1<br>811 06 Bratislava
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="mb-6" style="opacity:.2" />
          <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
            <div class="text-body-2" style="opacity:.8">© {{ new Date().getFullYear() }} Practice CRM. Všetky práva vyhradené.</div>
            <div class="d-flex align-center ga-6 text-caption" style="opacity:.8">
              <span>Vytvorené s ❤️ pre študentov</span>
              <span class="d-none d-sm-inline">•</span>
              <span class="d-none d-sm-inline">Verzia 1.0</span>
            </div>
          </div>
        </v-container>
      </v-footer>
  </v-app>
</template>

