# 🤖 Cursor Workflow Setup - Linear Integration

## 📋 Workflow Overview

Khi nhận task từ Linear/Claude, task sẽ luôn có format:

```
## Ticket: MY-XX
## Branch: sonxpiaz/my-xx-...
## Link: https://linear.app/mytimezone/issue/MY-XX/...

## Context
[Tại sao cần làm task này]

## Task
[Mô tả cụ thể]

## Files
[List files cần tạo/update]

## Implementation Details
[Code snippets, specs chi tiết]

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

---

## ✅ Khi Hoàn Thành Task

### Step 1: Commit với format chuẩn

```bash
git commit -m "feat: [mô tả ngắn] - closes MY-XX"
```

**Ví dụ:**
```bash
git commit -m "feat: add embed button and modal - closes MY-25"
git commit -m "fix: calendar description format - closes MY-7"
git commit -m "docs: update project documentation - closes MY-24"
```

**Lưu ý:**
- Keyword `closes MY-XX` trong commit message sẽ auto-update Linear ticket
- Prefix: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`

### Step 2: Push to branch

```bash
git push origin sonxpiaz/my-xx-...
```

### Step 3: Confirm completion

Sau khi push, reply lại với format:

```
✅ Completed MY-XX
- Branch: sonxpiaz/my-xx-...
- Commit: [commit hash]
- Changes: [list files changed]
- Notes: [any issues or decisions made]
```

**Ví dụ:**
```
✅ Completed MY-25
- Branch: sonxpiaz/my-25-embed-button
- Commit: b282405
- Changes: EmbedModal.tsx (new), HomePage.tsx (updated)
- Notes: Added live preview iframe, theme selector, and copy button with feedback
```

---

## 🚨 Quan Trọng

- ✅ Keyword `closes MY-XX` trong commit message sẽ auto-update Linear ticket
- ✅ Luôn confirm lại sau khi done để Claude có thể track
- ✅ Nếu có blockers hoặc questions, raise ngay trước khi code
- ✅ Test build trước khi commit: `npm run build`
- ✅ Check linter errors: `npm run lint` (nếu có)

---

## 📝 Commit Message Conventions

| Type | Prefix | Example |
|------|--------|---------|
| New feature | `feat:` | `feat: add embed widget - closes MY-8` |
| Bug fix | `fix:` | `fix: calendar description duplicate - closes MY-7` |
| Documentation | `docs:` | `docs: update project docs - closes MY-24` |
| Refactoring | `refactor:` | `refactor: simplify URL state management` |
| Style | `style:` | `style: update button colors` |
| Test | `test:` | `test: add unit tests for calendar utils` |

---

## 🔄 Workflow Checklist

Khi nhận task:
- [ ] Đọc kỹ ticket description và acceptance criteria
- [ ] Check branch name và tạo branch nếu chưa có
- [ ] Review files cần update
- [ ] Implement changes
- [ ] Test locally (`npm run build`, check linter)
- [ ] Commit với format: `feat: ... - closes MY-XX`
- [ ] Push to branch
- [ ] Confirm completion với format chuẩn

---

## 💡 Best Practices

1. **Branch naming**: `sonxpiaz/my-xx-short-description`
2. **Commit granularity**: Mỗi commit nên là một logical change
3. **Testing**: Luôn test build trước khi commit
4. **Documentation**: Update docs nếu cần (PROJECT_DOCUMENTATION_LATEST.md)
5. **Code quality**: Follow existing patterns và conventions

---

## 📚 Related Files

- `PROJECT_DOCUMENTATION_LATEST.md` - Project documentation
- `README.md` - Project overview
- `.gitignore` - Git ignore rules

---

*Last updated: 2025-01-18*
