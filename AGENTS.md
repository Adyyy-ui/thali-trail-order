<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## DineFlow
- Cart state lives in the CartProvider (src/lib/cart.tsx) mounted in src/routes/__root.tsx around <Outlet />; menu items and prices live in src/data/menu.ts as sample data (no database). GST 5% is applied on the bill.
- The site is intentionally dark-only with the black & gold token palette in src/styles.css; do not add a light/dark toggle.
