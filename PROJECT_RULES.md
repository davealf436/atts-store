# ATH (Abyssinia Trading Hub) Mini App Project Rules & Design Guidelines

## 1. Brand Identity
- **Full Brand Name**: **Abyssinia Trading Hub**
- **Short Brand Name / Logo**: **ATH**
- **Brand Slogan**: **Built for Better Trading.**
- **Logo Treatment**: Modern, clean geometric ATH monogram in deep burgundy (`#721428`) with subtle border (`#8C1B34`), crisp white typography, and ascending trading crest.
- **Entrance Animation**: Subtle, smooth 0.8–1.2s logo entrance animation (`@keyframes athEntrance`) when the Mini App opens, which settles gracefully into the normal static logo state with no recurring CPU overhead or flashy effects.

## 2. Typography
- **Primary Font**: **Plus Jakarta Sans** throughout the entire UI.
- Use Plus Jakarta Sans across all headings, body text, buttons, navigation, cards, badges, and modals.
- Load weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).

## 3. Theme & Color Palette
- **Light Theme**: Clean, premium light theme inspired by a modern professional trading platform.
- **Predominant Background**: White (`#FFFFFF`) cards and soft light canvas (`#F8F9FA`).
- **Primary Accent**: **Deep Burgundy** (`#721428`).
  - Hover: `#5A0E1E`
  - Active: `#470A17`
  - Subtle background tint: `#FAF0F2`
  - Subtle border tint: `#F0D5DA`
- Use deep burgundy for:
  - Primary buttons & CTAs
  - Active navigation indicators
  - Links & key highlights
  - Cart counter badge
  - ATH brand badge

## 4. Visual Styling & Structure
- **Borders & Shadows**: Subtle borders (`border-gray-200/90`) and restrained soft shadows (`shadow-xs`, `shadow-2xs`).
- **Corners**: Refined, slightly rounded rectangular shapes (`rounded-lg`, `rounded-xl`). Avoid excessive rounded corners (no generic large pills or bloated bubbly cards).
- **Aesthetic**: Modern professional trading terminal style. Avoid generic SaaS styling, neon colors, and excessive gradients.
- **Spacing**: Compact, balanced, and professional mobile-first layout.

## 5. Navigation & Layout
- **Top Bar**:
  - ATH logo mark with smooth entrance animation.
  - Abyssinia Trading Hub name and "Built for Better Trading." slogan.
  - Search trigger icon.
  - Cart icon with badge (Cart icon is kept exclusively in Top Bar).
- **Floating Bottom Navigation**:
  - Elevated slightly above bottom edge (`fixed bottom-3.5`).
  - Refined slightly rounded rectangular shape (`rounded-xl`), not a large pill.
  - Clean white/light surface with subtle border and soft shadow.
  - Active item uses deep burgundy accent.
  - Inactive items subtle and neutral gray.
  - 4 navigation tabs: **Home** · **Products** · **P2P** · **My Orders**.

## 6. Product Catalog & Brand Visuals
- Product cards follow Style C (Premium Mixed Product Cards).
- Strictly verified trading products: TradingView (Premium, Essential) and FXReplay Pro.
- Preserve real official TradingView and FXReplay vector logos.
- Home screen uses "View Options" CTA without fixed price.
- Products screen uses "View Details" CTA with starting price placeholder.
