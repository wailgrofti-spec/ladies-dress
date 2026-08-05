-- ============================================================
-- MIGRATION OPTIONNELLE : nouvelle liste de catégories
-- ============================================================
-- À exécuter UNIQUEMENT si vous avez déjà une base Supabase en
-- production avec l'ancienne liste de catégories (Sneakers, Bottines,
-- Chaussons...). Si vous configurez Supabase pour la première fois,
-- ignorez ce fichier : schema.sql contient déjà directement les 5
-- bonnes catégories.
--
-- Ce script renomme "Sneakers & Casual" en "Espadrilles" et
-- "Bottines & Bottes" en "Ballerines" (pour conserver les produits déjà
-- assignés sans les perdre), supprime "Chaussons" (si elle est vide),
-- et renomme les 3 catégories restantes. Adaptez les slugs ci-dessous
-- si vous les avez déjà personnalisés depuis l'admin.

update categories set slug = 'espadrilles', name_fr = 'Les Espadrilles', name_en = 'Espadrilles', name_ar = 'إسبادريل'
where slug = 'sneakers';

update categories set slug = 'ballerines', name_fr = 'Les Ballerines', name_en = 'Ballet Flats', name_ar = 'باليرين'
where slug = 'bottines';

update categories set name_fr = 'Les Talons' where slug = 'talons';
update categories set name_fr = 'Les Mocassins', name_en = 'Loafers' where slug = 'mocassins';
update categories set name_fr = 'Les Sandales' where slug = 'sandales';

-- Supprime "Chaussons" uniquement si aucun produit n'y est rattaché
delete from categories
where slug = 'chaussons'
  and not exists (select 1 from products where products.category_id = categories.id);

-- Si "Chaussons" contient des produits, réassignez-les manuellement avant
-- de la supprimer, par exemple :
-- update products set category_id = (select id from categories where slug = 'mocassins')
-- where category_id = (select id from categories where slug = 'chaussons');
-- delete from categories where slug = 'chaussons';
