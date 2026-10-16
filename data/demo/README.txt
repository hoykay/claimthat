ClaimThat Demo Dataset
======================

Synthetic test data for the AMD hackathon MVP.

Files:
- PO-55871.pdf       Purchase order: 320 units at $28.00
- INV-77102.pdf      Invoice: 320 units at $28.00
- PS-44891.pdf       Packing slip with receiving annotation: 288 units received
- ground_truth.json  Expected parsed values and claim calculation

Use your existing shipment.jpg as the shipment photo.

Expected claim:
- 32 units missing = $896.00
- 3 damaged cartons estimate = $1,944.00
- Total estimated claim = $2,840.00
