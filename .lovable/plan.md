# Thali Trail Admin & Kitchen Extension

## Preserve the current ordering experience
- Keep the existing menu photos, cart, checkout, theme, and customer flow intact.
- Add optional table-aware QR links while retaining the current Table 12 link as a supported default.
- Keep payment status separate from order status.

## Secure accounts and order data
- Enable email/password sign-in, an admin login, password recovery, and protected admin/kitchen pages.
- Bootstrap the first administrator only for the email selected by the owner; keep confirmation enabled and do not create profile fields.
- Replace public order reads and updates with admin-only access; let customers submit orders only for an active, registered table.
- Add table records for 01–05 and preserve Table 12, plus status history and the requested completed status.

## Build the management portal
- Add a responsive Thali Trail sidebar and live dashboard with real order totals, sales, status counts, and active tables.
- Add live order controls, table/QR management, menu/category editing synced to the customer menu, date-filtered sales reports, team-role management, and settings.
- Add new-order visual/audio alerts, with sound kept user-controlled by browser permissions.

## Printing and verification
- Add printer configuration, connection check, test ticket, durable queue/history, retry, and duplicate prevention through a local printing agent interface.
- Verify account screens, access blocking, QR/table validation, order creation and status changes, live updates, reports, menu changes, and mobile layouts.
- Automatic paper printing cannot be verified until a local agent and thermal printer are installed; the owner's first admin session also requires email confirmation and a password.
