-- Optional sample inventory for local/preview parity (skipped when units already exist).
insert into public.units (
  unit_number,
  bedrooms,
  bathrooms,
  parking,
  size_sqm,
  price,
  status,
  unit_type,
  image_url,
  floorplan_url,
  floor,
  direction
)
select *
from (
  values
    (
      '701',
      2,
      2,
      1,
      85::numeric,
      2650000::numeric,
      'Available'::text,
      'Type A'::text,
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'::text,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'::text,
      '7th'::text,
      'North'::text
    ),
    (
      '848',
      3,
      2,
      2,
      110::numeric,
      3200000::numeric,
      'Available'::text,
      'Type B'::text,
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'::text,
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'::text,
      '8th'::text,
      'South'::text
    ),
    (
      '1201',
      1,
      1,
      1,
      52::numeric,
      1890000::numeric,
      'Sold'::text,
      'Studio'::text,
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'::text,
      null::text,
      '12th'::text,
      'East'::text
    )
) as t(
  unit_number,
  bedrooms,
  bathrooms,
  parking,
  size_sqm,
  price,
  status,
  unit_type,
  image_url,
  floorplan_url,
  floor,
  direction
)
where not exists (select 1 from public.units limit 1);
