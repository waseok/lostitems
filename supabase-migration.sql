-- 수령 신청자 정보 컬럼 추가
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS claimer_grade text;
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS claimer_class text;
ALTER TABLE lost_items ADD COLUMN IF NOT EXISTS claimer_name text;

-- 인덱스: 수령 대기 중인 아이템 빠르게 조회
CREATE INDEX IF NOT EXISTS idx_lost_items_claimer ON lost_items (claimer_name) WHERE claimer_name IS NOT NULL;
