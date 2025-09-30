# Query Directory

This script (`query_directory.py`) lets you quickly **search hawker centre stall data** by either:
- **Postal code**, or
- **Hawker centre name**.

It uses the `index.json` (built by `build_index.py`) to locate the correct CSV/XLSX file of stalls.

---

## How to Run
From the `backend` folder:
```bash
python query_directory.py
```
You'll be prompted: 
Enter postal code or hawker centre name:

If there is one match → it will show how many stalls were found, plus the first 10 as a preview.

If there are multiple matches (e.g. typing "Jurong") → it will ask you to choose which hawker centre.

If there are no matches → it will tell you nothing was found.


Enter postal code or hawker centre name: jurong
⚠️ Multiple matches found:
1. Jurong West 505 (640505)
2. Jurong East 347 (600347)

Select a number: 1
✅ Found 42 stalls in Jurong West 505 (640505)
- Ah Hock Chicken Rice
- ...

👉 Use this script whenever you want to look up stalls by postal code/centre name without digging into the CSV files manually.

