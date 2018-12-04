SELECT
      chip.id
    , chip.name
    , chip.description
    , chip.damage
    , chip.element
    , chip.memory
    , array_agg(combo.code) AS codes
    , chip.imageurl
FROM prj2_chip AS chip
INNER JOIN prj2_chip_code_combo AS combo
ON combo.chip = chip.id
GROUP BY chip.id
ORDER BY chip.id;
