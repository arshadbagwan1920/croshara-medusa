DO $$
DECLARE
  r record;
  ps_id text;
  p_id text;
  amount_ int;
  region_id text := 'reg_01KXD8XRBBVMHHN65DRFG50VVA';
BEGIN
  FOR r IN SELECT v.id, v.sku, v.product_id FROM product_variant v WHERE NOT EXISTS (SELECT 1 FROM product_variant_price_set pvps WHERE pvps.variant_id = v.id) LOOP
    ps_id := gen_random_uuid()::text;
    p_id := gen_random_uuid()::text;

    amount_ := 599;
    IF r.sku LIKE 'infant-%' THEN amount_ := 799; END IF;
    IF r.sku LIKE 'toddler-%' THEN amount_ := 1299; END IF;
    IF r.sku LIKE 'gift-set-newborn%' THEN amount_ := 999; END IF;
    IF r.sku LIKE 'gift-set-premium%' THEN amount_ := 1599; END IF;
    IF r.sku LIKE 'gift-set-festival%' THEN amount_ := 1299; END IF;
    IF r.sku LIKE 'sibling-set%' THEN amount_ := 998; END IF;
    IF r.sku LIKE 'custom-order%' THEN amount_ := 799; END IF;
    IF r.sku LIKE 'winter-bundle%' THEN amount_ := 1999; END IF;
    IF r.sku LIKE 'slipper-%' THEN amount_ := 699; END IF;

    INSERT INTO price_set (id) VALUES (ps_id);
    INSERT INTO price (id, price_set_id, currency_code, amount, raw_amount) VALUES (p_id, ps_id, 'inr', amount_, ('{"region_id": "' || region_id || '"}')::jsonb);
    INSERT INTO price_rule (id, price_id, attribute, value, operator, priority) VALUES (gen_random_uuid()::text, p_id, 'region_id', region_id, 'eq', 0);
    INSERT INTO product_variant_price_set (variant_id, price_set_id, id) VALUES (r.id, ps_id, gen_random_uuid()::text);
  END LOOP;
  RAISE NOTICE 'Done setting up prices for all variants';
END $$;
