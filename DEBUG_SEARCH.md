# Debug Search - "new" không ra "New York"

## Cách debug:

1. Mở browser console (F12)
2. Trong file `src/utils/fuzzySearch.ts`, đổi `const DEBUG = false;` thành `const DEBUG = true;`
3. Reload page và search "new"
4. Xem console logs để kiểm tra:
   - New York có trong CITIES không?
   - New York đã được thêm vào list chưa? (existingCitySlugs)
   - Search logic có match không?

## Nguyên nhân có thể:

1. **New York đã được thêm vào timeline rồi**
   - Nếu New York đang hiển thị trong timeline → search sẽ loại nó ra
   - Check: `existingCitySlugs.includes('new-york')` → true

2. **Search logic không match**
   - Kiểm tra console logs để xem searchable text và matches

## Fix:

Nếu New York đã được thêm rồi, đó là behavior đúng (không hiển thị cities đã thêm).
Nếu chưa được thêm nhưng vẫn không hiện, kiểm tra console logs để debug.
