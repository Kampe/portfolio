import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/work', name: 'work', component: () => import('./pages/WorkPage.vue') },
  { path: '/work/:slug', name: 'case-study', component: () => import('./pages/CaseStudyPage.vue') },
  { path: '/about', name: 'about', component: () => import('./pages/AboutPage.vue') },
  { path: '/resume', name: 'resume', component: () => import('./pages/ResumePage.vue') },
  { path: '/contact', name: 'contact', component: () => import('./pages/ContactPage.vue') },
  { path: '/lab', name: 'lab', component: () => import('./pages/LabPage.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('./pages/PrivacyPage.vue') },
  { path: '/404', name: '404', component: () => import('./pages/NotFoundPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
]
