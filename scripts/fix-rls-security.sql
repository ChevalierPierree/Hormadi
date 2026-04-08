-- ============================================================
-- HORMADI — Enable Row-Level Security on ALL tables
-- Run this in Supabase SQL Editor immediately
-- ============================================================

-- Enable RLS on every table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Standing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TicketCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TicketOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShopOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShopOrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Partner" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES: Allow the service_role (used by Prisma) full access
-- The anon role (public) gets NO access by default
-- ============================================================

-- User table: service_role only
CREATE POLICY "service_role_all_users" ON "User"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- AdminLog: service_role only
CREATE POLICY "service_role_all_adminlog" ON "AdminLog"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Article: public can read published, service_role can do everything
CREATE POLICY "public_read_articles" ON "Article"
  FOR SELECT USING (published = true);
CREATE POLICY "service_role_all_articles" ON "Article"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Match: public can read, service_role can do everything
CREATE POLICY "public_read_matches" ON "Match"
  FOR SELECT USING (true);
CREATE POLICY "service_role_all_matches" ON "Match"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Standing: public can read, service_role can do everything
CREATE POLICY "public_read_standings" ON "Standing"
  FOR SELECT USING (true);
CREATE POLICY "service_role_all_standings" ON "Standing"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- TicketCategory: public can read, service_role can do everything
CREATE POLICY "public_read_ticket_categories" ON "TicketCategory"
  FOR SELECT USING (true);
CREATE POLICY "service_role_all_ticket_categories" ON "TicketCategory"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- TicketOrder: service_role only (contains customer PII)
CREATE POLICY "service_role_all_ticket_orders" ON "TicketOrder"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Product: public can read published, service_role can do everything
CREATE POLICY "public_read_products" ON "Product"
  FOR SELECT USING (published = true);
CREATE POLICY "service_role_all_products" ON "Product"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ShopOrder: service_role only (contains customer PII)
CREATE POLICY "service_role_all_shop_orders" ON "ShopOrder"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ShopOrderItem: service_role only
CREATE POLICY "service_role_all_shop_order_items" ON "ShopOrderItem"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Partner: public can read visible, service_role can do everything
CREATE POLICY "public_read_partners" ON "Partner"
  FOR SELECT USING (visible = true);
CREATE POLICY "service_role_all_partners" ON "Partner"
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- DONE! All tables are now protected by RLS.
-- Prisma uses the service_role connection string so it has
-- full access. Public anonymous access is restricted.
-- ============================================================
