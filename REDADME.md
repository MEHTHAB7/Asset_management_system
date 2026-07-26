# Asset Management System

A Node.js web application that helps a company track its assets (laptops, cell phones,
modems, tools, etc.) and manage which employees they are issued to.

## Tech Stack
- Node.js + Express
- PostgreSQL + Sequelize ORM
- Pug (successor to Jade, same templating syntax)
- Bootstrap 5
- Custom CSS
- DataTables.net

## Setup
1. Clone the repo, run `npm install`
2. Create a PostgreSQL database: `createdb asset_management`
3. Create a `.env` file in the project root with:
   ```
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=asset_management
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   ```
4. Run migrations: `npx sequelize-cli db:migrate`
5. Start the server: `node app.js`
6. Visit `http://localhost:3000`

## Database Design
Five tables: Branch, Employee, AssetCategory, Asset, AssetTransaction.

`Asset` stores only the *current* state of an asset (status, current branch, current
holder). `AssetTransaction` is an append-only log of every event that happens to an
asset (PURCHASE, ISSUE, RETURN, REPAIR, SCRAP). This is what powers Asset History —
one ordered query against a single table reconstructs an asset's entire lifecycle
from purchase to scrap.

## Design Decisions

- **Return logic:** When an asset is returned with reason REPAIR, it goes into IN_REPAIR status. Any other reason (UPGRADE, RESIGNATION, DAMAGED, OTHER) returns it to IN_STOCK.
- **Serial number + asset tag:** Each asset has both a serial number and a separate asset tag, since the spec requires assets to be identifiable by their serial number as well as a unique id.
- **Authentication:** left out of scope, since it was not part of the original requirements. In a production system, role-based access (e.g. HR only manages Employees, warehouse staff only manages Assets) would be a natural next step.

## What's Implemented
1. Employee Master — Add/Edit/View, filters for active/inactive, search
2. Asset Master — Add/Edit/View, filter by category, search by make/model, unique serial number + asset tag
3. Asset Category Master — Add/Edit/View
4. Stock View — assets in stock grouped by branch, with a total value footer
5. Issue Asset — assign an available asset to an active employee
6. Return Asset — return an issued asset, capturing a reason (upgrade/repair/resignation/damaged/other)
7. Scrap Asset — mark an asset obsolete; scrapped assets are hidden from all pages except history/reports
8. Asset History — full chronological log of an asset from purchase to scrap
9. DataTables.net search/sort/pagination on all list views
10. Custom CSS on top of Bootstrap

## Known Limitations / Future Improvements
- Dates on the Asset History page currently render as raw JavaScript timestamps rather than a formatted date
- No automated tests
- No server-side pagination (DataTables handles this client-side only, fine for current data volume)
- No authentication/authorization (see Design Decisions above)