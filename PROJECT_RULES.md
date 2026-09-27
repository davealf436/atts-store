# ATH Mini App Project Rules & Design Guidelines

## 1. Brand Identity
- **Brand Name**: **ATH**
- **Brand Slogan**: **Built for Better Trading.**
- **Official Brand Logo**: The **Origami Bird** in flight — an origami geometric low-poly bird crafted with faceted royal amethyst crystal planes and polished 3D metallic gold wireframe creases (`#D4AF37`).
- **Logo Freedom**: Completely frameless and unconfined — **no square bounding boxes, border lines, or enclosing containers**. The bird floats freely with its natural silhouette.
- **Logo Animations**:
  - **Floating Hover Physics**: Smooth sine-wave levitation simulating flight.
  - **Wing Flex Articulation**: Gentle micro-flexing of the main wing facets.
  - **Metallic Gold Shimmer**: Light sheen gliding across the creases and amethyst specular highlights.
  - **Haptic Touch Reaction**: Tactile flutter upon tapping/clicking with Telegram haptics.

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

## 4. Visual Styling & Structure
- **Borders & Shadows**: Subtle borders (`border-gray-200/90`) and restrained soft shadows (`shadow-xs`, `shadow-2xs`).
- **Corners**: Refined, slightly rounded rectangular shapes (`rounded-lg`, `rounded-xl`). Avoid excessive rounded corners (no generic large pills or bloated bubbly cards).
- **Aesthetic**: Modern professional trading terminal style. Avoid generic SaaS styling, neon colors, and excessive gradients.
- **Spacing**: Compact, balanced, and professional mobile-first layout.

## 5. Navigation & Layout
- **Top Bar**:
  - Unboxed, free-floating ATH origami bird logo.
  - Bold brand name: **ATH** with "Built for Better Trading." slogan.
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
