# Walmart Home Hub

This repository contains a small Flask backend and React frontend for a home hub application. A utility script `seed_products.py` is provided to seed a Supabase PostgreSQL table with fake products.

## Setup

1. Create a `.env` file in the project root containing:

```
SUPABASE_URL=<your Supabase project URL>
SUPABASE_KEY=<your Supabase service role key>
```

2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

## Seeding Products

Run the script from the project root:

```bash
python seed_products.py
```

The script will generate 150 products across six categories and insert them into the `products` table in your Supabase database. Set `clear_existing` in the script to `True` to wipe the table before inserting.

