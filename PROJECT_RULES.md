# ATTS Mini App Project Rules & Design Guidelines

## 1. Typography
- **Primary Font**: **Plus Jakarta Sans** throughout the entire UI.
- Use Plus Jakarta Sans across all headings, body text, buttons, navigation, cards, badges, and modals.
- Load weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).

## 2. Theme & Color Palette
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
  - ATTS brand badge

## 3. Visual Styling & Structure
- **Borders & Shadows**: Subtle borders (`border-gray-200/90`) and restrained soft shadows (`shadow-xs`, `shadow-2xs`).
- **Corners**: Refined, slightly rounded rectangular shapes (`rounded-lg`, `rounded-xl`). Avoid excessive rounded corners (no generic large pills or bloated bubbly cards).
- **Aesthetic**: Modern professional trading terminal style. Avoid generic SaaS styling, neon colors, and excessive gradients.
- **Spacing**: Compact, balanced, and professional mobile-first layout.

## 4. Navigation & Layout
- **Top Bar**:
  - ATTS branding and monogram.
  - Search trigger icon.
  - Cart icon with badge (Cart icon is kept exclusively in Top Bar).
- **Floating Bottom Navigation**:
  - Elevated slightly above bottom edge (`fixed bottom-3.5`).
  - Refined slightly rounded rectangular shape (`rounded-xl`), not a large pill.
  - Clean white/light surface with subtle border and soft shadow.
  - Active item uses deep burgundy accent.
  - Inactive items subtle and neutral gray.
  - 4 navigation tabs: **Home** · **Products** · **P2P** · **My Orders**.

## 5. Product Catalog & Brand Visuals
- Product cards follow Style C (Premium Mixed Product Cards).
- Strictly verified trading products: TradingView (Premium, Essential) and FXReplay Pro.
- Preserve real official TradingView and FXReplay vector logos.
- Home screen uses "View Options" CTA without fixed price.
- Products screen uses "View Details" CTA with starting price placeholder.
