import os
content = open('app/admin/page.jsx', 'r', encoding='utf-8').read()
old = 'WarungKu Admin'
new = 'WarungKu Admin</div>\n        <button onClick={() => router.push(\'/admin/products\')} className="text-xs bg-[#E85D26] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#C44D1E] transition-colors">Kelola Menu</button'
content = content.replace(old, new)
with open('app/admin/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
