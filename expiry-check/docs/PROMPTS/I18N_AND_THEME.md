You are a Senior Frontend Architect working on an existing React + Vite SaaS application called "Expiry Check".

The project already contains:

A design system

Color variables

Theme tokens

Reusable components

Existing page architecture

Existing Alert page implementation that should be considered the reference implementation

Your task is to implement a production-ready multilingual system (Arabic/English) and a complete theme system (Light/Dark/System) across the entire application while preserving the existing design system and component architecture.

==================================================== PROJECT RULES

Before writing any code:

Analyze the existing project structure.

Analyze existing components.

Analyze the Alert page implementation.

Analyze existing theme files.

Analyze color variables and design tokens.

Reuse existing architecture whenever possible.

Do not redesign the UI.

Do not create a new design system.

Do not duplicate code.

==================================================== INTERNATIONALIZATION (i18n)

Use:

react-i18next

Create:

src/i18n/index.ts

src/locales/en.json

src/locales/ar.json

Requirements:

Support English (en)

Support Arabic (ar)

Default language = English

Allow users to switch languages at any time

Save selected language in localStorage

Restore language automatically on application startup

Use translation keys everywhere

Example:

❌ Dashboard

✅ t('navigation.dashboard')

Translate all UI text:

Navigation

Sidebar

Buttons

Forms

Tables

Alerts

Notifications

Dashboard

Analytics

AI Insights

Settings

Empty States

Loading States

Error Messages

Important:

Translate only static UI content.

Do NOT translate:

Product names

User-generated content

API data

Product categories unless translated values are provided

==================================================== RTL SUPPORT

When Arabic is selected:

document.documentElement.dir = 'rtl'

document.documentElement.lang = 'ar'

When English is selected:

document.documentElement.dir = 'ltr'

document.documentElement.lang = 'en'

Requirements:

Entire layout must support RTL

Sidebar should automatically move to the correct side

Navigation should adapt to RTL

Tables should display correctly

Forms should feel native in Arabic

Spacing should adapt properly

Do not create duplicate pages for Arabic.

The same components must work in both directions.

Use logical CSS properties whenever possible.

==================================================== THEME SYSTEM

Implement a centralized theme system.

Supported themes:

light

dark

system

Requirements:

Use CSS variables

Use existing design tokens

Use existing color system

Never hardcode dark mode colors inside components

Never duplicate styles

Create:

ThemeProvider

useTheme hook

Theme behavior:

Save selected theme in localStorage

Restore theme automatically

If no preference exists, use prefers-color-scheme

System mode follows OS preference

==================================================== DARK MODE SUPPORT

Apply dark mode to all pages:

Login

Dashboard

Product Details

Product Inventory

Alert

Analytics

AI Insights

Settings

Apply dark mode correctly to:

Backgrounds

Cards

Tables

Inputs

Dropdowns

Modals

Sidebar

Navbar

Charts

Text

Borders

Status Badges

Alert Cards

Dark mode should feel similar to:

Linear

Vercel

Stripe

Notion

Professional, clean, and modern.

==================================================== REUSABLE COMPONENTS

Create reusable components:

ThemeToggle

LanguageSwitcher

ThemeToggle options:

Light

Dark

System

LanguageSwitcher options:

English

العربية

Do not duplicate theme logic.

Do not duplicate language logic.

==================================================== ARCHITECTURE

Create centralized providers:

ThemeProvider

LanguageProvider

Create reusable hooks:

useTheme()

useLanguage()

Wrap the entire application with providers.

Never implement theme or language logic inside individual pages.

Pages should only consume the hooks.

==================================================== DESIGN SYSTEM COMPLIANCE

Strict Rules:

Never hardcode colors

Never hardcode theme values

Never hardcode translated text

Always use design tokens

Always use CSS variables

Always reuse existing components

Changing one theme variable should update the entire application automatically.

==================================================== OUTPUT REQUIREMENTS

Before implementing:

Analyze existing architecture

Analyze theme system

Analyze Alert page implementation

Identify reusable components

Then:

Implement i18n

Implement RTL support

Implement ThemeProvider

Implement LanguageProvider

Implement ThemeToggle

Implement LanguageSwitcher

Apply support across all pages

The final result should be production-ready, scalable, maintainable, and fully integrated with the existing Expiry Check architecture without introducing duplicated code.