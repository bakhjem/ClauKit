<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/i18n/vi.md (MIT) -->

# i18n — Tiếng Việt (vi)

## Tiêu đề báo cáo

| Key | Text |
|---|---|
| header.title | Báo Cáo Quét Bảo Mật |
| header.scope | Phạm vi |
| header.files_scanned | Số file đã quét |
| header.primary_lang | Ngôn ngữ chính |
| header.mode | Chế độ quét |
| header.date | Ngày |
| header.output_lang | Ngôn ngữ đầu ra |

## Kết luận

| Key | Text |
|---|---|
| verdict.fail | THẤT BẠI |
| verdict.warn | CẢNH BÁO |
| verdict.pass | ĐẠT |
| verdict.fail_desc | Phát hiện lỗ hổng nghiêm trọng — cần xử lý ngay lập tức. |
| verdict.warn_desc | Phát hiện vấn đề mức cao — cần xem xét và khắc phục trước khi phát hành. |
| verdict.pass_desc | Không phát hiện vấn đề nghiêm trọng hoặc mức cao. |

## Tiêu đề phần

| Key | Text |
|---|---|
| section.critical | Phát Hiện MỨC NGHIÊM TRỌNG |
| section.high | Phát Hiện MỨC CAO |
| section.medium | Phát Hiện MỨC TRUNG BÌNH |
| section.low | Phát Hiện MỨC THẤP |
| section.passed | Kiểm Tra Đã Qua |
| section.next_steps | Bước Tiếp Theo |

## Trường thông tin

| Key | Text |
|---|---|
| finding.file | File |
| finding.line | Dòng |
| finding.rule | Quy tắc |
| finding.severity | Mức độ |
| finding.description | Mô tả |
| finding.why_dangerous | Tại sao nguy hiểm |
| finding.attack_scenario | Kịch bản tấn công |
| finding.code_before | Code có lỗ hổng |
| finding.code_after | Code đã sửa |
| finding.impact | Tác động |
| finding.fix | Khuyến nghị sửa lỗi |
| finding.references | Tài liệu tham khảo |

## Nhãn mức độ

| Key | Text |
|---|---|
| severity.critical | NGHIÊM TRỌNG |
| severity.high | CAO |
| severity.medium | TRUNG BÌNH |
| severity.low | THẤP |

## Thông báo

| Key | Text |
|---|---|
| msg.no_findings_critical | Không phát hiện vấn đề nghiêm trọng. |
| msg.no_findings_high | Không phát hiện vấn đề mức cao. |
| msg.report_saved | Báo cáo đã lưu tại |
| msg.gitignore_warning | Cảnh báo: security-reports/ chưa có trong .gitignore. Nên thêm vào để tránh commit báo cáo quét. |
| msg.disclaimer | Báo cáo này chỉ mang tính tham khảo — không thay thế kiểm toán bảo mật chuyên nghiệp. |
| msg.chunk_failed | Quét chunk thất bại — kết quả có thể không đầy đủ cho |
| msg.scan_complete | Quét hoàn tất. |

## Nhãn chế độ

| Key | Text |
|---|---|
| mode.small | NHỎ (quét trực tiếp) |
| mode.large | LỚN (chia chunk + sub-agent) |
